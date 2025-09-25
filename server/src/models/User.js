const { genPassword } = require("../utils/passwordUtils");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const registerUser = async (data) => {
  try {
    // Check for existing customer by email
    let customer = await prisma.user.findUnique({
      where: { email: data.email },
    });

    const password = await genPassword(data.password);

    if (!customer) {
      // Create new customer
      customer = await prisma.user.create({
        data: {
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          password: password,
        },
      });
    }
    return customer;
  } catch (error) {
    throw new Error(`Failed to find or create customer: ${error.message}`);
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
    throw new Error(`Failed to find customer: ${error.message}`);
  }
};

module.exports = { registerUser, verifyUser };
