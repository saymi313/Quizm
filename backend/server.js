import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Get the directory path of the current module (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the backend directory
dotenv.config({ path: join(__dirname, '.env') });

// Connect to DynamoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'QuizApp Backend is running!' });
});
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/result', resultRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});