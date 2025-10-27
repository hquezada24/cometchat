const { PrismaClient } = require("@prisma/client");

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
        await prisma.user.create({ data: userData });
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

module.exports = { registerDefaultUsers };
