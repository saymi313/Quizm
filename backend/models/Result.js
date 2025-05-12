import mongoose from 'mongoose';

const answerSchema = mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  selectedOption: {
    type: mongoose.Schema.Types.ObjectId,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const resultSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Quiz',
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPossibleScore: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number, // in seconds
      required: true,
    },
    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model('Result', resultSchema);

export default Result;