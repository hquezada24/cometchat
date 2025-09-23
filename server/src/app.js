const express = require("express");
const app = express();
require("dotenv").config();

// Global Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running on localhost:${process.env.PORT ? process.env.PORT : 3000}`
  );
});
