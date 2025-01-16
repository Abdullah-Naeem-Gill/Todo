import React, { useState } from 'react';
import { loginAdmin  } from '../../utilities/Auth/LoginApi'; 
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

    const result = await loginAdmin(formData.username, formData.password);

    if (result.success) {
      window.location.href = '/dashboard';  
    } else {
      setFormData(prevState => ({ ...prevState, errorMessage: result.message || 'Login failed. Please try again.' }));
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
