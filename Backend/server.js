const express = require("express");
const router = express.Router();
const app = express();
const port = 4000;
const { Post } = require("./models");
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Welcome to ChitChat!");
});

const getPost = async (id) => {
  const post = await Post.findByPk(parseInt(id, 10), { include: [Comment] });

  if (!post) {
    throw new NotFoundError("Post not found");
  }
  return post;
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
