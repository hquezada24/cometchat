// const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const registerUser = async (data) => {
  try {
    // Check for existing customer by email
    let customer = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!customer) {
      // Create new customer
      customer = await prisma.user.create({
        data: {
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          password: data.password,
        },
      });
    }
    return customer;
  } catch (error) {
    throw new Error(`Failed to find or create customer: ${error.message}`);
  }
};

module.exports = registerUser;
