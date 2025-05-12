import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quiz';

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
  return response.data;
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