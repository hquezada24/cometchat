const { Router } = require("express");
const { sendMessage } = require("../controllers/chatMessagesController");
const authenticate = require("../middleware/authMiddleware");

const router = Router();

// Send a message to a chatroom
router.post("/:chatId/messages", authenticate, sendMessage);

// Get all messages from a chatroom
// router.get("/:chatId/messages", getChatroomMessages);

module.exports = router;
