const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createMessage = async (chatroomId, userId, content) => {
  try {
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
  } catch (error) {
    console.error(error);
    throw new Error("Could not store message in the database");
  }
};

const modifyMessage = async (chatroomId, userId, messageId, content) => {
  try {
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
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { content },
    });
    return message;
  } catch (error) {
    if (error.code === "P2025") {
      console.error("Message not found");
      return null;
    }
    console.error(error);
    throw new Error("Could not modify message");
  }
};
const removeMessage = async (chatroomId, userId, id) => {
  try {
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
    const message = await prisma.message.delete({
      where: { id },
    });
    return { success: true, message };
  } catch (error) {
    if (error.code === "P2025") {
      console.error("Message not found");
      return { success: false, message: "Message not found" };
    }
    console.error(error);
    throw new Error("Could not delete message");
  }
};

module.exports = { createMessage, modifyMessage, removeMessage };
