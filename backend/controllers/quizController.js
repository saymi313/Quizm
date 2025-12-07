import * as quizService from '../services/quizService.js';
import * as userService from '../services/userService.js';

// @desc    Get all quizzes
// @route   GET /api/quiz
// @access  Public (for published quizzes) / Private (for admin to see all)
const getQuizzes = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const filterPublished = !isAdmin;

    const quizzes = await quizService.getAllQuizzes(filterPublished);

    // Format for response (select only needed fields)
    const formattedQuizzes = quizzes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((quiz) => ({
        _id: quiz.id,
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        isPublished: quiz.isPublished,
        createdAt: quiz.createdAt,
      }));

    res.json(formattedQuizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quiz/:id
// @access  Public (for published) / Private (for admin)
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await quizService.getQuizById(id);

    if (quiz) {
      const isAdmin = req.user && req.user.role === 'admin';

      // Check if quiz is published or user is admin
      if (quiz.isPublished || isAdmin) {
        // Format response to match expected structure
        const formattedQuiz = {
          _id: quiz.id,
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          questions: quiz.questions.map((q) => ({
            _id: q.id,
            id: q.id,
            question: q.question,
            points: q.points,
            options: q.options.map((opt) => ({
              _id: opt.id,
              id: opt.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          })),
          isPublished: quiz.isPublished,
          createdBy: quiz.createdBy,
          createdAt: quiz.createdAt,
          updatedAt: quiz.updatedAt,
        };
        res.json(formattedQuiz);
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
  try {
    const { title, description, timeLimit, questions, isPublished } = req.body;

    // Clean questions and options - remove temporary IDs
    const cleanedQuestions = questions.map((q) => ({
      question: q.question,
      points: q.points || 1,
      options: q.options.map((opt) => ({
        text: opt.text,
        isCorrect: opt.isCorrect || false,
      })),
    }));

    const quiz = await quizService.createQuiz({
      title,
      description,
      timeLimit,
      questions: cleanedQuestions,
      isPublished: isPublished || false,
      createdBy: req.user.id,
    });

    // Format response
    const formattedQuiz = {
      _id: quiz.id,
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((q) => ({
        _id: q.id,
        id: q.id,
        question: q.question,
        points: q.points,
        options: q.options.map((opt) => ({
          _id: opt.id,
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      })),
      isPublished: quiz.isPublished,
      createdBy: quiz.createdBy,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };

    res.status(201).json(formattedQuiz);
  } catch (error) {
    res.status(400).json({ message: 'Invalid quiz data', error: error.message });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quiz/:id
// @access  Private/Admin
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, timeLimit, questions, isPublished } = req.body;

    const existingQuiz = await quizService.getQuizById(id);

    if (!existingQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (timeLimit !== undefined) updateData.timeLimit = timeLimit;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    if (questions !== undefined) {
      // Clean questions - preserve existing IDs if present
      updateData.questions = questions.map((q) => ({
        id: q.id || q._id || undefined, // Preserve ID if exists
        question: q.question,
        points: q.points || 1,
        options: q.options.map((opt) => ({
          id: opt.id || opt._id || undefined, // Preserve ID if exists
          text: opt.text,
          isCorrect: opt.isCorrect || false,
        })),
      }));
    }

    const updatedQuiz = await quizService.updateQuiz(id, updateData);

    if (updatedQuiz) {
      // Format response
      const formattedQuiz = {
        _id: updatedQuiz.id,
        id: updatedQuiz.id,
        title: updatedQuiz.title,
        description: updatedQuiz.description,
        timeLimit: updatedQuiz.timeLimit,
        questions: updatedQuiz.questions.map((q) => ({
          _id: q.id,
          id: q.id,
          question: q.question,
          points: q.points,
          options: q.options.map((opt) => ({
            _id: opt.id,
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        })),
        isPublished: updatedQuiz.isPublished,
        createdBy: updatedQuiz.createdBy,
        createdAt: updatedQuiz.createdAt,
        updatedAt: updatedQuiz.updatedAt,
      };
      res.json(formattedQuiz);
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
  try {
    const { id } = req.params;

    const quiz = await quizService.getQuizById(id);

    if (quiz) {
      await quizService.deleteQuiz(id);
      res.json({ message: 'Quiz removed' });
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz };
