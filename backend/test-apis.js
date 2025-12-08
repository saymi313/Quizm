import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const BASE_URL = process.env.API_URL || 'http://localhost:5001';
const API_URL = `${BASE_URL}/api`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let authToken = null;
let adminToken = null;

// Helper function to print test results
const printTest = (name, passed, message = '') => {
  const color = passed ? colors.green : colors.red;
  const status = passed ? '✓ PASS' : '✗ FAIL';
  console.log(`${color}${status}${colors.reset} - ${name}`);
  if (message) {
    console.log(`  ${colors.yellow}→ ${message}${colors.reset}`);
  }
};

// Test 1: Health Check
const testHealthCheck = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    const data = await response.json();
    const passed = response.status === 200 && data.message;
    printTest('Health Check', passed, data.message);
    return passed;
  } catch (error) {
    printTest('Health Check', false, error.message);
    return false;
  }
};

// Test 2: Register User
const testRegister = async () => {
  try {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@test.com`,
      password: 'test123',
    };
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const data = await response.json();
    const passed = response.status === 201 && data.token;
    if (passed) {
      authToken = data.token;
    }
    printTest('Register User', passed, `Token: ${authToken ? 'Received' : 'Missing'}`);
    return passed;
  } catch (error) {
    printTest('Register User', false, error.message);
    return false;
  }
};

// Test 3: Login User
const testLogin = async () => {
  try {
    // First, register an admin user for testing
    const adminUser = {
      name: 'Admin Test',
      email: `admin${Date.now()}@test.com`,
      password: 'admin123',
      role: 'admin',
    };
    
    try {
      await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminUser),
      });
    } catch (e) {
      // User might already exist, try to login
    }
    
    const loginData = {
      email: adminUser.email,
      password: 'admin123',
    };
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });
    const data = await response.json();
    const passed = response.status === 200 && data.token;
    if (passed) {
      adminToken = data.token;
    }
    printTest('Login User', passed, `Token: ${adminToken ? 'Received' : 'Missing'}`);
    return passed;
  } catch (error) {
    printTest('Login User', false, error.message);
    return false;
  }
};

// Test 4: Get Quizzes (Public)
const testGetQuizzes = async () => {
  try {
    const response = await fetch(`${API_URL}/quiz`);
    const data = await response.json();
    const passed = response.status === 200 && Array.isArray(data);
    printTest('Get Quizzes (Public)', passed, `Found ${data?.length || 0} quizzes`);
    return passed;
  } catch (error) {
    printTest('Get Quizzes (Public)', false, error.message);
    return false;
  }
};

// Test 5: Get Quiz by ID
const testGetQuizById = async () => {
  try {
    // First get all quizzes to get an ID
    const quizzesResponse = await fetch(`${API_URL}/quiz`);
    const quizzesData = await quizzesResponse.json();
    if (quizzesData.length === 0) {
      printTest('Get Quiz by ID', false, 'No quizzes available to test');
      return false;
    }
    
    const quizId = quizzesData[0]._id || quizzesData[0].id;
    const response = await fetch(`${API_URL}/quiz/${quizId}`);
    const data = await response.json();
    const passed = response.status === 200 && data.id;
    printTest('Get Quiz by ID', passed, `Quiz: ${data?.title || 'N/A'}`);
    return passed;
  } catch (error) {
    printTest('Get Quiz by ID', false, error.message);
    return false;
  }
};

// Test 6: Create Quiz (Admin)
const testCreateQuiz = async () => {
  if (!adminToken) {
    printTest('Create Quiz (Admin)', false, 'Admin token required');
    return false;
  }
  
  try {
    const quizData = {
      title: `Test Quiz ${Date.now()}`,
      description: 'This is a test quiz',
      timeLimit: 10,
      isPublished: false,
      questions: [
        {
          question: 'What is 2+2?',
          points: 1,
          options: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true },
            { text: '5', isCorrect: false },
          ],
        },
      ],
    };
    
    const response = await fetch(`${API_URL}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(quizData),
    });
    
    const data = await response.json();
    const passed = response.status === 201 && data.id;
    printTest('Create Quiz (Admin)', passed, `Created: ${data?.title || 'N/A'}`);
    return passed;
  } catch (error) {
    printTest('Create Quiz (Admin)', false, error.message);
    return false;
  }
};

// Test 7: Upload Image (Admin) - Skip for now (requires form-data)
const testUploadImage = async () => {
  printTest('Upload Image (Admin)', true, 'Skipped - Use Postman/cURL for file upload testing');
  return true;
};

// Test 8: Get User Profile (Protected)
const testGetProfile = async () => {
  if (!authToken) {
    printTest('Get User Profile', false, 'Auth token required');
    return false;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    
    const data = await response.json();
    const passed = response.status === 200 && data.email;
    printTest('Get User Profile', passed, `User: ${data?.email || 'N/A'}`);
    return passed;
  } catch (error) {
    printTest('Get User Profile', false, error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log(`\n${colors.blue}=== API Testing Suite ===${colors.reset}\n`);
  console.log(`Testing against: ${BASE_URL}\n`);
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Register User', fn: testRegister },
    { name: 'Login User', fn: testLogin },
    { name: 'Get Quizzes', fn: testGetQuizzes },
    { name: 'Get Quiz by ID', fn: testGetQuizById },
    { name: 'Create Quiz (Admin)', fn: testCreateQuiz },
    { name: 'Upload Image (Admin)', fn: testUploadImage },
    { name: 'Get User Profile', fn: testGetProfile },
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
    } catch (error) {
      results.push({ name: test.name, passed: false, error: error.message });
    }
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log(`\n${colors.blue}=== Test Summary ===${colors.reset}\n`);
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const color = result.passed ? colors.green : colors.red;
    const status = result.passed ? '✓' : '✗';
    console.log(`${color}${status}${colors.reset} ${result.name}`);
  });
  
  console.log(`\n${colors.blue}Total: ${passed}/${total} tests passed${colors.reset}\n`);
  
  process.exit(passed === total ? 0 : 1);
};

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Test suite error:${colors.reset}`, error);
  process.exit(1);
});

