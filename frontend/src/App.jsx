import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// User Pages
import HomePage from './pages/HomePage';
import QuizListPage from './pages/User/QuizListPage';
import QuizPage from './pages/User/QuizPage';
import ResultPage from './pages/User/ResultPage';
import LeaderboardPage from './pages/User/LeaderboardPage';
import UserProfilePage from './pages/User/UserProfilePage';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import QuizFormPage from './pages/Admin/QuizFormPage';
import ViewAttemptsPage from './pages/Admin/ViewAttemptsPage';
import ReportPage from './pages/Admin/ReportPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/leaderboard/:quizId" element={<LeaderboardPage />} />
          
          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/result/:resultId" element={<ResultPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/quiz/create" element={<QuizFormPage />} />
            <Route path="/admin/quiz/edit/:id" element={<QuizFormPage />} />
            <Route path="/admin/attempts/:quizId" element={<ViewAttemptsPage />} />
            <Route path="/admin/report/:resultId" element={<ReportPage />} />
          </Route>
        </Routes>
      </main>
      
    </div>
  );
}

export default App;