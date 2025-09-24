const { Router } = require("express");
const createAccountRoutes = Router();
const createAccountController = require("../controllers/createAccountController");

createAccountRoutes.post("/create-account", createAccountController);

module.exports = createAccountRoutes;
