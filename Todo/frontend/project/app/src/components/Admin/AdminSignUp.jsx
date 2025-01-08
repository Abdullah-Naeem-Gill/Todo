import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupAdmin } from "../../utilities/api";

const AdminSignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signupAdmin(formData.username, formData.password);
    setIsLoading(false);
    setFormData({ ...formData, message: result.message });

    if (result.success) {
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    }
  };

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
            <label
              htmlFor="username"
              className="block text-gray-600 font-medium"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? <span>Loading...</span> : "Sign Up"}
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
