import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { loginAdmin } from './api'; // Import the loginAdmin function from api.js

const AdminLogin = () => {
  // Use a single state object to manage all form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    message: ''
  });

  const navigate = useNavigate(); // Initialize navigate hook

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle login submission with improved error handling
  const handleLogin = async (e) => {
    e.preventDefault();

    // Call loginAdmin function from api.js
    const result = await loginAdmin(formData.username, formData.password);

    setFormData(prevState => ({
      ...prevState,
      message: result.message
    }));

    // If login is successful, redirect to admin dashboard
    if (result.success) {
      setTimeout(() => navigate('/admin/dashboard'), 2000); // Delay to show success message
    }
  };

  // Handle redirect to sign-up page
  const handleSignUpClick = () => {
    navigate('/admin/signup'); // Navigate to Admin Sign Up page
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
              name="username" // Using name attribute for the generic handler
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
              name="password" // Using name attribute for the generic handler
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

        {/* Display success or error message */}
        {formData.message && (
          <p className={`mt-4 text-center text-sm ${formData.message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
            {formData.message}
          </p>
        )}

        <p className="text-gray-600 text-sm text-center mt-6">
          Don't have an account?{' '}
          <span
            onClick={handleSignUpClick}
            className="text-indigo-600 cursor-pointer hover:text-indigo-700 transition duration-300"
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
