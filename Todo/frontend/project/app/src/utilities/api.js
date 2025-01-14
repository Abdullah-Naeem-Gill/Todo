

import axios from "axios";
import { API_URL, API_AUTH, API_ADMIN } from "./Constants";
import { handleApiRequest } from "./ApiHandling"; 

const getAuthToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found, please log in first.");
  }
  return token;
};

export const loginUser = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(
    `${API_URL}/login/user`,
    "POST",
    formData
  );

  if (result.success) {
    localStorage.setItem("access_token", result.data.access_token);
  }

  return result;
};

export const signupUser = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(
    `${API_URL}/register`,
    "POST",
    formData
  );

  if (result.success) {
    localStorage.setItem("access_token", result.data.access_token);
  }

  return result;
};

export const signupAdmin = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(
    `${API_AUTH}/register/admin`,
    "POST",
    formData
  );

  if (result.success) {
    localStorage.setItem("access_token", result.data.access_token);
  }

  return result;
};

export const loginAdmin = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(`${API_AUTH}/token`, "POST", formData);

  if (result.success) {
    localStorage.setItem("access_token", result.data.access_token);
  }

  return result;
};

export const CreateTask = async (title, description) => {
  const formData = { title, description };

  try {
    const token = getAuthToken();
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
    const token = getAuthToken();
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
    const token = getAuthToken();
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
    const token = getAuthToken();
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
