const express = require("express");
const app = express();
const authenticate = require("./src/middleware/authMiddleware");
const createAccountRoutes = require("./src/routes/createAccountRoutes");
const loginRoutes = require("./src/routes/loginRoutes");
const logoutRoutes = require("./src/routes/logoutRoutes");
const userRoutes = require("./src/routes/userRoutes");
const chatRoomRoutes = require("./src/routes/chatRoomRoutes");
const chatMessagesRoutes = require("./src/routes/chatMessagesRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const checkUsernameRoutes = require("./src/routes/checkUsernameRoutes");
const checkEmailRoutes = require("./src/routes/checkEmailRoutes");
const themeRoutes = require("./src/routes/themeRoutes");
const { authStatusController } = require("./src/controllers/authController");
const cors = require("cors");
require("dotenv").config();

// Global Middleware
app.use(express.json());

const corsOptions = {
  origin: "https://hqcometchat.netlify.app",
  optionsSuccessStatus: 200,
};

// Use the cors middleware
app.use(cors(corsOptions));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get("/api/me", authenticate, authStatusController);
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/", createAccountRoutes);
app.use("/", loginRoutes);
app.use("/", logoutRoutes);
app.use("/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api", chatRoomRoutes);
app.use("/api/chatrooms", chatMessagesRoutes);
app.use("/api/check-username", checkUsernameRoutes);
app.use("/api/check-email", checkEmailRoutes);
app.use("/api/user", themeRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running on localhost:${process.env.PORT ? process.env.PORT : 3000}`
  );
});
