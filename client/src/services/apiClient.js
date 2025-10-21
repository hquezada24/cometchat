// src/services/apiClient.js
export async function apiRequest(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("API Request error:", err);
    throw err;
  }
}
