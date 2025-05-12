import Quiz from '../models/Quiz.js';
import mongoose from 'mongoose';

import QuizModel from '../models/Quiz.js';

// @desc    Get all quizzes
// @route   GET /api/quiz
// @access  Public (for published quizzes) / Private (for admin to see all)
const getQuizzes = async (req, res) => {
  const isAdmin = req.user && req.user.role === 'admin';
  
  // If admin, get all quizzes, otherwise only published ones
  const filter = isAdmin ? {} : { isPublished: true };
  
  try {
    const quizzes = await QuizModel.find(filter)
      .select('title description timeLimit isPublished createdAt')
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quiz/:id
// @access  Public (for published) / Private (for admin)
const getQuizById = async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId for quizId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid quiz ID' });
  }

  try {
    const quiz = await QuizModel.findById(id);

    if (quiz) {
      const isAdmin = req.user && req.user.role === 'admin';

      // Check if quiz is published or user is admin
      if (quiz.isPublished || isAdmin) {
        res.json(quiz);
      } else {
        res.status(403).json({ message: 'Quiz is not published' });
      }
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a quiz
// @route   POST /api/quiz
// @access  Private/Admin
const createQuiz = async (req, res) => {
  const { title, description, timeLimit, questions, isPublished } = req.body;

  // Validate the ObjectId for createdBy
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  // Remove custom _id from questions and options to avoid ObjectId casting errors
  const cleanedQuestions = questions.map((q) => {
    // Remove _id from the question if it exists and it's not a valid ObjectId
    const { _id, ...questionWithoutId } = q;
    
    // Return question without temporary ID and with cleaned options
    return {
      ...questionWithoutId,
      options: q.options.map((opt) => {
        const { _id, ...rest } = opt;
        return rest;
      }),
    };
  });

  try {
    const quiz = await QuizModel.create({
      title,
      description,
      timeLimit,
      questions: cleanedQuestions,
      isPublished: isPublished || false,
      createdBy: req.user._id, // Ensure this is valid
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Invalid quiz data', error: error.message });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quiz/:id
// @access  Private/Admin
const updateQuiz = async (req, res) => {
  const { title, description, timeLimit, questions, isPublished } = req.body;

  // Validate the ObjectId for quizId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid quiz ID' });
  }

  try {
    const quiz = await QuizModel.findById(req.params.id);

    if (quiz) {
      quiz.title = title || quiz.title;
      quiz.description = description || quiz.description;
      quiz.timeLimit = timeLimit || quiz.timeLimit;

      // Clean questions and options _id if questions are provided
      if (questions) {
        quiz.questions = questions.map((q) => {
          // Remove _id from the question if it exists and it's not a valid ObjectId
          const { _id, ...questionWithoutId } = q;
          
          // Return question without temporary ID and with cleaned options
          return {
            ...questionWithoutId,
            options: q.options.map((opt) => {
              const { _id, ...rest } = opt;
              return rest;
            }),
          };
        });
      }

      quiz.isPublished = isPublished !== undefined ? isPublished : quiz.isPublished;

      const updatedQuiz = await quiz.save();
      res.json(updatedQuiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quiz/:id
// @access  Private/Admin
const deleteQuiz = async (req, res) => {
  // Validate the ObjectId for quizId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid quiz ID' });
  }

  try {
    const quiz = await QuizModel.findById(req.params.id);

    if (quiz) {
      await QuizModel.deleteOne({ _id: quiz._id });
      res.json({ message: 'Quiz removed' });
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz };