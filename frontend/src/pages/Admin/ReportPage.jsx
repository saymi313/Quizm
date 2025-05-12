import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Clock, Calendar, User, Award } from 'lucide-react';
import QuizQuestion from '../../components/QuizQuestion';
import resultService from '../../services/resultService';

const ReportPage = () => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detailed Report</h1>
        <Link to={`/admin/attempts/${result.quiz._id}`} className="btn btn-secondary flex items-center">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Attempts
        </Link>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <User className="h-6 w-6 text-indigo-600 mr-2" />
          <div>
            <h2 className="text-xl font-semibold">{result.user.name}</h2>
            <p className="text-gray-600">{result.user.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Quiz</div>
            <div className="font-medium">{result.quiz.title}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Date</div>
            <div className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
              {formatDate(result.createdAt)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Time Taken</div>
            <div className="font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              {formatTime(result.timeTaken)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Score</div>
            <div className={`font-medium flex items-center ${scoreColorClass}`}>
              <Award className="h-4 w-4 mr-1" />
              {result.score}/{result.totalPossibleScore} ({scorePercentage}%)
            </div>
          </div>
        </div>
      </div>

      {/* Question Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Question Analysis</h2>
        
        <div className="space-y-6">
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
      </div>
    </div>
  );
};

export default ReportPage;