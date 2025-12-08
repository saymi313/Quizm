import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import * as userService from './services/userService.js';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to DynamoDB\n');

    // Admin credentials
    const adminEmail = 'admin@quizm.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin User';

    // Check if admin already exists
    let adminUser = await userService.findUserByEmail(adminEmail);
    
    if (adminUser) {
      console.log('⚠️  Admin user already exists!');
      console.log(`\n📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log(`\n✅ You can login with these credentials.\n`);
      process.exit(0);
    }

    // Create admin user
    console.log('Creating admin user...\n');
    adminUser = await userService.createUser({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ADMIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👤 Name:     ${adminName}`);
    console.log(`🔐 Role:     admin`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ You can now login with these credentials!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

// Run the function
createAdmin();

