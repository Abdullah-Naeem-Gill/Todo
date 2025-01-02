// src/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-between items-center text-white p-6">
      {/* Header Section */}
      <header className="flex flex-col items-center mt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Stay Organized with Our To-Do App
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Easily manage your tasks and boost your productivity.
        </p>
        
        {/* Call-to-Action Button */}
        <button
          onClick={handleGetStartedClick}
          className="bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300"
        >
          Get Started
        </button>
      </header>

      {/* Features Section */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Why Use Our To-Do App?</h2>
        <ul className="space-y-4">
          <li className="text-lg md:text-xl">✔ Simple and intuitive interface</li>
          <li className="text-lg md:text-xl">✔ Track tasks effortlessly</li>
          <li className="text-lg md:text-xl">✔ Set deadlines and reminders</li>
          <li className="text-lg md:text-xl">✔ Stay focused and organized</li>
        </ul>
      </section>

      {/* Footer Section */}
      <footer className="text-center py-8">
        <p className="text-sm md:text-base">
          © 2025 ToDoApp. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
