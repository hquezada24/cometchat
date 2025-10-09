// src/services/userService.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

import { apiRequest } from "./apiClient";

export function updateProfile(updates) {
  return apiRequest(`${API_BASE_URL}/profile`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(updates),
  });
}
