// chatRoomController.ts
const { getChatRoomsByUserId } = require("../models/chatRooms");

const getChatRooms = async (req, res) => {
  try {
    // Assuming you have user info from auth middleware
    const userId = req.query.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const chatRooms = await getChatRoomsByUserId(userId);

    if (!chatRooms) return res.send("prisma failed");

    return res.status(200).json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return res.status(500).json({ error: "Failed to fetch chat rooms" });
  }
};

module.exports = getChatRooms;
