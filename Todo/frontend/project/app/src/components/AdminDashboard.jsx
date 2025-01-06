import React, { useState } from "react";
import { CreateTask, GetAllTasks } from "../components/api"; // Import both CreateTask and GetAllTasks functions

const AdminDashboard = () => {
  // State management for form data and tasks
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    message: "",
  });

  const [tasks, setTasks] = useState([]); // State for tasks
  const [loading, setLoading] = useState(false); // Loading state
  const [visibleTaskCount, setVisibleTaskCount] = useState(5); // Visible tasks limit

  // Constant values for button texts
  const ADD_TASK_BUTTON_TEXT = "Add Task";
  const SEE_ALL_TASKS_BUTTON_TEXT = "See all the tasks";
  const SEE_MORE_BUTTON_TEXT = "See More";
  const SEE_LESS_BUTTON_TEXT = "See Less";

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a task
    const { title, description } = formData;
    const response = await CreateTask(title, description);

    // Update the form message
    setFormData((prevState) => ({
      ...prevState,
      message: response.message,
    }));

    // Reset form if the task creation is successful
    if (response.success) {
      setFormData({
        title: "",
        description: "",
        message: response.message,
      });
    }
  };

  // Fetch all tasks
  const handleGetAllTasks = async () => {
    setLoading(true);

    try {
      const response = await GetAllTasks();
      if (response.success) {
        setTasks(response.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      setTasks([]); // Handle errors by clearing tasks
    } finally {
      setLoading(false);
    }
  };

  // Toggle task visibility (See More / See Less)
  const handleSeeMore = () => setVisibleTaskCount(tasks.length);
  const handleSeeLess = () => setVisibleTaskCount(5);

  // Render tasks list with "See More / See Less" buttons
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Create the Task
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

          <label
            htmlFor="description"
            className="block text-gray-600 font-medium"
          >
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

          {formData.message && (
            <p
              className={`text-center mt-4 ${
                formData.message.includes("successful")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
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

        {/* Button to get all tasks */}
        <button
          onClick={handleGetAllTasks}
          className="text-white bg-green-500 rounded-lg h-10 w-full mt-5"
        >
          {SEE_ALL_TASKS_BUTTON_TEXT}
        </button>

        {/* Displaying tasks */}
        {loading ? (
          <p className="text-center mt-4">Loading tasks...</p>
        ) : (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h2>
            {renderTasks()}

            {/* See More / See Less Button */}
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
