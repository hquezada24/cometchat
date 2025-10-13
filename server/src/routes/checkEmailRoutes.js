const { Router } = require("express");
const checkEmailRoutes = Router();
const authenticate = require("../middleware/authMiddleware");
const checkEmailController = require("../controllers/checkEmailController");

checkEmailRoutes.get("/:email", authenticate, checkEmailController);

module.exports = checkEmailRoutes;
