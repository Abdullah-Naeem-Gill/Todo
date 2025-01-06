import axios from "axios";

// Base URL for your backend API
const API_URL = "http://localhost:8000/user";
const API_Auth = "http://localhost:8000/auth";
const API_Admin = "http://localhost:8000/admin";

// Utility function for handling API requests
const handleApiRequest = async (url, method, formData, headers = {}) => {
  try {
    const response = await axios({
      method,
      url,
      data: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded", ...headers },
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Unexpected response status." };
    }
  } catch (error) {
    // Improve error handling
    let errorMessage = "An unknown error occurred.";
    if (error.response) {
      // Server responded with a non-2xx status code
      if (error.response.data) {
        // Extract the error message from the response body
        errorMessage = JSON.stringify(error.response.data);
      } else {
        // If response does not contain a body, use status text
        errorMessage = error.response.statusText || "Server error.";
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response received from server.";
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }
    
    return { success: false, message: `Error: ${errorMessage}` };
  }
};

// Function to handle login API request for a user
export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const result = await handleApiRequest(`${API_URL}/login/user`, "POST", formData);

  if (result.success) {
    // Store the access token in localStorage
    localStorage.setItem("access_token", result.data.access_token);
  }
  return result;
};

// Function to handle signup API request for a user
export const signupUser = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(`${API_URL}/register`, "POST", formData);

  if (result.success) {
    // Store the access token in localStorage
    localStorage.setItem("access_token", result.data.access_token);
  }
  return result;
};

// Function to handle signup API request for an admin
export const signupAdmin = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(`${API_Auth}/register/admin`, "POST", formData);

  if (result.success) {
    // Store the access token in localStorage
    localStorage.setItem("access_token", result.data.access_token);
  }
  return result;
};

// Function to handle login API request for an admin
export const loginAdmin = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const result = await handleApiRequest(`${API_Auth}/token`, "POST", formData);

  if (result.success) {
    // Store the access token in localStorage
    localStorage.setItem("access_token", result.data.access_token);
  }
  return result;
};

// Function to handle task creation by admin
export const CreateTask = async (title, description) => {
  const formData = {
    title: title,
    description: description
  };

  const token = localStorage.getItem("access_token");

  // Debugging: Log the token to see if it's stored correctly
  console.log("Token retrieved:", token);

  if (!token) {
    return { success: false, message: "No access token found, please log in first." };
  }

  try {
    // Send the request with JSON format
    const response = await axios.post(
      `${API_Admin}/createTask`,
      formData, // Send as JSON
      {
        headers: {
          "Content-Type": "application/json",  // Correct content type for JSON
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      // Successfully created the task
      return { success: true, message: "Task created successfully!" };
    } else {
      return { success: false, message: "Unexpected response status." };
    }
  } catch (error) {
    // Handle and return the error message properly
    let errorMessage = "An unknown error occurred.";
    if (error.response) {
      if (error.response.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else {
        errorMessage = error.response.statusText || "Server error.";
      }
    } else if (error.request) {
      errorMessage = "No response received from server.";
    } else {
      errorMessage = error.message;
    }
    return { success: false, message: `Error: ${errorMessage}` };
  }
};



export const GetAllTasks = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return { success: false, message: "No access token found, please log in first." };
  }

  try {
    const response = await axios.get(`${API_Admin}/getTasks`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { success: true, tasks: response.data }; // Directly use response.data as the tasks array
    } else {
      return { success: false, message: "Unexpected response status." };
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred.";
    if (error.response) {
      if (error.response.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else {
        errorMessage = error.response.statusText || "Server error.";
      }
    } else if (error.request) {
      errorMessage = "No response received from server.";
    } else {
      errorMessage = error.message;
    }
    return { success: false, message: `Error: ${errorMessage}` };
  }
};

