import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { signupUser } from './api'; // Import the signupUser function from api.js

const SignUp = () => {
  // Use a single state object to manage form data and message
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    message: '',
  });

  const navigate = useNavigate(); // Initialize navigate hook

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Call the signupUser function from api.js
    const result = await signupUser(formData.username, formData.password);

    // Handle the result from the signupUser function
    setFormData({
      ...formData,
      message: result.message,
    });

    // If signup is successful, redirect to login page after a short delay
    if (result.success) {
      setTimeout(() => {
        navigate('/login/user');
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Create an Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-600 font-medium">Username</label>
            <input
              type="text"
              id="username"
              name="username" // Use name attribute for generic handler
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
              name="password" // Use name attribute for generic handler
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
            Sign Up
          </button>
        </form>

        {/* Display success or error message */}
        {formData.message && (
          <p
            className={`mt-4 text-center text-sm ${formData.message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}
          >
            {formData.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
