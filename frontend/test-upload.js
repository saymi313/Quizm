import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Configuration
// Try direct backend URL first (CloudFront might block POST requests)
const API_BASE_URL = process.env.API_URL || 'http://54.87.191.72:5001';
const LOGIN_URL = `${API_BASE_URL}/api/auth/login`;
const UPLOAD_URL = `${API_BASE_URL}/api/upload`;

// Admin credentials
const ADMIN_EMAIL = 'admin@quizm.com';
const ADMIN_PASSWORD = 'admin123';

// Image to upload (using student-learning.jpeg as test)
const IMAGE_PATH = path.join(__dirname, 'images', 'student-learning.jpeg');

async function testImageUpload() {
  try {
    console.log('🚀 Starting image upload test...\n');

    // Step 1: Login as admin
    console.log('📝 Step 1: Logging in as admin...');
    const loginResponse = await axios.post(LOGIN_URL, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (!loginResponse.data || !loginResponse.data.token) {
      throw new Error('Login failed: No token received');
    }

    const token = loginResponse.data.token;
    console.log('✅ Login successful!\n');

    // Step 2: Check if image file exists
    console.log('📁 Step 2: Checking image file...');
    if (!fs.existsSync(IMAGE_PATH)) {
      throw new Error(`Image file not found: ${IMAGE_PATH}`);
    }
    console.log(`✅ Image file found: ${IMAGE_PATH}\n`);

    // Step 3: Upload image
    console.log('📤 Step 3: Uploading image to S3...');
    
    // Read the file
    const imageBuffer = fs.readFileSync(IMAGE_PATH);
    const imageStats = fs.statSync(IMAGE_PATH);
    
    console.log(`   File size: ${(imageStats.size / 1024).toFixed(2)} KB`);
    console.log(`   File name: ${path.basename(IMAGE_PATH)}\n`);

    // Create form data
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: path.basename(IMAGE_PATH),
      contentType: 'image/jpeg',
    });

    // Upload to S3
    const uploadResponse = await axios.post(UPLOAD_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (uploadResponse.data && uploadResponse.data.success) {
      console.log('✅ Upload successful!\n');
      console.log('📋 Upload Details:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✅ Success: ${uploadResponse.data.success}`);
      console.log(`📷 Image URL: ${uploadResponse.data.imageUrl}`);
      console.log(`💬 Message: ${uploadResponse.data.message}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('🎉 Image has been uploaded to S3!');
      console.log(`🔗 You can view it at: ${uploadResponse.data.imageUrl}`);
      console.log('\n✅ Check your S3 bucket to verify the image is present.');
    } else {
      throw new Error('Upload failed: Invalid response');
    }

  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.message || error.response.statusText}`);
      if (error.response.data) {
        console.error('Response:', JSON.stringify(error.response.data, null, 2));
      }
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }
}

// Run the test
testImageUpload();

