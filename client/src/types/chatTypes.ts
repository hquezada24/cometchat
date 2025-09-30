// src/types/chatTypes.ts

// Base types that match your Prisma schema
export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatRoomId: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
}

// This should match your Prisma ChatRoom model
export interface ChatRoom {
  id: string;
  users: User[];
  messages: Message[];
  createdAt: string;
}

// Extended Chat type for frontend use
// Includes both backend data and frontend-only properties
export interface Chat extends ChatRoom {
  // Frontend-only properties
  isTemporary?: boolean; // For temporary chats before saving to DB
  otherUser?: User; // Cached reference to the other user
  unread?: number; // Client-side unread count
  online?: boolean; // Real-time online status (from WebSocket)
  isGroup?: boolean; // Derived from users.length > 2
}

// Type guard to check if a chat is temporary
export const isTemporaryChat = (chat: Chat): boolean => {
  return chat.isTemporary === true || chat.id.startsWith("temp-");
};

// Helper to create a temporary chat
export const createTemporaryChat = (
  currentUser: User,
  otherUser: User
): Chat => {
  return {
    id: `temp-${otherUser.id}`,
    users: [currentUser, otherUser],
    messages: [],
    createdAt: new Date().toISOString(),
    isTemporary: true,
    otherUser: otherUser,
    unread: 0,
  };
};
