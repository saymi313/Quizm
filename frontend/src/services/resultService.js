import axios from 'axios';

const API_URL = 'http://localhost:5000/api/result';

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