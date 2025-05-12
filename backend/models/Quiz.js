import mongoose from 'mongoose';

const optionSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [optionSchema],
  points: {
    type: Number,
    required: true,
    default: 1,
  },
});

const quizSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: Number, // in minutes
      required: true,
      default: 10,
    },
    questions: [questionSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;