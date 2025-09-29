// models/userModel.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const searchUsers = async (query) => {
  try {
    // Return empty if query too short to avoid unnecessary DB hits
    if (!query || query.trim().length < 2) {
      return [];
    }

    const trimmedQuery = query.trim();

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              startsWith: trimmedQuery, // More efficient than contains
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
          {
            fullName: {
              startsWith: trimmedQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        // Only select what you need for better performance
      },
      take: 20, // Smaller limit for faster queries
      orderBy: [
        // Prioritize exact username matches
        { username: "asc" },
      ],
    });

    return users;
  } catch (error) {
    console.error("Database search error:", error);
    throw error;
  }
};

module.exports = { searchUsers };
