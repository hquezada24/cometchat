const { Router } = require("express");
const themeRoutes = Router();
const authenticate = require("../middleware/authMiddleware");
const {
  themeController,
  updateThemeController,
} = require("../controllers/themeController");

themeRoutes.get("/theme", authenticate, themeController);
themeRoutes.patch("/theme", authenticate, updateThemeController);

module.exports = themeRoutes;
