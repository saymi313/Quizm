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
const API_URL = `${BASE_URL}/upload`;


// Get auth token from localStorage
const getAuthToken = () => {
  // Try both possible localStorage keys
  const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || 'null');
  return user?.token || null;
};

// Upload image to S3
const uploadImage = async (file) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      API_URL,
      formData,
      config
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to upload image';
    throw new Error(message);
  }
};

const uploadService = {
  uploadImage,
};

export default uploadService;

