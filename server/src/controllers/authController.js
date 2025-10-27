// controllers/authController.js
const { findUserById } = require("../models/User");

const authStatusController = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.json({ authenticated: false, user: null });
  }

  try {
    const user = await findUserById(userId);
    res.json({ authenticated: true, user: user });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
};

module.exports = { authStatusController };
