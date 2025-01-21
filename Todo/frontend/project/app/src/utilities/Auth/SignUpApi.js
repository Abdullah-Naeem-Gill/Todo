import { handleApiRequest } from "../ApiHandling";
import { API_URL, API_AUTH } from "../Constants";

// Sign up for an admin
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
