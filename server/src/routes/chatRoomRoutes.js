// chatRoomRoutes
const { Router } = require("express");
const getChatRooms = require("../controllers/getChatRooms");
const postChatRoom = require("../controllers/postChatRoom");
const authenticate = require("../middleware/authMiddleware");

const router = Router();

// Add authenticate middleware to both routes
router.get("/chatrooms", authenticate, getChatRooms);
router.post("/chatrooms", authenticate, postChatRoom);

module.exports = router;
