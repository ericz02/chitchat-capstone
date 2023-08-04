const express = require("express");
const router = express.Router();
const { User, Post, Comment } = require("../models");
const { authenticateUser } = require("../middleware/auth");

const getPost = async (id) => {
  const post = await Post.findByPk(parseInt(id, 10), { include: [Comment] });

  if (!post) {
    throw new NotFoundError("Post not found");
  }
  return post;
};

const authorizePostEdit = (session, post) => {
  if (parseInt(session.userId, 10) !== post.UserId) {
    throw new ForbiddenError("You cannot edit someone else's post");
  }
};

const authorizeCommentEdit = (session, comment) => {
  if (parseInt(session.userId, 10) !== comment.UserId) {
    throw new ForbiddenError("You cannot edit someone else's comment");
  }
};

const authorizePostDelete = (session, post) => {
  if (parseInt(session.userId, 10) !== post.UserId) {
    throw new ForbiddenError("You cannot delete someone else's post");
  }
};

const authorizeCommentDelete = (session, post) => {
  if (parseInt(session.userId, 10) !== comment.UserId) {
    throw new ForbiddenError("You cannot delete someone else's comment");
  }
};

const handleErrors = (err, res) => {
  console.error(err);
  if (err.name === "SequelizeValidationError") {
    return res.status(422).json({ errors: err.errors.map((e) => e.message) });
  }
  res.status(500).send({ message: err.message });
};

router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.findAll();

    res.status(200).json(allPosts);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
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

module.exports = router;
