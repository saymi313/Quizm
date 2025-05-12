import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, User, Award, Clock, Calendar } from 'lucide-react';
import authService from '../../services/authService';
import resultService from '../../services/resultService';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user info from localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (!userInfo) {
          setError('User not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Get user profile and results
        const [profile, userResults] = await Promise.all([
          authService.getUserProfile(),
          resultService.getUserResults(userInfo._id),
        ]);
        
        setUser(profile);
        setResults(userResults);
        setLoading(false);
      } catch (error) {
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateAverageScore = () => {
    if (results.length === 0) return 0;
    
    const totalScore = results.reduce((sum, result) => {
      return sum + (result.score / result.totalPossibleScore) * 100;
    }, 0);
    
    return Math.round(totalScore / results.length);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading profile...</p>
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

  const averageScore = calculateAverageScore();

  return (
    <div className="max-w-4xl mx-auto">
      {/* User Profile */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="bg-indigo-100 rounded-full p-6">
            <User className="h-16 w-16 text-indigo-600" />
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600">{results.length}</div>
                <div className="text-gray-600 text-sm">Quizzes Taken</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600">{averageScore}%</div>
                <div className="text-gray-600 text-sm">Average Score</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center md:col-span-1 col-span-2">
                <div className="text-2xl font-bold text-indigo-600">{user.role}</div>
                <div className="text-gray-600 text-sm">Account Type</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quiz History</h2>
        
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="py-3 px-4 font-semibold">Quiz</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result._id}>
                    <td className="py-3 px-4 font-medium">
                      {result.quiz.title}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-indigo-500" />
                        {result.score}/{result.totalPossibleScore}
                      </div>
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
                        to={`/result/${result._id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You haven't taken any quizzes yet.</p>
            <Link to="/quizzes" className="btn btn-primary mt-4 inline-block">
              Browse Quizzes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;