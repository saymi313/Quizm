import * as resultService from '../services/resultService.js';
import * as quizService from '../services/quizService.js';
import * as userService from '../services/userService.js';
import calculateScore from '../utils/calculateScore.js';

// @desc    Submit quiz answers
// @route   POST /api/result/submit/:quizId
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quizId = req.params.quizId;

    const quiz = await quizService.getQuizById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Format quiz for calculateScore (it expects _id format)
    const formattedQuiz = {
      _id: quiz.id,
      questions: quiz.questions.map((q) => ({
        _id: q.id,
        points: q.points,
        options: q.options.map((opt) => ({
          _id: opt.id,
          isCorrect: opt.isCorrect,
        })),
      })),
    };

    // Calculate score
    const { score, totalPossibleScore, answers: gradedAnswers } = calculateScore(
      formattedQuiz,
      answers
    );

    // Create result
    const result = await resultService.createResult({
      userId: req.user.id,
      quizId: quizId,
      score,
      totalPossibleScore,
      timeTaken,
      answers: gradedAnswers,
    });

    if (result) {
      // Format response
      const formattedResult = {
        _id: result.id,
        id: result.id,
        user: result.userId,
        quiz: result.quizId,
        score: result.score,
        totalPossibleScore: result.totalPossibleScore,
        timeTaken: result.timeTaken,
        answers: result.answers,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
      res.status(201).json(formattedResult);
    } else {
      res.status(400).json({ message: 'Invalid result data' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's quiz history
// @route   GET /api/result/user/:userId
// @access  Private
const getUserResults = async (req, res) => {
  try {
    // Ensure users can only see their own results unless admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these results' });
    }

    const results = await resultService.getResultsByUserId(req.params.userId);

    // Populate quiz information
    const resultsWithQuiz = await Promise.all(
      results.map(async (result) => {
        const quiz = await quizService.getQuizById(result.quizId);
        return {
          _id: result.id,
          id: result.id,
          user: result.userId,
          quiz: {
            _id: quiz?.id,
            id: quiz?.id,
            title: quiz?.title,
            description: quiz?.description,
          },
          score: result.score,
          totalPossibleScore: result.totalPossibleScore,
          timeTaken: result.timeTaken,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        };
      })
    );

    res.json(resultsWithQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all results for a quiz
// @route   GET /api/result/quiz/:quizId
// @access  Private/Admin
const getQuizResults = async (req, res) => {
  try {
    const results = await resultService.getResultsByQuizId(req.params.quizId);

    // Populate user information and sort
    const resultsWithUser = await Promise.all(
      results.map(async (result) => {
        const user = await userService.findUserById(result.userId);
        return {
          _id: result.id,
          id: result.id,
          user: {
            _id: user?.id,
            id: user?.id,
            name: user?.name,
            email: user?.email,
          },
          quiz: result.quizId,
          score: result.score,
          totalPossibleScore: result.totalPossibleScore,
          timeTaken: result.timeTaken,
          createdAt: result.createdAt,
        };
      })
    );

    // Sort by score descending, then timeTaken ascending
    resultsWithUser.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeTaken - b.timeTaken;
    });

    res.json(resultsWithUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard for a quiz
// @route   GET /api/result/leaderboard/:quizId
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await resultService.getLeaderboard(req.params.quizId);

    // Populate user information
    const leaderboardWithUser = await Promise.all(
      leaderboard.map(async (result) => {
        const user = await userService.findUserById(result.userId);
        return {
          _id: result.id,
          id: result.id,
          user: {
            _id: user?.id,
            id: user?.id,
            name: user?.name,
          },
          score: result.score,
          timeTaken: result.timeTaken,
          createdAt: result.createdAt,
        };
      })
    );

    res.json(leaderboardWithUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed result report
// @route   GET /api/result/report/:resultId
// @access  Private
const getResultReport = async (req, res) => {
  try {
    const result = await resultService.getResultById(req.params.resultId);

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Ensure users can only see their own results unless admin
    if (result.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this result' });
    }

    // Populate quiz and user information
    const quiz = await quizService.getQuizById(result.quizId);
    const user = await userService.findUserById(result.userId);

    const formattedResult = {
      _id: result.id,
      id: result.id,
      user: {
        _id: user?.id,
        id: user?.id,
        name: user?.name,
        email: user?.email,
      },
      quiz: quiz ? {
        _id: quiz.id,
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questions: quiz.questions,
      } : null,
      score: result.score,
      totalPossibleScore: result.totalPossibleScore,
      timeTaken: result.timeTaken,
      answers: result.answers,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    res.json(formattedResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  submitQuiz,
  getUserResults,
  getQuizResults,
  getLeaderboard,
  getResultReport,
};
