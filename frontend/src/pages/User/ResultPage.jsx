import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, Clock, Award, ArrowLeft, Share2 } from 'lucide-react';
import QuizQuestion from '../../components/QuizQuestion';
import resultService from '../../services/resultService';

const ResultPage = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await resultService.getResultReport(resultId);
        setResult(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load result. Please try again later.');
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculatePercentage = (score, total) => {
    return Math.round((score / total) * 100);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading result...</p>
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

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>Result not found.</p>
        </div>
      </div>
    );
  }

  const scorePercentage = calculatePercentage(result.score, result.totalPossibleScore);
  const scoreColorClass = getScoreColor(scorePercentage);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Result Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Quiz Result: {result.quiz.title}</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className={`text-4xl font-bold ${scoreColorClass}`}>
              {result.score}/{result.totalPossibleScore}
            </div>
            <div className="text-gray-600 mt-2">Score</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className={`text-4xl font-bold ${scoreColorClass}`}>
              {scorePercentage}%
            </div>
            <div className="text-gray-600 mt-2">Percentage</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-4xl font-bold text-indigo-600 flex justify-center">
              <Clock className="h-8 w-8 mr-2" />
              {formatTime(result.timeTaken)}
            </div>
            <div className="text-gray-600 mt-2">Time Taken</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to={`/leaderboard/${result.quiz._id}`} className="btn btn-primary flex items-center">
            <Award className="h-5 w-5 mr-2" />
            View Leaderboard
          </Link>
          <Link to="/quizzes" className="btn btn-secondary flex items-center">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Quizzes
          </Link>
          <button className="btn btn-secondary flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share Result
          </button>
        </div>
      </div>

      {/* Detailed Questions and Answers */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Detailed Review</h2>
      
      {result.quiz.questions.map((question, index) => {
        const userAnswer = result.answers.find(
          (answer) => answer.questionId.toString() === question._id.toString()
        );
        
        return (
          <QuizQuestion
            key={question._id}
            question={question}
            questionIndex={index}
            selectedOption={userAnswer?.selectedOption}
            onSelectOption={() => {}}
            showResults={true}
            isReview={true}
          />
        );
      })}
    </div>
  );
};

export default ResultPage;