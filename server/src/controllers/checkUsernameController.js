const { findUserByUsername } = require("../models/User");

const checkUsernameController = async (req, res) => {
  const { username } = req.params;
  const userId = req.user?.id;
  const currentUser = req.user;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validation
  if (!username || username.length < 3) {
    return res.status(400).json({
      available: false,
      message: "Username must be at least 3 characters long",
    });
  }

  if (username === "admin") {
    return res
      .status(400)
      .json({ available: false, message: "Username not allowed" });
  }

  // only allow letters, numbers, underscores
  const validPattern = /^[A-Za-z0-9_]+$/;
  if (!validPattern.test(username)) {
    return res.status(400).json({
      available: false,
      message: "Username can only contain letters, numbers, and underscores",
    });
  }

  // ✅ NEW check: if it's the same as the current username
  if (currentUser && username === currentUser.username) {
    return res.status(200).json({
      available: true,
      message: "This is already your current username",
      sameAsCurrent: true, // optional extra flag
    });
  }

  try {
    // search username in the db
    const normalized = username.toLowerCase();
    const user = await findUserByUsername(normalized);

    // username not found
    if (!user) {
      return res
        .status(200)
        .json({ available: true, message: "Username available" });
    }

    // username found
    return res
      .status(200)
      .json({ available: false, message: "Username not available" });
  } catch (error) {
    console.error("Error sending message:", error);
    return res
      .status(500)
      .json({ error: "Failed to check username availability" });
  }
};

module.exports = checkUsernameController;
