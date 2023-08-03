const express = require("express");
<<<<<<< HEAD
const cors = require("cors");
=======
const cors = require("cors"); 
>>>>>>> a466f25c47a3d66817bffca793cd3461bf1723bb
const router = express.Router();
const app = express();
const port = 4000;
const Sequelize = require("sequelize");
<<<<<<< HEAD
const counterCache = require("./services/counterCache");
const { Post, Comment, models } = require("./models");
=======
const { Post, Comment } = require("./models");
>>>>>>> a466f25c47a3d66817bffca793cd3461bf1723bb
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
// Welcome message for the root route of the serve
app.get("/", (req, res) => {
  res.send("Welcome to ChitChat!");
});

app.use(cors());

// Server listening on port 4000 for requests from the client
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

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
          required: false,
        },
      ],
    });

    const postsWithNestedComments = await Promise.all(
      allPosts.map(async (post) => {
        const postJSON = post.toJSON();
        postJSON.comments = await Promise.all(
          post.comments.map(async (comment) => {
            const nestedComments = await Comment.getAllNestedComments(comment);
            return {
              ...comment.toJSON(),
              replies: nestedComments,
            };
          })
        );
        return postJSON;
      })
    );

    res.status(200).json(postsWithNestedComments);
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
      include: [
        {
          model: Comment,
          as: "comments",
          where: {
            commentableType: "post",
          },
          required: false,
        },
      ],
    });

    if (post) {
      const postJSON = post.toJSON();
      postJSON.comments = await Promise.all(
        post.comments.map(async (comment) => {
          const nestedComments = await Comment.getAllNestedComments(comment);
          return {
            ...comment.toJSON(),
            replies: nestedComments,
          };
        })
      );

      res.status(200).json(postJSON);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
