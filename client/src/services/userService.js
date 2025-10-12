// src/services/userService.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

import { method } from "lodash";
import { apiRequest } from "./apiClient";

function updateProfile(updates) {
  return apiRequest(`${API_BASE_URL}/profile`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(updates),
  });
}

const checkUsername = (username) => {
  return apiRequest(
    `${API_BASE_URL}/api/check-username/${encodeURIComponent(username)}`,
    {
      credentials: "include",
    }
  );
};

export { updateProfile, checkUsername };
