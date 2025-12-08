import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  List, 
  Users, 
  BarChart, 
  Edit, 
  Trash, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import quizService from '../../services/quizService';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getQuizzes();
        // quizService.getQuizzes() now always returns an array
        setQuizzes(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        setError('Failed to load quizzes. Please try again later.');
        setLoading(false);
        setQuizzes([]); // Ensure quizzes is always an array even on error
      }
    };

    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (id) => {
    try {
      await quizService.deleteQuiz(id);
      setQuizzes(quizzes.filter(quiz => quiz._id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      setError('Failed to delete quiz. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage quizzes, view reports, and monitor user activity</p>
        </div>
        <Link
          to="/admin/quiz/create"
          className="btn btn-primary flex items-center mt-4 md:mt-0"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Quiz
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <List className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Quizzes</h3>
              <p className="text-2xl font-semibold">{quizzes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Published Quizzes</h3>
              <p className="text-2xl font-semibold">
                {quizzes.filter(quiz => quiz.isPublished).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <BarChart className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Draft Quizzes</h3>
              <p className="text-2xl font-semibold">
                {quizzes.filter(quiz => !quiz.isPublished).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Manage Quizzes</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading quizzes...</p>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Created</th>
                  <th className="py-3 px-4 font-semibold">Time Limit</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td className="py-3 px-4 font-medium">{quiz.title}</td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(quiz.createdAt)}</td>
                    <td className="py-3 px-4">{quiz.timeLimit} minutes</td>
                    <td className="py-3 px-4">
                      {quiz.isPublished ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Published
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/quiz/edit/${quiz._id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Quiz"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/admin/attempts/${quiz._id}`}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="View Attempts"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(quiz._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Quiz"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No quizzes found. Create your first quiz!</p>
            <Link
              to="/admin/quiz/create"
              className="btn btn-primary mt-4 inline-block"
            >
              Create Quiz
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Quiz?</h3>
            <p className="mb-6">
              Are you sure you want to delete this quiz? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuiz(deleteConfirm)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;