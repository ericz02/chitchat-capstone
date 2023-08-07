const express = require("express");
const router = express.Router();
const { User, Post, Comment } = require("../models");
const { ForbiddenError, NotFoundError } = require("../middleware/errorHandler");
const { authenticateUser } = require("../middleware/auth");

module.exports = (db) => {
  const getPost = async (id) => {
    const post = await Post.findByPk(parseInt(id, 10));

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

    if (!err) {
      console.error("Error object is undefined or null.");
      return res.status(500).send({ message: "Internal Server Error" });
    }

    console.log("Error name:", err.name);
    console.log("Error message:", err.message);

    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }

    res.status(500).send({ message: err.message });
  };

  //get all posts
  /* router.get("/", async (req, res) => {
    try {
      const allPosts = await Post.findAll();
      const postsWithCommentsCount = allPosts.map((post) => {
        const postJSON = post.toJSON();
        postJSON.commentsCount = post.commentsCount; // Include commentsCount in the response
        return postJSON;
      });
      res.status(200).json(postsWithCommentsCount);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  }); */

  // posts.js
  router.get("/", async (req, res) => {
    try {
      const allPosts = await Post.findAll({
        where: {
          isDeleted: false,
        },
        attributes: {
          include: [
            [
              db.sequelize.literal(
                '(SELECT COUNT(*) FROM "likes" WHERE "likes"."likeableId" = "Post"."id" AND "likes"."likeableType" = \'post\')'
              ),
              "likesCount",
            ],
            [
              db.sequelize.literal(
                '(SELECT COUNT(*) FROM "comments" WHERE "comments"."CommentableId" = "Post"."id" AND "comments"."commentableType" = \'post\')'
              ),
              "commentsCount",
            ],
          ],
        },
      });
      res.status(200).json(allPosts);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });

  //get all posts with commentCount
  /*   router.get("/", async (req, res) => {
    try {
      const allPosts = await Post.findAll({
        where: {
          isDeleted: false,
        },
      });
      const postsWithCommentsCount = await Promise.all(
        allPosts.map(async (post) => {
          const commentsCount = await Comment.count({
            where: {
              CommentableId: post.id,
              commentableType: "post",
            },
          });

          return { ...post.toJSON(), commentsCount };
        })
      );

      res.status(200).json(postsWithCommentsCount);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  }); */

  //get a specific post
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

  //create a post
  router.post("/", authenticateUser, async (req, res) => {
    const userId = req.session.userId;

    try {
      const newPost = await Post.create({
        title: req.body.title,
        content: req.body.content,
        UserId: userId,
        ChatroomId: req.body.chatroomId,
      });

      res.status(201).json(newPost);
    } catch (err) {
      handleErrors(err, res);
    }
  });

  //create a new comment to a post
  router.post("/:id/comments", async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const content = req.body.content;
    const userId = req.session.userId;
    console.log("Received new comment:", { postId, content, userId });
    try {
      const newComment = await Comment.create({
        content: content,
        UserId: userId,
        CommentableId: postId,
        commentableType: "post",
      });

      res.status(201).json({
        message: "Comment created succesfully",
        comment: newComment,
      });
    } catch (err) {
      handleErrors(err, res);
    }
  });

  //update a specific post
  router.patch("/:id", authenticateUser, async (req, res) => {
    try {
      const post = await getPost(req.params.id);
      await authorizePostEdit(req.session, post);
      const updatedPost = await post.update(req.body);
      res.status(200).json(updatedPost);
    } catch (err) {
      handleErrors(err, res);
    }
  });

  //update a specific comment to a post
  router.patch(
    "/:postId/comments/:commentId",
    authenticateUser,
    async (req, res) => {
      try {
        const comment = await Comment.findOne({
          where: {
            id: req.params.commentId,
          },
        });
        await authorizeCommentEdit;
        const updatedComment = await comment.update(req.body);
      } catch (err) {
        handleErrors(err, res);
      }
    }
  );

  //Soft delete a specific post
  router.delete("/:id", authenticateUser, async (req, res) => {
    try {
      const post = await getPost(req.params.id);
      await authorizePostDelete(req.session, post);

      await Post.update(
        { isDeleted: true },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.status(200).send({ message: "Post deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });

  //Soft delete a comment
  router.delete(
    "/:postId/comments/:commentId",
    authenticateUser,
    async (req, res) => {
      const postId = parseInt(req.params.postId, 10);
      const commentId = parseInt(req.params.commentId, 10);
      try {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
            CommentableId: postId,
            commentableType: "post",
          },
        });
        await authorizeCommentDelete(req.session, comment);

        if (!comment) {
          return res.status(404).send({ message: "Comment not found" });
        }

        await comment.update({ isDeleted: true });

        res.status(200).json({ message: "Comment deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
      }
    }
  );

  router.delete(
    "/:postId/comments/:commentId/replies/:replyId",
    authenticateUser,
    async (req, res) => {
      //const postId = parseInt(req.params.postId, 10);
      const commentId = parseInt(req.params.commentId, 10);
      const replyId = parseInt(req.params.replyId, 10);

      try {
        const replyComment = await Comment.findOne({
          where: {
            id: replyId,
            CommentableId: commentId,
            commentableType: "comment",
          },
        });
        await authorizeCommentDelete(req.session, replyComment);

        if (!replyComment) {
          return res.status(404).json({ message: "Reply comment not found" });
        }

        await replyComment.update({ isDeleted: true });

        res.status(200).json({ message: "Reply comment deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
      }
    }
  );

  return router;
};
