const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchTheme = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { theme: true },
    });

    return user.theme;
  } catch (error) {
    throw new Error(`Failed to fetch theme ${error.message}`);
  }
};

const switchTheme = async (id, theme) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { theme },
      select: { theme: true },
    });
    return user.theme;
  } catch (error) {
    throw new Error(`Failed to update theme: ${error.message}`);
  }
};

module.exports = { fetchTheme, switchTheme };
