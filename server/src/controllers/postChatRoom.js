const { createChatRoom } = require("../models/chatRooms");

const postChatRoom = async (req, res) => {
  try {
    const { userId, otherUserId } = req.body;

    console.log(userId, otherUserId);

    const chatRoom = await createChatRoom(userId, otherUserId);

    return res
      .status(400)
      .json({ status: "failed", message: "Failed to create chat room" });

    return res.status(200).json(chatRoom);
  } catch (error) {
    console.error("Error creating chat room:", error);
    return res.status(500).json({ error: "Failed to create chat room" });
  }
};

module.exports = postChatRoom;
