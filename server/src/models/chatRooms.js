// chatRoomModel.ts
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getChatRoomsByUserId = async (userId) => {
  const chatRooms = await prisma.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      users: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1, // Get only the last message for preview
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc", // Most recently active chats first
    },
  });

  // Transform data to match frontend expectations
  return chatRooms.map((chat) => ({
    id: chat.id,
    users: chat.users,
    messages: chat.messages,
    otherUser: chat.users.find((p) => p.id !== userId),
    lastMessage: chat.messages[0] || null,
    createdAt: chat.createdAt,
  }));
};

const createChatRoom = async (userId, otherUserId) => {
  try {
    // Validate both users exist

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
    });

    if (!user || !otherUser) {
      throw new Error("One or both users not found");
    }

    // Create the chat room and connect both users
    const chatRoom = await prisma.chatRoom.create({
      data: {
        users: {
          connect: [{ id: userId }, { id: otherUserId }],
        },
      },
      include: {
        users: true, // optional, useful for returning users immediately
      },
    });

    return chatRoom;
  } catch (error) {
    console.error("Error creating chat room:", error.message);
    throw new Error("Could not create chat room. Please try again later.");
  }
};

module.exports = { getChatRoomsByUserId, createChatRoom };
