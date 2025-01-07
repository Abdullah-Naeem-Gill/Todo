import axios from "axios";

// Base URL for your backend API
const API_BASE_URL = "http://localhost:8000";
const API_URL = `${API_BASE_URL}/user`;
const API_AUTH = `${API_BASE_URL}/auth`;
const API_ADMIN = `${API_BASE_URL}/admin`;

// Utility function for handling API requests
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
      return { success: false, message: `Unexpected response status: ${response.status}` };
    }
  } catch (error) {
    return formatError(error);
  }
};

// Centralized error formatting function
const formatError = (error) => {
  let errorMessage = "An unknown error occurred.";
  
  if (error.response) {
    // Server responded with a non-2xx status code
    errorMessage = error.response.data ? JSON.stringify(error.response.data) : error.response.statusText || "Server error.";
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = "No response received from server.";
  } else {
    // Something happened in setting up the request
    errorMessage = error.message;
  }

  return { success: false, message: `Error: ${errorMessage}` };
};

// Centralized function for managing token retrieval
const getAuthToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found, please log in first.");
  }
  return token;
};

// Function to handle login API request for a user
export const loginUser = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(`${API_URL}/login/user`, "POST", formData);

  if (result.success) {
    localStorage.setItem("access_token", result.data.access_token);
  }

  return result;
};

// Function to handle signup API request for a user
export const signupUser = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(`${API_URL}/register`, "POST", formData);

  if (result.success) {
    localStorage.setItem("access_token", result.data.access_token);
  }

  return result;
};

// Function to handle signup API request for an admin
export const signupAdmin = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(`${API_AUTH}/register/admin`, "POST", formData);

  if (result.success) {
    localStorage.setItem("access_token", result.data.access_token);
  }

  return result;
};

// Function to handle login API request for an admin
export const loginAdmin = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(`${API_AUTH}/token`, "POST", formData); // Updated to reflect admin login route

  if (result.success) {
    localStorage.setItem("access_token", result.data.access_token);
  }

  return result;
};

// Function to handle task creation by admin
export const CreateTask = async (title, description) => {
  const formData = { title, description };

  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_ADMIN}/createTask`,  // Adjusted path for task creation
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: "Task created successfully!" };
    } else {
      return { success: false, message: "Unexpected response status." };
    }
  } catch (error) {
    return formatError(error);
  }
};

// Function to get all tasks for admin
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
