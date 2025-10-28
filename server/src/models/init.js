const { PrismaClient } = require("@prisma/client");
const { genPassword } = require("../utils/passwordUtils");

const prisma = new PrismaClient();

const usersToRegister = [
  {
    fullName: "Hugo",
    username: "hugo",
    email: "contact@hugo.com",
    password: "hugo",
  },
  {
    fullName: "Alberto",
    username: "alberto",
    email: "contact@alberto.com",
    password: "hello",
  },
  {
    fullName: "Alice",
    username: "alice",
    email: "contact@alice.com",
    password: "alice",
  },
  {
    fullName: "Sarah",
    username: "sarah",
    email: "contact@sarah.com",
    password: "sarah",
  },
];

const registerDefaultUsers = async () => {
  try {
    for (const userData of usersToRegister) {
      // Check if user exists by username or email
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: userData.username }, { email: userData.email }],
        },
      });

      if (!existingUser) {
        const password = await genPassword(userData.password);

        await prisma.user.create({
          data: {
            fullName: userData.fullName,
            username: userData.username,
            email: userData.email,
            password: password,
          },
        });

        console.log(`✅ Created user: ${userData.username}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.username}`);
      }
    }
  } catch (error) {
    console.error("❌ Failed to register users:", error);
  } finally {
    await prisma.$disconnect();
  }
};

const createChatroomsWithAlberto = async () => {
  const alberto = await prisma.user.findUnique({
    where: { username: "alberto" },
  });

  if (!alberto) {
    console.error("❌ Alberto not found. Run registerDefaultUsers() first.");
    return;
  }

  const otherUsers = await prisma.user.findMany({
    where: { username: { not: "alberto" } },
  });

  for (const user of otherUsers) {
    // Check if chatroom already exists between Alberto and this user
    const existingChat = await prisma.chatRoom.findFirst({
      where: {
        users: {
          every: {
            id: { in: [alberto.id, user.id] },
          },
        },
      },
    });

    if (!existingChat) {
      await prisma.chatRoom.create({
        data: {
          name: `${alberto.username}-${user.username}`,
          users: {
            connect: [{ id: alberto.id }, { id: user.id }],
          },
        },
      });

      console.log(`💬 Created chatroom`);
    } else {
      console.log(`⚠️  Chatroom already exists: Alberto ↔ ${user.username}`);
    }
  }
};

const mockConversations = {
  "alberto-hugo": [
    { from: "alberto", text: "Hey Hugo! How’s your project going?" },
    { from: "hugo", text: "Pretty good! I just fixed a big bug in the API." },
    { from: "alberto", text: "Nice! Are you deploying it soon?" },
    { from: "hugo", text: "Yeah, probably later today. 🚀" },
  ],
  "alberto-alice": [
    { from: "alberto", text: "Hey Alice, did you review the new design?" },
    { from: "alice", text: "Yes! It looks clean and modern. Great work!" },
    { from: "alberto", text: "Glad you liked it 😄" },
  ],
  "alberto-sarah": [
    { from: "alberto", text: "Hey Sarah, ready for the team meeting?" },
    { from: "sarah", text: "Almost! Just finishing my notes." },
    { from: "alberto", text: "Cool, see you in 5 mins then." },
  ],
};

const fillChatroomsWithMockConversations = async () => {
  try {
    const alberto = await prisma.user.findUnique({
      where: { username: "alberto" },
    });

    if (!alberto) {
      console.error(
        "❌ Alberto not found. Make sure users and rooms are seeded first."
      );
      return;
    }

    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        users: {
          some: { id: alberto.id },
        },
      },
      include: {
        users: true,
      },
    });

    for (const room of chatRooms) {
      const hasMessages = await prisma.message.count({
        where: { chatRoomId: room.id },
      });

      if (hasMessages > 0) {
        console.log(
          `⚠️  Chatroom "${room.name}" already has messages, skipping.`
        );
        continue;
      }

      // const otherUser = room.users.find((u) => u.username !== "alberto");
      const convo = mockConversations[room.name];

      if (!convo) {
        console.log(`ℹ️ No predefined messages for ${room.name}, skipping.`);
        continue;
      }

      // Create messages sequentially to preserve order
      for (const msg of convo) {
        const sender =
          msg.from === "alberto"
            ? alberto
            : await prisma.user.findUnique({
                where: { username: msg.from },
              });

        await prisma.message.create({
          data: {
            content: msg.text,
            senderId: sender.id,
            chatRoomId: room.id,
          },
        });
      }

      console.log(`💬 Added ${convo.length} messages to "${room.name}"`);
    }
  } catch (error) {
    console.error("❌ Failed to fill chatrooms:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run it directly or export it
// module.exports = { fillChatroomsWithMockConversations };

const main = async () => {
  try {
    await registerDefaultUsers();
    await createChatroomsWithAlberto();
    await fillChatroomsWithMockConversations();
  } catch (err) {
    console.error("❌ Seeder error:", err);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { main };
