import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import * as quizService from './services/quizService.js';
import * as userService from './services/userService.js';

// Get the directory path of the current module (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

// Sample quizzes data
const quizzesData = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and data types.',
    timeLimit: 15,
    isPublished: true,
    questions: [
      {
        question: 'What is the correct way to declare a variable in JavaScript?',
        points: 1,
        options: [
          { text: 'var x = 5;', isCorrect: true },
          { text: 'variable x = 5;', isCorrect: false },
          { text: 'v x = 5;', isCorrect: false },
          { text: 'declare x = 5;', isCorrect: false },
        ],
      },
      {
        question: 'Which method is used to add an element to the end of an array?',
        points: 1,
        options: [
          { text: 'push()', isCorrect: true },
          { text: 'add()', isCorrect: false },
          { text: 'append()', isCorrect: false },
          { text: 'insert()', isCorrect: false },
        ],
      },
      {
        question: 'What does the typeof operator return for an array?',
        points: 1,
        options: [
          { text: '"object"', isCorrect: true },
          { text: '"array"', isCorrect: false },
          { text: '"list"', isCorrect: false },
          { text: '"collection"', isCorrect: false },
        ],
      },
      {
        question: 'Which of the following is a valid way to create a function?',
        points: 1,
        options: [
          { text: 'function myFunc() {}', isCorrect: true },
          { text: 'func myFunc() {}', isCorrect: false },
          { text: 'def myFunc() {}', isCorrect: false },
          { text: 'method myFunc() {}', isCorrect: false },
        ],
      },
      {
        question: 'What is the result of: console.log(2 + "2")?',
        points: 1,
        options: [
          { text: '"22"', isCorrect: true },
          { text: '4', isCorrect: false },
          { text: 'NaN', isCorrect: false },
          { text: 'Error', isCorrect: false },
        ],
      },
    ],
  },
  {
    title: 'React.js Basics',
    description: 'Assess your understanding of React concepts including components, hooks, and state management.',
    timeLimit: 20,
    isPublished: true,
    questions: [
      {
        question: 'What is React?',
        points: 1,
        options: [
          { text: 'A JavaScript library for building user interfaces', isCorrect: true },
          { text: 'A database management system', isCorrect: false },
          { text: 'A server-side framework', isCorrect: false },
          { text: 'A programming language', isCorrect: false },
        ],
      },
      {
        question: 'Which hook is used to manage state in functional components?',
        points: 1,
        options: [
          { text: 'useState', isCorrect: true },
          { text: 'useEffect', isCorrect: false },
          { text: 'useContext', isCorrect: false },
          { text: 'useReducer', isCorrect: false },
        ],
      },
      {
        question: 'What is JSX?',
        points: 1,
        options: [
          { text: 'A syntax extension for JavaScript that looks like HTML', isCorrect: true },
          { text: 'A new programming language', isCorrect: false },
          { text: 'A database query language', isCorrect: false },
          { text: 'A CSS framework', isCorrect: false },
        ],
      },
      {
        question: 'Which lifecycle method is equivalent to useEffect with empty dependency array?',
        points: 1,
        options: [
          { text: 'componentDidMount', isCorrect: true },
          { text: 'componentDidUpdate', isCorrect: false },
          { text: 'componentWillUnmount', isCorrect: false },
          { text: 'componentWillMount', isCorrect: false },
        ],
      },
      {
        question: 'What is the purpose of keys in React lists?',
        points: 1,
        options: [
          { text: 'To help React identify which items have changed', isCorrect: true },
          { text: 'To encrypt the data', isCorrect: false },
          { text: 'To sort the list', isCorrect: false },
          { text: 'To filter the list', isCorrect: false },
        ],
      },
    ],
  },
  {
    title: 'Node.js and Express',
    description: 'Test your knowledge of Node.js runtime and Express.js framework for building backend APIs.',
    timeLimit: 15,
    isPublished: true,
    questions: [
      {
        question: 'What is Node.js?',
        points: 1,
        options: [
          { text: 'A JavaScript runtime built on Chrome\'s V8 engine', isCorrect: true },
          { text: 'A frontend framework', isCorrect: false },
          { text: 'A database system', isCorrect: false },
          { text: 'A CSS preprocessor', isCorrect: false },
        ],
      },
      {
        question: 'Which method is used to handle GET requests in Express?',
        points: 1,
        options: [
          { text: 'app.get()', isCorrect: true },
          { text: 'app.fetch()', isCorrect: false },
          { text: 'app.retrieve()', isCorrect: false },
          { text: 'app.read()', isCorrect: false },
        ],
      },
      {
        question: 'What does middleware do in Express?',
        points: 1,
        options: [
          { text: 'Functions that execute during the request-response cycle', isCorrect: true },
          { text: 'Database connection handlers', isCorrect: false },
          { text: 'Template engines', isCorrect: false },
          { text: 'Authentication libraries', isCorrect: false },
        ],
      },
      {
        question: 'Which package is commonly used for environment variables in Node.js?',
        points: 1,
        options: [
          { text: 'dotenv', isCorrect: true },
          { text: 'env-var', isCorrect: false },
          { text: 'config', isCorrect: false },
          { text: 'settings', isCorrect: false },
        ],
      },
      {
        question: 'What is the default port for Express applications?',
        points: 1,
        options: [
          { text: 'There is no default, you must specify it', isCorrect: true },
          { text: '3000', isCorrect: false },
          { text: '8080', isCorrect: false },
          { text: '5000', isCorrect: false },
        ],
      },
    ],
  },
  {
    title: 'MongoDB and Database Concepts',
    description: 'Evaluate your understanding of MongoDB, NoSQL databases, and database operations.',
    timeLimit: 15,
    isPublished: true,
    questions: [
      {
        question: 'What is MongoDB?',
        points: 1,
        options: [
          { text: 'A NoSQL document database', isCorrect: true },
          { text: 'A relational database', isCorrect: false },
          { text: 'A graph database', isCorrect: false },
          { text: 'A key-value store', isCorrect: false },
        ],
      },
      {
        question: 'What is a collection in MongoDB?',
        points: 1,
        options: [
          { text: 'A group of documents, similar to a table in SQL', isCorrect: true },
          { text: 'A database', isCorrect: false },
          { text: 'A field in a document', isCorrect: false },
          { text: 'A query method', isCorrect: false },
        ],
      },
      {
        question: 'Which method is used to find documents in MongoDB?',
        points: 1,
        options: [
          { text: 'find()', isCorrect: true },
          { text: 'search()', isCorrect: false },
          { text: 'query()', isCorrect: false },
          { text: 'get()', isCorrect: false },
        ],
      },
      {
        question: 'What is Mongoose?',
        points: 1,
        options: [
          { text: 'An ODM (Object Data Modeling) library for MongoDB and Node.js', isCorrect: true },
          { text: 'A database server', isCorrect: false },
          { text: 'A query language', isCorrect: false },
          { text: 'A migration tool', isCorrect: false },
        ],
      },
      {
        question: 'Which method is used to save a new document in Mongoose?',
        points: 1,
        options: [
          { text: 'save() or create()', isCorrect: true },
          { text: 'insert()', isCorrect: false },
          { text: 'add()', isCorrect: false },
          { text: 'store()', isCorrect: false },
        ],
      },
    ],
  },
  {
    title: 'General Programming Knowledge',
    description: 'Test your understanding of fundamental programming concepts and best practices.',
    timeLimit: 20,
    isPublished: true,
    questions: [
      {
        question: 'What is the time complexity of binary search?',
        points: 1,
        options: [
          { text: 'O(log n)', isCorrect: true },
          { text: 'O(n)', isCorrect: false },
          { text: 'O(n log n)', isCorrect: false },
          { text: 'O(1)', isCorrect: false },
        ],
      },
      {
        question: 'What does REST stand for?',
        points: 1,
        options: [
          { text: 'Representational State Transfer', isCorrect: true },
          { text: 'Remote State Transfer', isCorrect: false },
          { text: 'Resource State Transfer', isCorrect: false },
          { text: 'Representative State Transfer', isCorrect: false },
        ],
      },
      {
        question: 'What is the purpose of version control systems like Git?',
        points: 1,
        options: [
          { text: 'To track changes in code and collaborate with others', isCorrect: true },
          { text: 'To compile code', isCorrect: false },
          { text: 'To deploy applications', isCorrect: false },
          { text: 'To test code', isCorrect: false },
        ],
      },
      {
        question: 'What is an API?',
        points: 1,
        options: [
          { text: 'Application Programming Interface - a set of protocols for building software', isCorrect: true },
          { text: 'A database', isCorrect: false },
          { text: 'A programming language', isCorrect: false },
          { text: 'A web framework', isCorrect: false },
        ],
      },
      {
        question: 'What is the difference between let and const in JavaScript?',
        points: 1,
        options: [
          { text: 'let can be reassigned, const cannot be reassigned', isCorrect: true },
          { text: 'const can be reassigned, let cannot', isCorrect: false },
          { text: 'They are identical', isCorrect: false },
          { text: 'let is for functions, const is for variables', isCorrect: false },
        ],
      },
    ],
  },
];

// Seed function
const seedQuizzes = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to DynamoDB');

    // Find or create an admin user
    let adminUser = await userService.findUserByRole('admin');
    
    if (!adminUser) {
      // Create a default admin user if none exists
      adminUser = await userService.createUser({
        name: 'Admin User',
        email: 'admin@quizm.com',
        password: 'admin123', // In production, use a secure password
        role: 'admin',
      });
      console.log('Created admin user:', adminUser.email);
    } else {
      console.log('Using existing admin user:', adminUser.email);
    }

    // Create quizzes
    const createdQuizzes = [];
    for (const quizData of quizzesData) {
      const quiz = await quizService.createQuiz({
        ...quizData,
        createdBy: adminUser.id,
      });
      createdQuizzes.push(quiz);
      console.log(`Created quiz: ${quiz.title}`);
    }

    console.log(`\n✅ Successfully seeded ${createdQuizzes.length} quizzes!`);
    console.log('\nQuizzes created:');
    createdQuizzes.forEach((quiz) => {
      console.log(`  - ${quiz.title} (${quiz.questions.length} questions)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
};

// Run the seed function
seedQuizzes();
