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
      messages: true,
    },
  });

  // Transform data to match frontend expectations
  return chatRooms;
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
