const express = require("express");
const router = express.Router();
const { User, Post, Comment, UserChatRoom } = require("../models");
const { authenticateUser } = require("../middleware/auth");

//gets user by id
router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

router.patch("/:id", authenticateUser, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await User.findOne({ where: { id: userId } });

    const updatedUserProfile = await user.update(req.body);
    res.status(200).json(updatedUserProfile);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//get a specific users post.
router.get("/:id/posts", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const posts = await Post.findAll({
      where: {
        UserId: userId,
      },
    });

    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(404).send({ message: "No user posts found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//gets a users comments
router.get("/:id/comments", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const comments = await Comment.findAll({
      where: {
        UserId: userId,
      },
    });

    if (comments) {
      res.status(200).json(comments);
    } else {
      res.status(404).send({ message: "No user comments found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//get all chatrooms from a user.
router.get("/:id/chatrooms", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const chatrooms = await UserChatRoom.findAll({
      where: { UserId: userId },
    });
    if (chatrooms && chatrooms.length > 0) {
      res.status(200).json(chatrooms);
    } else {
      res.status(404).send({ message: "this User has no chatrooms" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
