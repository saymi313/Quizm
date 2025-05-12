import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Clock, Calendar, User, Search } from 'lucide-react';
import resultService from '../../services/resultService';
import quizService from '../../services/quizService';

const ViewAttemptsPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, resultsData] = await Promise.all([
          quizService.getQuizById(quizId),
          resultService.getQuizResults(quizId),
        ]);
        
        setQuiz(quizData);
        setResults(resultsData);
        setLoading(false);
      } catch (error) {
        setError('Failed to load quiz attempts. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculatePercentage = (score, total) => {
    return Math.round((score / total) * 100);
  };

  // Filter results based on search term
  const filteredResults = results.filter((result) =>
    result.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading quiz attempts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Quiz Attempts</h1>
          {quiz && <p className="text-gray-600">{quiz.title}</p>}
        </div>
        <Link to="/admin" className="btn btn-secondary flex items-center">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">All Attempts</h2>
        </div>

        {filteredResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Percentage</th>
                  <th className="py-3 px-4 font-semibold">Time Taken</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result) => {
                  const scorePercentage = calculatePercentage(
                    result.score,
                    result.totalPossibleScore
                  );
                  
                  let scoreColorClass = 'text-red-600';
                  if (scorePercentage >= 80) {
                    scoreColorClass = 'text-green-600';
                  } else if (scorePercentage >= 60) {
                    scoreColorClass = 'text-yellow-600';
                  }
                  
                  return (
                    <tr key={result._id}>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <div className="font-medium">{result.user.name}</div>
                            <div className="text-sm text-gray-500">{result.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {result.score}/{result.totalPossibleScore}
                      </td>
                      <td className={`py-3 px-4 font-medium ${scoreColorClass}`}>
                        {scorePercentage}%
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          {formatTime(result.timeTaken)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          {formatDate(result.createdAt)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/admin/report/${result._id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm
                ? 'No results match your search criteria.'
                : 'No attempts for this quiz yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttemptsPage;