const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
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
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate;
