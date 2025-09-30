const jwt = require("jsonwebtoken");

// Extend Express Request to include user property

const authenticate = async (req, res, next) => {
  try {
    // Option 1: Get token from cookie
    const token = req.cookies.token;

    // Option 2: Get token from Authorization header
    // const authHeader = req.headers.authorization;
    // const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    console.log("cookies: ", token);
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      fullName: decoded.fullName,
      username: decoded.username,
      email: decoded.email,
    };

    // Continue to the next middleware/controller
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate;
