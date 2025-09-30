// chatRoomController.js
const { getChatRoomsByUserId } = require("../models/chatRooms");

const getChatRooms = async (req, res) => {
  try {
    // Get userId from authenticated user (set by authenticate middleware)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const chatRooms = await getChatRoomsByUserId(userId);

    if (!chatRooms) {
      return res.status(500).json({ error: "Failed to fetch chat rooms" });
    }

    return res.status(200).json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return res.status(500).json({ error: "Failed to fetch chat rooms" });
  }
};

module.exports = getChatRooms;
