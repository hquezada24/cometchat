const { Router } = require("express");
const {
  sendMessage,
  editMessage,
} = require("../controllers/chatMessagesController");
const authenticate = require("../middleware/authMiddleware");

const router = Router();

// Send a message to a chatroom
router.post("/:chatId/messages", authenticate, sendMessage);
router.patch("/:chatId/messages", authenticate, editMessage);

// Get all messages from a chatroom
// router.get("/:chatId/messages", getChatroomMessages);

module.exports = router;
