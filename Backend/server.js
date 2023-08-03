const express = require("express");
const cors = require("cors");
const router = express.Router();
const chatroomRouter = require("./routes/chatrooms");
const postRouter = require("./routes/posts");
const app = express();
const port = 4000;
const Sequelize = require("sequelize");
const counterCache = require("./services/counterCache");
const { Post, Comment, models } = require("./models");
require("dotenv").config();

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbDialect = "postgres";

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    // the ‘finish’ event will be emitted when the response is handed over to the OS
    console.log(`Response Status: ${res.statusCode}`);
  });
  next();
});
// Welcome message for the root route of the serve
app.get("/", (req, res) => {
  res.send("Welcome to ChitChat!");
});

app.use("/chatrooms", chatroomRouter);
app.use("/posts", postRouter);

// Server listening on port 4000 for requests from the client
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
