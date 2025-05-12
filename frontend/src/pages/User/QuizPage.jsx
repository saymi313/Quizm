import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Timer from '../../components/Timer';
import QuizQuestion from '../../components/QuizQuestion';
import quizService from '../../services/quizService';
import resultService from '../../services/resultService';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuizById(id);
        setQuiz(data);
        setStartTime(Date.now());
        setLoading(false);
      } catch (error) {
        setError('Failed to load quiz. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSelectOption = (questionId, optionId) => {
    const existingAnswerIndex = userAnswers.findIndex(
      (answer) => answer.questionId === questionId
    );
    
    if (existingAnswerIndex !== -1) {
      // Update existing answer
      const updatedAnswers = [...userAnswers];
      updatedAnswers[existingAnswerIndex] = {
        ...updatedAnswers[existingAnswerIndex],
        selectedOption: optionId,
      };
      setUserAnswers(updatedAnswers);
    } else {
      // Add new answer
      setUserAnswers([...userAnswers, { questionId, selectedOption: optionId }]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTimeUp = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    if (confirmSubmit || userAnswers.length === 0) {
      try {
        setSubmitting(true);
        
        // Calculate time taken in seconds
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        
        const result = await resultService.submitQuiz(id, userAnswers, timeTaken);
        
        // Navigate to result page
        navigate(`/result/${result._id}`);
      } catch (error) {
        setError('Failed to submit quiz. Please try again.');
        setSubmitting(false);
        setConfirmSubmit(false);
      }
    } else {
      setConfirmSubmit(true);
    }
  };

  const cancelSubmit = () => {
    setConfirmSubmit(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>Quiz not found.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOption = userAnswers.find(
    (answer) => answer.questionId === currentQuestion._id
  )?.selectedOption;

  const answeredQuestionsCount = userAnswers.length;
  const progressPercentage = (answeredQuestionsCount / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
          <Timer initialMinutes={quiz.timeLimit} onTimeUp={handleTimeUp} />
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{answeredQuestionsCount} of {quiz.questions.length} questions answered</span>
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Submit Quiz?</h3>
            <p className="mb-6">
              You have answered {answeredQuestionsCount} out of {quiz.questions.length} questions. 
              Are you sure you want to submit?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelSubmit}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Question */}
      <QuizQuestion
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        selectedOption={selectedOption}
        onSelectOption={handleSelectOption}
        showResults={false}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevQuestion}
          className="btn btn-secondary flex items-center"
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Previous
        </button>
        
        <div className="flex space-x-4">
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={() => setConfirmSubmit(true)}
              className="btn btn-primary flex items-center"
              disabled={submitting}
            >
              <Check className="h-5 w-5 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn btn-primary flex items-center"
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;