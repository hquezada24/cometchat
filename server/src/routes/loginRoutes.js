const { Router } = require("express");
const loginRoutes = Router();
const loginController = require("../controllers/loginController");

loginRoutes.post("/login", loginController);

module.exports = loginRoutes;
