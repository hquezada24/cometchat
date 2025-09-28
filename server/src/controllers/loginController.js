const { verifyUser } = require("../models/User");
const { validPassword } = require("../utils/passwordUtils");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await verifyUser({ login });

    if (!user) {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid credentials" });
    }

    const isValid = await validPassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid password" });
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
      // secure: process.env.NODE_ENV === "production",
      secure: false, // keep false on localhost
      sameSite: "lax",
      //sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.json({
      status: "success",
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = loginController;
