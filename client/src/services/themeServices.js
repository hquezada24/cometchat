import { apiRequest } from "./apiClient";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const fetchTheme = async () => {
  apiRequest(`${API_BASE_URL}/api/user/theme`, {
    credentials: "include",
  });
};
const updateTheme = async (newTheme) => {
  apiRequest(`${API_BASE_URL}/api/user/theme`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ theme: newTheme }),
  });
};

export { fetchTheme, updateTheme };
