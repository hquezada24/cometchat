// src/services/apiClient.js
export async function apiRequest(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API Request error:", err);
    throw err;
  }
}
