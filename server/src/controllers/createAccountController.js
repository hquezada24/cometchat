const { registerUser } = require("../models/User");
const jwt = require("jsonwebtoken");

const createAccountController = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Account information could not be stored correctly",
      });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.json({
      status: "success",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = createAccountController;
