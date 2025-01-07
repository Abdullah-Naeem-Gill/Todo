import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { signupAdmin } from "./api"; // Import the signupAdmin function from api.js

const AdminSignUp = () => {
  // Single state object to manage username, password, message, and loading state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize navigate hook

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the signup process starts

    // Call the signupAdmin function from api.js
    const result = await signupAdmin(formData.username, formData.password);

    // Handle the result from the signupAdmin function
    setIsLoading(false); // Set loading to false once the request is complete
    setFormData({ ...formData, message: result.message });

    if (result.success) {
      setTimeout(() => {
        navigate("/admin/login"); // Redirect to admin login after success
      }, 2000); // Add a delay to show the success message before redirecting
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Create an Admin Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-600 font-medium">
              Username
            </label>
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
            <label htmlFor="password" className="block text-gray-600 font-medium">
              Password
            </label>
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
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? (
              <span>Loading...</span> // Show loading text during request
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        {formData.message && (
          <p
            className={`mt-4 text-center text-sm ${
              formData.message.includes("successful")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {formData.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminSignUp;
