const { Router } = require("express");
const {
  sendMessage,
  editMessage,
  deleteMessage,
} = require("../controllers/chatMessagesController");
const authenticate = require("../middleware/authMiddleware");

const router = Router();

// Send a message to a chatroom
router.post("/:chatId/messages", authenticate, sendMessage);
router.patch("/:chatId/messages", authenticate, editMessage);
router.delete("/:chatId/messages", authenticate, deleteMessage);

// Get all messages from a chatroom
// router.get("/:chatId/messages", getChatroomMessages);

module.exports = router;
