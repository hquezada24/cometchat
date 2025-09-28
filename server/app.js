const express = require("express");
const app = express();
const createAccountRoutes = require("./src/routes/createAccountRoutes");
const loginRoutes = require("./src/routes/loginRoutes");
const logoutRoutes = require("./src/routes/logoutRoutes");
const { authStatusController } = require("./src/controllers/authController");
const cors = require("cors");
require("dotenv").config();

// Global Middleware
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173", // or whatever your React app's port is
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
};

// Use the cors middleware
app.use(cors(corsOptions));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get("/api/me", authStatusController);
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/", createAccountRoutes);
app.use("/", loginRoutes);
app.use("/", logoutRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running on localhost:${process.env.PORT ? process.env.PORT : 3000}`
  );
});
