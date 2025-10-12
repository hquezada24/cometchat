const { Router } = require("express");
const checkUsernameRoutes = Router();
const authenticate = require("../middleware/authMiddleware");
const checkUsernameController = require("../controllers/checkUsernameController");

checkUsernameRoutes.get("/:username", authenticate, checkUsernameController);

module.exports = checkUsernameRoutes;
