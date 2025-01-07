import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './api'; // Import the loginUser function from api.js

const Login = () => {
  // Single state object to manage username, password, and message
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    message: '',
  });
  const navigate = useNavigate();

  // Handle login with the imported loginUser function
  const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    // Use the loginUser function from api.js
    const result = await loginUser(username, password);

    if (result.success) {
      setFormData({ ...formData, message: 'Login successful!' });
      localStorage.setItem('access_token', result.data.access_token);
    } else {
      setFormData({ ...formData, message: `Error: ${result.message}` });
    }
  };

  // Generic input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Redirect to signup page
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
              name="username" // Use name attribute to link with handleInputChange
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange} // Using the generic handler
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
              name="password" // Use name attribute to link with handleInputChange
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange} // Using the generic handler
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
        {formData.message && (
          <div className={`mt-4 text-center text-sm ${formData.message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {formData.message}
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
