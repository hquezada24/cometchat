const { Router } = require("express");
const logoutRoutes = Router();
const logoutController = require("../controllers/logoutController");

logoutRoutes.post("/logout", logoutController);

module.exports = logoutRoutes;
