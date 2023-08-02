const express = require("express");
const router = express.Router();
const app = express();
const port = 4000;
const Sequelize = require("sequelize");
const counterCache = require("./services/counterCache.js");
const { Post, Comment } = require("./models");
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

// Welcome message for the root route of the serve
app.get("/", (req, res) => {
  res.send("Welcome to ChitChat!");
});

// Server listening on port 4000 for requests from the client
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//Grab all nested comments
async function getNestedComments(comment) {
  const nestedComments = [];
  const replies = await Comment.findAll({
    where: {
      CommentableId: comment.id,
      commentableType: "comment",
    },
  });

  for (const reply of replies) {
    const nestedComment = {
      id: reply.id,
      content: reply.content,
      likesCount: reply.likesCount,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
    };

    // Recursively fetch nested comments for the current reply
    nestedComment.replies = await getNestedComments(reply);

    nestedComments.push(nestedComment);
  }

  return nestedComments;
}

// Route to get all posts from the database
app.get("/posts", async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      include: [
        {
          model: Comment,
          as: "comments",
          where: {
            commentableType: "post",
          },
          //required: false,
          /* include: [
            {
              model: Comment,
              as: "replies",
              where: {
                commentableType: "comment",
              },
              required: false,
            },
          ], */
        },
      ],
    });

    for (const post of allPosts) {
      for (const comment of post.comments) {
        comment.replies = await Comment.getNestedComments(comment);
      }
    }

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
