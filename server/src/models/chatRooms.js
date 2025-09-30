// chatRoomModel.js
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
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return chatRooms;
};

/**
 * Find an existing direct chat between two users
 * @param {string} userId1
 * @param {string} userId2
 * @returns {Promise<Object|null>} existing chatRoom or null
 */
const findExistingDirectChat = async (userId1, userId2) => {
  // Find a chatroom that has exactly these two users
  const chatRooms = await prisma.chatRoom.findMany({
    where: {
      AND: [
        {
          users: {
            some: { id: userId1 },
          },
        },
        {
          users: {
            some: { id: userId2 },
          },
        },
      ],
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
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  // Filter to ensure it's a direct chat (exactly 2 users)
  const directChat = chatRooms.find((room) => room.users.length === 2);

  return directChat || null;
};

/**
 * Create a chat room between two users. Optionally create the initial message.
 * Will not create a duplicate 1-on-1 if one already exists — it returns existing.
 *
 * @param {string} creatorId
 * @param {string} otherUserId
 * @param {string} [initialMessage] optional initial message content
 * @returns {Promise<Object>} chatRoom with users and messages included
 */
const createChatRoom = async (creatorId, otherUserId, initialMessage) => {
  if (!creatorId || !otherUserId) {
    throw new Error("creatorId and otherUserId are required");
  }

  // If a direct chat already exists, return it
  const existing = await findExistingDirectChat(creatorId, otherUserId);
  if (existing) {
    // If there's an initial message, add it to the existing chat
    if (initialMessage) {
      await prisma.message.create({
        data: {
          content: initialMessage,
          sender: { connect: { id: creatorId } },
          chatRoom: { connect: { id: existing.id } },
        },
      });

      // Refetch the chat with the new message
      return await prisma.chatRoom.findUnique({
        where: { id: existing.id },
        include: {
          users: true,
          messages: {
            include: { sender: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }
    return existing;
  }

  // Ensure both users exist
  const [creator, other] = await Promise.all([
    prisma.user.findUnique({ where: { id: creatorId } }),
    prisma.user.findUnique({ where: { id: otherUserId } }),
  ]);

  if (!creator || !other) {
    throw new Error("One or both users not found");
  }

  // Create chat room (and optionally the initial message) atomically
  const created = await prisma.$transaction(async (tx) => {
    // create chat room and connect users
    const chatRoom = await tx.chatRoom.create({
      data: {
        users: {
          connect: [{ id: creatorId }, { id: otherUserId }],
        },
      },
    });

    // optionally create initial message
    if (initialMessage) {
      await tx.message.create({
        data: {
          content: initialMessage,
          sender: { connect: { id: creatorId } },
          chatRoom: { connect: { id: chatRoom.id } },
        },
      });
    }

    return chatRoom;
  });

  // Fetch and return the chatRoom with users and ordered messages
  const fullChat = await prisma.chatRoom.findUnique({
    where: { id: created.id },
    include: {
      users: true,
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return fullChat;
};

module.exports = {
  getChatRoomsByUserId,
  createChatRoom,
  findExistingDirectChat,
};
