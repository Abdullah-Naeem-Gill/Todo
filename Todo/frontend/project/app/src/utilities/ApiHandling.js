import axios from "axios";

export const handleApiRequest = async (url, method, formData, headers = {}) => {
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
