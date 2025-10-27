// controllers/authController.js
const { findUserById } = require("../models/User");
const jwt = require("jsonwebtoken");

const authStatusController = async (req, res) => {
  // Get token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res.json({ authenticated: false, user: null });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserById(decoded.id);
    res.json({ authenticated: true, user: user });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
};

module.exports = { authStatusController };
