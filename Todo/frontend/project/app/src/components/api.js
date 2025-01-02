// src/api.js
import axios from 'axios';

// Base URL for your backend API
const API_URL = 'http://localhost:8000/auth';

// Function to handle login API request
export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await axios.post(`${API_URL}/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 200) {
      // Store the access token in localStorage
      localStorage.setItem('access_token', response.data.access_token);
      return { success: true, message: 'Login successful!' };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + (error.response?.data?.detail || 'Login failed.'),
    };
  }
};

// Function to handle signup API request
export const signupUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username: username,
      password: password,
    });

    if (response.status === 200) {
      // Store the access token in localStorage
      localStorage.setItem('access_token', response.data.access_token);
      return { success: true, message: 'Registration successful!' };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + (error.response?.data?.detail || 'Registration failed.'),
    };
  }
};
