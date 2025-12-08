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
const API_URL = `${BASE_URL}/auth`;

// Helper: notify any listeners that auth state changed
const broadcastAuthChange = () => {
  const event = new Event('authChange')
  window.dispatchEvent(event)
}

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    broadcastAuthChange();
  }
  
  return response.data;
};

// Login user
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    broadcastAuthChange();
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('userInfo');
  broadcastAuthChange();
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