const express = require("express");
const app = express();
const createAccountRoutes = require("./src/routes/createAccountRoutes");
const loginRoutes = require("./src/routes/loginRoutes");
const cors = require("cors");
require("dotenv").config();

// Global Middleware
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173", // or whatever your React app's port is
  optionsSuccessStatus: 200, // For legacy browser support
};

// Use the cors middleware
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/", createAccountRoutes);
app.use("/", loginRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running on localhost:${process.env.PORT ? process.env.PORT : 3000}`
  );
});
