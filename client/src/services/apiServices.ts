const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    credentials: "include", // No Authorization header needed!
  });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
};

const fetchChatRooms = async () => {
  const response = await fetch(`${API_BASE_URL}/api/chatrooms`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch chat rooms");
  return response.json();
};

const searchUsers = async (query: string) => {
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

const sendMessage = async (chatId: string, message: string) => {
  const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

export { fetchCurrentUser, fetchChatRooms, searchUsers, sendMessage };
