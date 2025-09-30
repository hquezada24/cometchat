// apiServices.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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
  console.log(
    `Now sending post to ${API_BASE_URL}/api/chatrooms/${chatId}/messages`
  );
  const response = await fetch(
    `${API_BASE_URL}/api/chatrooms/${chatId}/messages`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    }
  );
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

export { fetchCurrentUser, fetchChatRooms, searchUsers, sendMessage };
