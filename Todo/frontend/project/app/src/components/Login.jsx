import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:8000/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        setMessage('Login successful!');
        localStorage.setItem('access_token', response.data.access_token);
      }
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.detail || 'Login failed.'));
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 text-center text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </div>
        )}

        {/* Sign Up Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleSignupRedirect}
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
