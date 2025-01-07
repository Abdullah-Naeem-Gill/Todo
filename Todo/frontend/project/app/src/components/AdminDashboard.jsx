import React, { useState, useEffect } from "react";
import { CreateTask, GetAllTasks } from "../components/api"; // Import CreateTask and GetAllTasks

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    message: "",
  });

  const [tasks, setTasks] = useState([]); // Store fetched tasks
  const [loading, setLoading] = useState(false); // Loading state for fetching tasks
  const [visibleTaskCount, setVisibleTaskCount] = useState(5); // Track visible task count for pagination

  const ADD_TASK_BUTTON_TEXT = "Add Task";
  const SEE_ALL_TASKS_BUTTON_TEXT = "See all tasks";
  const SEE_MORE_BUTTON_TEXT = "See More";
  const SEE_LESS_BUTTON_TEXT = "See Less";

  // Handle form data change for task creation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle task form submission (creating a new task)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description } = formData;

    try {
      // Call the API to create the task
      const response = await CreateTask(title, description);

      setFormData((prevState) => ({
        ...prevState,
        message: response.message,
      }));

      // Reset form if successful
      if (response.success) {
        setFormData({
          title: "",
          description: "",
          message: response.message,
        });
      }
    } catch (error) {
      setFormData((prevState) => ({
        ...prevState,
        message: "An error occurred while creating the task.",
      }));
    }
  };

  // Fetch all tasks when the component mounts or when triggered
  const handleGetAllTasks = async () => {
    setLoading(true);

    try {
      const response = await GetAllTasks();
      if (response.success) {
        setTasks(response.tasks);
      } else {
        setTasks([]); // Handle if no tasks are returned
      }
    } catch (error) {
      setTasks([]); // In case of error, clear tasks
      setFormData((prevState) => ({
        ...prevState,
        message: "An error occurred while fetching tasks.",
      }));
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  // Toggle to show all tasks (See More)
  const handleSeeMore = () => setVisibleTaskCount(tasks.length);

  // Toggle to show fewer tasks (See Less)
  const handleSeeLess = () => setVisibleTaskCount(5);

  // Render tasks list with pagination (See More / See Less buttons)
  const renderTasks = () => {
    if (tasks.length === 0) return <p>No tasks available.</p>;

    return (
      <ul>
        {tasks.slice(0, visibleTaskCount).map((task) => (
          <li
            key={task.id}
            className="border-b border-gray-300 py-2 flex justify-between"
          >
            <span>{task.title}</span>
            <span className="text-gray-500">ID: {task.id}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Render the component
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Create a New Task
        </h1>

        {/* Task creation form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="title" className="block text-gray-600 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter the title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />

          <label htmlFor="description" className="block text-gray-600 font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Enter your description here"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />

          {/* Message display */}
          {formData.message && (
            <p
              className={`text-center mt-4 ${formData.message.includes("successful") ? "text-green-500" : "text-red-500"}`}
            >
              {formData.message}
            </p>
          )}

          <button
            type="submit"
            className="text-white bg-blue-500 rounded-lg h-10 w-full"
          >
            {ADD_TASK_BUTTON_TEXT}
          </button>
        </form>

        {/* Button to fetch all tasks */}
        <button
          onClick={handleGetAllTasks}
          className="text-white bg-green-500 rounded-lg h-10 w-full mt-5"
        >
          {SEE_ALL_TASKS_BUTTON_TEXT}
        </button>

        {/* Render tasks or loading message */}
        {loading ? (
          <p className="text-center mt-4">Loading tasks...</p>
        ) : (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h2>
            {renderTasks()}

            {/* See More / See Less buttons */}
            {tasks.length > visibleTaskCount && (
              <button
                onClick={handleSeeMore}
                className="text-blue-500 mt-4 block w-full"
              >
                {SEE_MORE_BUTTON_TEXT}
              </button>
            )}

            {visibleTaskCount > 5 && (
              <button
                onClick={handleSeeLess}
                className="text-blue-500 mt-4 block w-full"
              >
                {SEE_LESS_BUTTON_TEXT}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
