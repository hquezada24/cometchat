// controllers/authController.js
const jwt = require("jsonwebtoken");

const authStatusController = (req, res) => {
  const token = req.cookies.token; // cookie-parser needed

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      authenticated: true,
      user: {
        id: decoded.id,
        fullName: decoded.fullName,
        username: decoded.username,
        email: decoded.email,
      },
    });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
};

module.exports = { authStatusController };
