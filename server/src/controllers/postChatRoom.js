// server/src/controllers/postChatRoom.js
const { createChatRoom } = require("../models/chatRooms");

const postChatRoom = async (req, res) => {
  try {
    // Prefer authenticated user id (adjust to your auth middleware)
    const userId = req.user?.id || req.session?.userId || req.body.userId;
    const otherUserId = req.body.otherUserId || req.body.recipientId;
    const initialMessage = req.body.message; // optional

    if (!userId) {
      return res
        .status(401)
        .json({ status: "failed", message: "Not authenticated" });
    }

    if (!otherUserId) {
      return res
        .status(400)
        .json({ status: "failed", message: "Missing otherUserId" });
    }

    const chatRoom = await createChatRoom(userId, otherUserId, initialMessage);
    return res.status(201).json(chatRoom);
  } catch (error) {
    console.error("Error creating chat room:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to create chat room",
    });
  }
};

module.exports = postChatRoom;
