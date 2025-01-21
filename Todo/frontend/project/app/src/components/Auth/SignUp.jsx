import React, { useState } from 'react';
import { handleApiRequest } from '../../utilities/ApiHandling'; // Assuming the function to handle API requests
import Button from '../../subComponents/Button'; // Assuming you have a Button component
import { API_AUTH } from '../../utilities/Constants'; // API URL for authentication

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    errorMessage: '',
    successMessage: '',
    isAdmin: false, // Track if the user is signing up as admin or not
  });

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
      errorMessage: '', // Clear error message on input change
    }));
  };

  // Handle role change (whether signing up as admin or user)
  const handleRoleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      isAdmin: e.target.value === 'admin', // Set is_admin to true if 'admin' is selected
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setFormData((prevState) => ({
        ...prevState,
        errorMessage: 'Passwords do not match!',
      }));
      return;
    }

    // Create the payload with is_admin flag
    const payload = {
      username: formData.username,
      password: formData.password,
      is_admin: formData.isAdmin, // true if admin, false otherwise
    };

    try {
      // Make the API request
      const result = await handleApiRequest(`${API_AUTH}/register`, 'POST', payload);

      if (result.success) {
        setFormData((prevState) => ({
          ...prevState,
          successMessage: 'Account created successfully!',
          errorMessage: '', // Clear error message on successful submission
        }));

        // Store the JWT token received in localStorage
        localStorage.setItem('access_token', result.data.access_token);  // Store token in localStorage
        localStorage.setItem('roles', JSON.stringify(result.data.roles));  // Store roles in localStorage

        // Reset form fields after success
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          errorMessage: '',
          successMessage: '',
          isAdmin: false, // Reset the role to user after submission
        });
      } else {
        setFormData((prevState) => ({
          ...prevState,
          errorMessage: result.message || 'An error occurred during registration.',
        }));
      }
    } catch (error) {
      setFormData((prevState) => ({
        ...prevState,
        errorMessage: 'An error occurred. Please try again later.',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 flex flex-col items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Create an Account</h2>

        {formData.errorMessage && (
          <div className="text-red-500 text-center mb-4">{formData.errorMessage}</div>
        )}
        {formData.successMessage && (
          <div className="text-green-500 text-center mb-4">{formData.successMessage}</div>
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role</label>
            <select
              id="role"
              value={formData.isAdmin ? 'admin' : 'user'}
              onChange={handleRoleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-center">
            <Button 
              text="Sign Up"
              onClick={handleSubmit}
              color="indigo"
              size="md"
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
