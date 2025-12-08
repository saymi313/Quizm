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
const API_URL = `${BASE_URL}/quiz`;

// Get auth token from local storage
const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

// Get all quizzes
const getQuizzes = async () => {
  const token = getToken();
  
  const config = token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
  
  const response = await axios.get(API_URL, config);
  const data = response.data;
  
  // Ensure we always return an array
  // Handle different response formats from backend
  if (Array.isArray(data)) {
    return data;
  } else if (Array.isArray(data?.quizzes)) {
    return data.quizzes;
  } else if (Array.isArray(data?.data)) {
    return data.data;
  } else {
    // If data is not an array, return empty array to prevent .map() errors
    console.warn('getQuizzes: Expected array but got:', typeof data, data);
    return [];
  }
};

// Get quiz by ID
const getQuizById = async (id) => {
  const token = getToken();
  
  const config = token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
  
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

// Create new quiz (admin only)
const createQuiz = async (quizData) => {
  const token = getToken();
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.post(API_URL, quizData, config);
  return response.data;
};

// Update quiz (admin only)
const updateQuiz = async (id, quizData) => {
  const token = getToken();
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.put(`${API_URL}/${id}`, quizData, config);
  return response.data;
};

// Delete quiz (admin only)
const deleteQuiz = async (id) => {
  const token = getToken();
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

const quizService = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};

export default quizService;