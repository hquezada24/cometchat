const { updateUser } = require("../models/User");

const profileController = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const allowedFields = ["fullName", "username", "email"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
  );

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  try {
    const updatedInfo = await updateUser(userId, updates);
    res.status(200).json(updatedInfo);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update profile" });
  }
};

module.exports = profileController;
