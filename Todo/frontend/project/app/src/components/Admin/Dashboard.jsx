import React, { useState, useEffect } from "react";
import {
  CreateTask,
  GetAllTasks,
  DeleteTask,
  UpdateTask,
} from "../../utilities/api";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    message: "",
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleTaskCount, setVisibleTaskCount] = useState(5);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const ADD_TASK_BUTTON_TEXT = "Add Task";
  const SEE_MORE_BUTTON_TEXT = "See More";
  const SEE_LESS_BUTTON_TEXT = "See Less";

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await GetAllTasks();
        if (response.success) {
          setTasks(response.tasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        setTasks([]);
        setFormData((prevState) => ({
          ...prevState,
          message: "An error occurred while fetching tasks.",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description } = formData;

    try {
      if (editingTaskId) {
        const response = await UpdateTask(editingTaskId, title, description);
        setEditingTaskId(null);
        setFormData({
          title: "",
          description: "",
          message: response.message,
        });
      } else {
        const response = await CreateTask(title, description);
        setFormData({
          title: "",
          description: "",
          message: response.message,
        });
      }
    } catch (error) {
      setFormData((prevState) => ({
        ...prevState,
        message: "An error occurred while processing the task.",
      }));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await DeleteTask(taskId);
      if (response.success) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          message: "An error occurred while deleting the task.",
        }));
      }
    } catch (error) {
      setFormData((prevState) => ({
        ...prevState,
        message: "An error occurred while deleting the task.",
      }));
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      message: "",
    });
  };

  const handleSeeMore = () => setVisibleTaskCount(tasks.length);

  const handleSeeLess = () => setVisibleTaskCount(5);

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

            <button
              onClick={() => handleEditTask(task)}
              className="text-blue-500"
            >
              Edit
            </button>

            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          {editingTaskId ? "Update Task" : "Create a New Task"}
        </h1>

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
            {editingTaskId ? "Update Task" : ADD_TASK_BUTTON_TEXT}
          </button>
        </form>

        {loading ? (
          <p className="text-center mt-4">Loading tasks...</p>
        ) : (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h2>
            {renderTasks()}

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
