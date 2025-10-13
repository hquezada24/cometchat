const { findUserByEmail } = require("../models/User");

const checkEmailController = async (req, res) => {
  const { email } = req.params;
  const userId = req.user?.id;
  const currentUser = req.user;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) {
    return res.status(400).json({
      available: false,
      message: "Email format not valid",
    });
  }

  // ✅ NEW check: if it's the same as the current email
  if (currentUser && email === currentUser.email) {
    return res.status(200).json({
      available: true,
      message: "This is already your current email",
      sameAsCurrent: true, // optional extra flag
    });
  }

  try {
    // search email in the db
    const normalized = email.toLowerCase();
    const user = await findUserByEmail(normalized);

    // email not found
    if (!user) {
      return res
        .status(200)
        .json({ available: true, message: "Email available" });
    }

    // email found
    return res
      .status(200)
      .json({ available: false, message: "Email not available" });
  } catch (error) {
    console.error("Error sending message:", error);
    return res
      .status(500)
      .json({ error: "Failed to check email availability" });
  }
};

module.exports = checkEmailController;
