const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createMessage = async (chatroomId, userId, content) => {
  // Verify user is a member of the chatroom
  const membership = await prisma.chatRoom.findFirst({
    where: {
      id: chatroomId,
      users: {
        some: {
          id: userId,
        },
      },
    },
  });

  if (!membership) {
    throw new Error("User is not a member of this chatroom");
  }

  // Create the message
  const message = await prisma.message.create({
    data: {
      content,
      chatRoomId: chatroomId,
      senderId: userId,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return message;
};

module.exports = { createMessage };
