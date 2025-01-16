import axios from "axios";
import { API_ADMIN } from "./Constants";

const getAuthToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found, please log in first.");
  }
  return token;
};

export const CreateTask = async (title, description) => {
  const formData = { title, description };

  try {
    const token = getAuthToken();  // Ensure token is retrieved
    const response = await axios.post(`${API_ADMIN}/createTask`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { success: true, message: "Task created successfully!" };
    } else {
      return { success: false, message: "Unexpected response status." };
    }
  } catch (error) {
    return formatError(error);
  }
};

export const GetAllTasks = async () => {
  try {
    const token = getAuthToken();  // Ensure token is retrieved
    const response = await axios.get(`${API_ADMIN}/getTasks`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { success: true, tasks: response.data };
    } else {
      return { success: false, message: "Unexpected response status." };
    }
  } catch (error) {
    return formatError(error);
  }
};

export const DeleteTask = async (taskId) => {
  try {
    const token = getAuthToken();  // Ensure token is retrieved
    const response = await axios.delete(`${API_ADMIN}/delete-task/${taskId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { success: true, message: "Task deleted successfully!" };
    } else {
      return { success: false, message: "Unexpected response status." };
    }
  } catch (error) {
    return formatError(error);
  }
};

export const UpdateTask = async (taskId, title, description) => {
  const formData = { title, description };

  try {
    const token = getAuthToken();  // Ensure token is retrieved
    const response = await axios.put(`${API_ADMIN}/update-task/${taskId}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { success: true, message: "Task updated successfully!" };
    } else {
      return { success: false, message: "Unexpected response status." };
    }
  } catch (error) {
    return formatError(error);
  }
};

// Helper function to format errors
const formatError = (error) => {
  if (error.response) {
    return { success: false, message: error.response.data.message || "An error occurred." };
  } else if (error.request) {
    return { success: false, message: "No response received from the server." };
  } else {
    return { success: false, message: error.message };
  }
};
