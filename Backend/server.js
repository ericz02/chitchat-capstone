const express = require("express");
const router = express.Router();
const app = express();
const port = 4000;
const { Post, Comment, Chatroom, Likes, User, UserChatRoom } = require("./models");
require("dotenv").config();

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

// Welcome message for the root route of the serve
app.get("/", (req, res) => {
  res.send("Welcome to ChitChat!");
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

// CRUD for Chatroom

//get a list of all chatrooms
app.get("/chatrooms", async (req, res) => {
    try {
      const allChatrooms = await Chatroom.findAll();
      res.status(200).json(allChatrooms);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });

// get a chatroom by id
app.get("/chatrooms/:id", async (req, res) => {

  const chatroomId = parseInt(req.params.id, 10);

  try {
    const chatroom = await Chatroom.findOne({where: {id: chatroomId}});

    if (chatroom) {
      res.status(200).json(chatroom);
    } else {
      res.status(404).send({message: 'Chatroom not found'});
    }
  } catch (err) {
    console.error(err);
      res.status(500).send({ message: err.message });
  }
});

// create a new community

// update a chatroom by id

// Delete a chatroom by ID.




// Server listening on port 4000 for requests from the client
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});