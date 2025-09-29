// routes/users.js
const express = require("express");
const { searchUsersController } = require("../controllers/userController");
const userRoutes = express.Router();

// GET /users/search?q=searchterm
userRoutes.get("/search", searchUsersController);

module.exports = userRoutes;
