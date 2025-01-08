import axios from "axios";

const API_BASE_URL = "http://localhost:8000";
const API_URL = `${API_BASE_URL}/user`;
const API_AUTH = `${API_BASE_URL}/auth`;
const API_ADMIN = `${API_BASE_URL}/admin`;

const handleApiRequest = async (url, method, formData, headers = {}) => {
  try {
    const response = await axios({
      method,
      url,
      data: formData,
      headers: { "Content-Type": "application/json", ...headers },
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        message: `Unexpected response status: ${response.status}`,
      };
    }
  } catch (error) {
    return formatError(error);
  }
};

const formatError = (error) => {
  let errorMessage = "An unknown error occurred.";

  if (error.response) {
    errorMessage = error.response.data
      ? JSON.stringify(error.response.data)
      : error.response.statusText || "Server error.";
  } else if (error.request) {
    errorMessage = "No response received from server.";
  } else {
    errorMessage = error.message;
  }

  return { success: false, message: `Error: ${errorMessage}` };
};

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

// New DeleteTask Functionality
export const DeleteTask = async (taskId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_ADMIN}/delete-task/${taskId}`, {  // Use taskId here
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
    const response = await axios.put(`${API_ADMIN}/update-task/${taskId}`, formData, {  // Use taskId to target the task
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
