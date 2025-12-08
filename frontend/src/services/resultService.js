import axios from 'axios';

// Get API URL with proper fallback
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If VITE_API_URL is not set, use the backend URL from your deployment
  if (!envUrl || envUrl === 'undefined') {
    // Default to CloudFront backend URL
    return 'https://d3niztflhdd0uf.cloudfront.net/api';
  }
  // Remove trailing slash if present
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
};

const BASE_URL = getBaseUrl();
// BASE_URL already includes /api, so we just append the endpoint
const API_URL = `${BASE_URL}/result`;

// Get auth token from local storage
const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

// Submit quiz answers
const submitQuiz = async (quizId, answers, timeTaken) => {
  const token = getToken();
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.post(
    `${API_URL}/submit/${quizId}`,
    { answers, timeTaken },
    config
  );
  
  return response.data;
};

// Get user's quiz history
const getUserResults = async (userId) => {
  const token = getToken();
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/user/${userId}`, config);
  return response.data;
};

// Get all results for a quiz (admin only)
const getQuizResults = async (quizId) => {
  const token = getToken();
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/quiz/${quizId}`, config);
  return response.data;
};

// Get leaderboard for a quiz
const getLeaderboard = async (quizId) => {
  const response = await axios.get(`${API_URL}/leaderboard/${quizId}`);
  return response.data;
};

// Get detailed result report
const getResultReport = async (resultId) => {
  const token = getToken();
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/report/${resultId}`, config);
  return response.data;
};

const resultService = {
  submitQuiz,
  getUserResults,
  getQuizResults,
  getLeaderboard,
  getResultReport,
};

export default resultService;