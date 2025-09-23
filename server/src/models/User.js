const crypto = require("crypto");
const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient();

export const registerUser = async (data) => {
  try {
    // Check for existing customer by email
    let customer = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!customer) {
      // Create new customer
      customer = await tx.customer.create({
        data: {
          fullName: data.fullName,
          companyName: data.companyName,
          email: data.email,
          phone: data.phone,
        },
      });
    }
    return customer;
  } catch (error) {
    throw new Error(`Failed to find or create customer: ${error.message}`);
  }
};
