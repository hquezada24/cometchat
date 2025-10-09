// routes/profileRoutes.js
const express = require("express");
const profileController = require("../controllers/profileController");
const authenticate = require("../middleware/authMiddleware");
const profileRoutes = express.Router();

// GET /users/search?q=searchterm
profileRoutes.patch("/", authenticate, profileController);

module.exports = profileRoutes;
