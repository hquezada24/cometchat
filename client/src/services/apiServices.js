// apiServices.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
import { apiRequest } from "./apiClient";

const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
};

const fetchChatRooms = async () => {
  // Remove userId param - backend will use authenticated user
  const response = await fetch(`${API_BASE_URL}/api/chatrooms`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errTxt = await response.text().catch(() => "");
    throw new Error("Failed to fetch chat rooms: " + errTxt);
  }

  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.chats)) return data.chats;
  return data || [];
};

const searchUsers = async (query) => {
  console.log("🔍 Searching for:", query);
  console.log(
    "🌐 API URL:",
    `${API_BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`
  );
  const response = await fetch(
    `${API_BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`,
    {
      credentials: "include",
    }
  );

  console.log("📡 Response status:", response.status);
  console.log("📡 Response OK:", response.ok);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ API Error Response:", errorText);
    throw new Error("Failed to search users");
  }
  const data = await response.json();
  console.log("✅ Search results:", data);
  return data;
};

const sendMessage = async (chatId, message) => {
  const response = await apiRequest(
    `${API_BASE_URL}/api/chatrooms/${chatId}/messages`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        message: message,
      }),
    }
  );

  return response;
};

const modifyMessage = async (chatId, message, messageId) => {
  const response = await apiRequest(
    `${API_BASE_URL}/api/chatrooms/${chatId}/messages`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({
        message: message,
        messageId: messageId,
      }),
    }
  );
  if (!response.ok) throw new Error("Failed to modify message");
  return response.json();
};

const deleteMessage = async (chatId, messageId) => {
  try {
    const response = await apiRequest(
      `${API_BASE_URL}/api/chatrooms/${chatId}/messages`,
      {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({
          messageId: messageId,
        }),
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete message");
  }
};

export {
  fetchCurrentUser,
  fetchChatRooms,
  searchUsers,
  sendMessage,
  modifyMessage,
  deleteMessage,
};
