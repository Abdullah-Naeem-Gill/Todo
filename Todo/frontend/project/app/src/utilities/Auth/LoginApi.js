import axios from "axios";
import { API_URL, API_AUTH } from "../Constants";
import { handleApiRequest } from "../ApiHandling";


// Login admin API function
export const loginAdmin = async (username, password) => {
  const formData = { username, password };

  const result = await handleApiRequest(`${API_AUTH}/token`, "POST", formData);

  if (result.success) {
    // Assuming the API returns an access token and role
    const { access_token, role } = result.data;
    localStorage.setItem("access_token", access_token);
    return { success: true, role }; // Return role along with success status
  }

  return result;
};
