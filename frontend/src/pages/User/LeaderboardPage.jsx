import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, Trophy, Clock, ArrowLeft } from 'lucide-react';
import resultService from '../../services/resultService';
import quizService from '../../services/quizService';

const LeaderboardPage = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardData, quizData] = await Promise.all([
          resultService.getLeaderboard(quizId),
          quizService.getQuizById(quizId),
        ]);
        
        setLeaderboard(leaderboardData);
        setQuiz(quizData);
        setLoading(false);
      } catch (error) {
        setError('Failed to load leaderboard. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading leaderboard...</p>
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
            {quiz && <p className="text-gray-600">{quiz.title}</p>}
          </div>
          <Link to="/quizzes" className="btn btn-secondary flex items-center">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Quizzes
          </Link>
        </div>

        {leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="py-3 px-4 font-semibold">Rank</th>
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr key={entry._id} className={index < 3 ? 'bg-indigo-50' : ''}>
                    <td className="py-3 px-4">
                      {index === 0 ? (
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      ) : index === 1 ? (
                        <Trophy className="h-6 w-6 text-gray-400" />
                      ) : index === 2 ? (
                        <Trophy className="h-6 w-6 text-amber-700" />
                      ) : (
                        <span className="font-medium">{index + 1}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {entry.user.name}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {entry.score}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {formatTime(entry.timeTaken)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {formatDate(entry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No results yet. Be the first to take this quiz!</p>
            <Link to={`/quiz/${quizId}`} className="btn btn-primary mt-4 inline-block">
              Take Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;