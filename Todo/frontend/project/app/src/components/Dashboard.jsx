import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        Todo Dashboard
      </header>

      {/* Add Task Form */}
      <div className="mt-6 w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add a New Task</h2>
        <form>
          <input
            type="text"
            placeholder="Enter your task"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="mt-8 w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Your Tasks</h3>

        {/* Task Item */}
        <ul>
          <li className="flex justify-between items-center p-4 mb-4 border border-gray-300 rounded-lg">
            <span className="text-lg">Finish Homework</span>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
                Complete
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">
                Delete
              </button>
            </div>
          </li>

          {/* Task Item */}
          <li className="flex justify-between items-center p-4 mb-4 border border-gray-300 rounded-lg">
            <span className="text-lg">Buy Groceries</span>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
                Complete
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">
                Delete
              </button>
            </div>
          </li>

          {/* Task Item */}
          <li className="flex justify-between items-center p-4 mb-4 border border-gray-300 rounded-lg">
            <span className="text-lg">Work on Project</span>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
                Complete
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
