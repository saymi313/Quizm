import express from 'express';
import {
  submitQuiz,
  getUserResults,
  getQuizResults,
  getLeaderboard,
  getResultReport,
} from '../controllers/resultController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/submit/:quizId', protect, submitQuiz);
router.get('/user/:userId', protect, getUserResults);
router.get('/quiz/:quizId', protect, admin, getQuizResults);
router.get('/leaderboard/:quizId', getLeaderboard);
router.get('/report/:resultId', protect, getResultReport);

export default router;