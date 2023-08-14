const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { User, Chatroom, Post } = require("../models"); // Import your Sequelize models

router.get("/", async (req, res) => {
  try {
    const query = req.query.q; // The search query from the client
    if (!query || typeof query !== "string" || query.length > 100) {
      return res.status(400).json({ message: "Invalid search query" });
    }
    const limit = parseInt(req.query.limit) || 10; // Pagination
    const sortBy = req.query.sortBy || "createdAt"; // Sorting

    const users = await User.findAll({
      where: {
        userName: {
          [Op.iLike]: `%${query}%`, // Case-insensitive search
        },
      },
      limit,
      order: [[sortBy, "DESC"]],
    });

    const chatrooms = await Chatroom.findAll({
      where: {
        chatroomName: {
          [Op.iLike]: `%${query}%`, // Case-insensitive search
        },

      },
      limit,
      order: [[sortBy, "DESC"]],
    });

    const posts = await Post.findAll({
      where: {
        userName: {
          [Op.iLike]: `%${query}%`,
        },
        isDeleted: false,
      },

      where: {
        title: {
          [Op.iLike]: `%${query}%`,
        },
        isDeleted: false,
      },
      limit,
      order: [[sortBy, "DESC"]],
    });

    let userPosts = [];
    if (users.length > 0) {
      const userPromises = users.map(async (user) => {
        const userPosts = await Post.findAll({
          where: {
            UserId: user.id,
            isDeleted: false,
          },
          limit,
          order: [[sortBy, "DESC"]],
        });
        return userPosts;
      });

      userPosts = await Promise.all(userPromises);
      userPosts = userPosts.flat(); // Flatten the array of arrays
    }

    const results = {
      users: users,
      chatrooms: chatrooms,
      posts: posts,
      userPosts: userPosts,
    };

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
