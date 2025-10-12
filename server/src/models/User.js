const { genPassword } = require("../utils/passwordUtils");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const registerUser = async (data) => {
  try {
    // Check for existing user by email
    let user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    const password = await genPassword(data.password);

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          password: password,
        },
      });
    }
    return user;
  } catch (error) {
    throw new Error(`Failed to find or create user: ${error.message}`);
  }
};

const verifyUser = async ({ login }) => {
  try {
    const isEmail = login.includes("@");

    const user = await prisma.user.findUnique({
      where: isEmail ? { email: login } : { username: login },
    });

    return user;
  } catch (error) {
    throw new Error(`Failed to find user: ${error.message}`);
  }
};

const findUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error) {
    throw new Error(`Failed to find user: ${error.message}`);
  }
};

const findUserByUsername = async (username) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    return user;
  } catch (error) {
    throw new Error(`Failed to find user: ${error.message}`);
  }
};

const updateUser = async (id, updates) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: updates,
    });

    return user;
  } catch (error) {
    throw new Error(`Failed to update user name: ${error.message}`);
  }
};

module.exports = {
  registerUser,
  verifyUser,
  findUserById,
  findUserByUsername,
  updateUser,
};
