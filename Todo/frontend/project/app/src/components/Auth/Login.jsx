import React, { useState } from 'react';
import { loginAdmin } from '../../utilities/Auth/LoginApi';
import Button from '../../subComponents/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    errorMessage: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormData(prevState => ({ ...prevState, errorMessage: '' }));

    try {
      // Call the login API with username and password
      const result = await loginAdmin(formData.username, formData.password);

      if (result.success) {
        // Check if 'is_admin' exists in the result object
        const isAdmin = result.is_admin; // assuming is_admin is returned

        if (isAdmin) {
          // If the user is an admin, redirect to the admin dashboard
          window.location.href = '/admin-dashboard';
        } else {
          // If the user is not an admin, redirect to the user dashboard
          window.location.href = '/user-dashboard';
        }
      } else {
        // If login failed, show the message returned by the backend
        setFormData(prevState => ({
          ...prevState,
          errorMessage: result.message || 'Login failed. Please try again.'
        }));
      }
    } catch (error) {
      // Handle unexpected errors (e.g., network errors)
      setFormData(prevState => ({
        ...prevState,
        errorMessage: 'An error occurred. Please try again.'
      }));
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 flex flex-col items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Login</h2>

        {formData.errorMessage && (
          <div className="text-red-500 text-center mb-4">{formData.errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-center">
            <Button 
              text="Login"
              onClick={handleSubmit}
              color="indigo"  
              size="md"      
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/signup" className="text-indigo-600 hover:text-indigo-700">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
