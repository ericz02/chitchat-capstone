const express = require("express");
const cors = require("cors");
const router = express.Router();
const chatroomRouter = require("./routes/chatrooms");
const authRouter = require("./routes/auth");
const app = express();
const port = 4000;
const Sequelize = require("sequelize");
const counterCache = require("./services/counterCache.js");
const { Post, Comment, Chatroom, Likes, User, UserChatRoom } = require("./models");

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

//middleware
app.use(express.json()); // For parsing JSON data in requests

//for debugging purposes, logs information about each incoming request
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Response Status: ${res.statusCode}`);
  });
  next();
});

app.use(cors());
// Welcome message for the root route of the serve
app.get("/", (req, res) => {
  res.send("Welcome to ChitChat!");
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

//routes
app.use("/chatrooms", chatroomRouter);
app.use("/auth", authRouter);

// Server listening on port 4000 for requests from the client
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
