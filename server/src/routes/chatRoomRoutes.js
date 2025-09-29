// chatRoomRoutes
const { Router } = require("express");
const getChatRooms = require("../controllers/getChatRooms");
const postChatRoom = require("../controllers/postChatRoom");

const router = Router();

router.get("/chatrooms", getChatRooms);
router.post("/chatrooms", postChatRoom);

module.exports = router;
