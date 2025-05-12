import Result from '../models/Result.js';
import Quiz from '../models/Quiz.js';
import calculateScore from '../utils/calculateScore.js';

// @desc    Submit quiz answers
// @route   POST /api/result/submit/:quizId
// @access  Private
const submitQuiz = async (req, res) => {
  const { answers, timeTaken } = req.body;
  const quizId = req.params.quizId;

  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  // Calculate score
  const { score, totalPossibleScore, answers: gradedAnswers } = calculateScore(quiz, answers);

  // Create result
  const result = await Result.create({
    user: req.user._id,
    quiz: quizId,
    score,
    totalPossibleScore,
    timeTaken,
    answers: gradedAnswers,
  });

  if (result) {
    res.status(201).json(result);
  } else {
    res.status(400);
    throw new Error('Invalid result data');
  }
};

// @desc    Get user's quiz history
// @route   GET /api/result/user/:userId
// @access  Private
const getUserResults = async (req, res) => {
  // Ensure users can only see their own results unless admin
  if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view these results');
  }

  const results = await Result.find({ user: req.params.userId })
    .populate('quiz', 'title description')
    .sort({ createdAt: -1 });

  res.json(results);
};

// @desc    Get all results for a quiz
// @route   GET /api/result/quiz/:quizId
// @access  Private/Admin
const getQuizResults = async (req, res) => {
  const results = await Result.find({ quiz: req.params.quizId })
    .populate('user', 'name email')
    .sort({ score: -1, timeTaken: 1 });

  res.json(results);
};

// @desc    Get leaderboard for a quiz
// @route   GET /api/result/leaderboard/:quizId
// @access  Public
const getLeaderboard = async (req, res) => {
  const leaderboard = await Result.find({ quiz: req.params.quizId })
    .populate('user', 'name')
    .sort({ score: -1, timeTaken: 1 })
    .limit(10)
    .select('user score timeTaken createdAt');

  res.json(leaderboard);
};

// @desc    Get detailed result report
// @route   GET /api/result/report/:resultId
// @access  Private
const getResultReport = async (req, res) => {
  const result = await Result.findById(req.params.resultId)
    .populate('quiz')
    .populate('user', 'name email');

  if (!result) {
    res.status(404);
    throw new Error('Result not found');
  }

  // Ensure users can only see their own results unless admin
  if (
    result.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this result');
  }

  res.json(result);
};

export {
  submitQuiz,
  getUserResults,
  getQuizResults,
  getLeaderboard,
  getResultReport,
};