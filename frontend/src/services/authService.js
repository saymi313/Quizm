import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://54.87.191.72:5001";
const API_URL = `${BASE_URL}/api/auth`;

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Login user
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('userInfo');
};

// Get user profile
const getUserProfile = async () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getUserProfile,
};

export default authService;