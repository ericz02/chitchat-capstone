const express = require("express");
const router = express.Router();
const app = express();
const port = 4000;
const { Post } = require("./models");
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Welcome to ChitChat!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
