const express = require("express");
const router = express.Router();
const app = express();
const port = 4000;
const { Post, Comment } = require("./models");
require("dotenv").config();

// Welcome message for the root route of the serve
app.get("/", (req, res) => {
  res.send("Welcome to ChitChat!");
});

// Server listening on port 4000 for requests from the client
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Route to get all posts from the database
app.get("/posts", async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      where: {
        CommentableId: 1,
        commentableType: "post",
      },
      include: [
        {
          model: Comment,
          as: "comments",
        },
      ],
    });

    res.status(200).json(allPosts);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Get a specific post
app.get("/posts/:id", async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  try {
    const post = await Post.findOne({
      where: { id: postId },
      include: [Comment],
    });

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
