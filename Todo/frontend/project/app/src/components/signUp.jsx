import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { signupUser } from './api'; // Import the signupUser function from api.js

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook

  const handleSignup = async (e) => {
    e.preventDefault();

    // Call the signupUser function from api.js
    const result = await signupUser(username, password);

    // Handle the result from the signupUser function
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        navigate('/login'); // Redirect to login after success
      }, 2000); // Add a delay to show the success message before redirecting
    } else {
      setMessage(result.message);
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
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        {message && (
          <p
            className={`mt-4 text-center text-sm ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
