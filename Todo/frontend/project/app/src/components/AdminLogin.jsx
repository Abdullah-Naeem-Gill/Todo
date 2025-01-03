import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { loginAdmin } from './api'; // Import the loginAdmin function from api.js

const AdminLogin = () => {
  // Single state object to manage all form data (username, password, and message)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    message: ''
  });
  
  const navigate = useNavigate(); // Initialize navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();

    // Call the loginAdmin function from api.js
    const result = await loginAdmin(formData.username, formData.password);

    // Handle the result from the loginAdmin function
    if (result.success) {
      setFormData({ ...formData, message: result.message });
      setTimeout(() => {
        navigate('/admin/dashboard'); // Redirect to admin dashboard after success
      }, 2000); // Add a delay to show the success message before redirecting
    } else {
      setFormData({ ...formData, message: result.message });
    }
  };

  const handleSignUpClick = () => {
    navigate('/admin/signup'); // Navigate to Admin Sign Up page
  };

  // Generic change handler for all form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-600 font-medium">Username</label>
            <input
              type="text"
              id="username"
              name="username" // Use name attribute for the generic handler
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange} // Using the generic handler
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password" // Use name attribute for the generic handler
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange} // Using the generic handler
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Log In
          </button>
        </form>
        {formData.message && (
          <p
            className={`mt-4 text-center text-sm ${formData.message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}
          >
            {formData.message}
          </p>
        )}

        {/* Enhanced "Don't have an Account?" Text */}
        <p className="text-gray-600 text-sm text-center mt-6">
          Don't have an Account?{' '}
          <span
            onClick={handleSignUpClick}
            className="text-indigo-600 cursor-pointer hover:text-indigo-700 transition duration-300"
          >
            Sign up here
          </span>
        </p>

        {/* Sign Up Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleSignUpClick}
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
