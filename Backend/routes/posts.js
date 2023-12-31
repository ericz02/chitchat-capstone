const express = require("express");
const router = express.Router();
const { User, Post, Comment, Likes } = require("../models");
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

  const authorizeCommentDelete = (session, comment) => {
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
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(allPosts);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });

  //get all posts from a specific chatroom
  router.get("/:id/chatroomPosts", async (req, res) => {
    const chatroomId = parseInt(req.params.id, 10);

    try {
      const chatroomPosts = await Post.findAll({
        where: {
          ChatroomId: chatroomId,
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
        order: [["createdAt", "DESC"]],
      });

      if (chatroomPosts) {
        res.status(200).json(chatroomPosts);
      } else {
        res.status(404).send({ message: "Chatroom not found" });
      }
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
        order: [[{ model: Comment, as: "comments" }, "updatedAt", "DESC"]],
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

  //get chatroom id by name
  // router.post("/chatRoomId", authenticateUser, async (req, res) => {
  //     const name = req.params.chatroom;
  //   try {
  //     const newPost = await Post.create({
  //       title: req.body.title,
  //       content: req.body.content,
  //       UserId: userId,
  //       ChatroomId: req.body.chatroomId,
  //     });

  //     res.status(201).json(newPost);
  //   } catch (err) {
  //     handleErrors(err, res);
  //   }
  // });

  // get likes
  // Server-side route to get the likes for a post
  router.get("/:id/like", async (req, res) => {
    //console.log("get likes");
    try {
      const postId = req.params.id;
      const userId = req.query.userId;
      const commentableType = req.query.commentableType;

      const item =
        commentableType === "comment"
          ? await Comment.findByPk(postId)
          : await Post.findByPk(postId);

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      // Fetch the likes for the specified post
      const likes = await Likes.findAll({
        where: {
          likeableType: commentableType,
          likeableId: postId,
        },
      });
      const finduser = await Likes.findOne({
        where: {
          likeableType: commentableType,
          likeableId: postId,
          userId: userId,
        },
      });
      //console.log(finduser);
      //console.log(likes.length);
      if (finduser) {
        //console.log("user found");
        res.status(200).json({ isLiked: true, likesCount: likes.length });
      } else {
        res.status(200).json({ isLiked: false, likesCount: likes.length });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });
  //add likes
  router.post("/:id/like", async (req, res) => {
    //console.log("add likes");
    try {
      const itemId = req.params.id;
      const userId = req.body.userId;
      const commentableType = req.body.commentableType || "post"; // Default to "post"

      let item;
      if (commentableType === "comment") {
        item = await Comment.findByPk(itemId);
      } else {
        item = await Post.findByPk(itemId);
      }

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const likes = await Likes.findAll({
        where: {
          likeableType: commentableType,
          likeableId: itemId,
        },
      });

      const existingLike = await Likes.findOne({
        where: {
          likeableType: commentableType,
          likeableId: itemId,
          userId: userId,
        },
      });

      if (!existingLike) {
        await Likes.create({
          likeableType: commentableType,
          likeableId: itemId,
          userId: userId,
        });

        item.likesCount += 1;
        await item.save();
      }

      res.status(200).json({ likesCount: likes.length, isLiked: true });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });

  // Delete a like
  router.delete("/:id/like", async (req, res) => {
    try {
      const itemId = req.params.id;
      const userId = req.body.userId;
      const commentableType = req.body.commentableType || "post"; // Default to "post"

      let item;
      if (commentableType === "comment") {
        item = await Comment.findByPk(itemId);
      } else {
        item = await Post.findByPk(itemId);
      }

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const likes = await Likes.findAll({
        where: {
          likeableType: commentableType,
          likeableId: itemId,
        },
      });

      const existingLike = await Likes.findOne({
        where: {
          likeableType: commentableType,
          likeableId: itemId,
          userId: userId,
        },
      });

      if (existingLike) {
        await existingLike.destroy();
        item.likesCount -= 1;
        if (item.likesCount < 0) item.likesCount = 0;
        await item.save();
        return res
          .status(200)
          .json({ likesCount: likes.length, isLiked: false });
      }

      if (!existingLike) {
        return res.status(404).json({ message: "Like not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });

  //create a post
  router.post("/", authenticateUser, async (req, res) => {
    const userId = req.session.userId;
    const TITLE = req.body.title;
    const CONTENT = req.body.content;
    const CHATROOMID = req.body.chatroomId;
    try {
      const newPost = await Post.create({
        title: TITLE,
        content: CONTENT,
        UserId: userId,
        ChatroomId: parseInt(CHATROOMID),
      });

      res.status(201).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
      handleErrors(err, res);
    }
  });

  //create a new comment to a post
  router.post("/:id/comments", async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const content = req.body.content;
    const userId = req.session.userId;
    //console.log("Received new comment:", { postId, content, userId });
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

  //get a specific comment
  router.get("/:postId/comments/:commentId", async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const commentId = parseInt(req.params.commentId, 10);

    try {
      const comment = await Comment.findOne({
        where: {
          id: commentId,
          commentableType: "post",
          CommentableId: postId,
        },
      });

      res.status(200).json(comment);
    } catch (err) {
      handleErrors(err, res);
    }
  });

  //get all comments to a specific post
  router.get("/:postId/comments", async (req, res) => {
    const postId = parseInt(req.params.postId, 10);

    try {
      const comments = await Comment.findAll({
        where: {
          CommentableId: postId,
          commentableType: "post",
        },
        attributes: {
          // Include any other attributes you need
          include: ["isDeleted"],
        },
        order: [["updatedAt", "DESC"]],
      });

      if (!comments) {
        return res
          .status(404)
          .send({ message: "No comments found for this post." });
      }

      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const commentData = {
            ...comment.toJSON(),
            replies: await Comment.getAllNestedComments(comment),
          };
          return commentData;
        })
      );

      res.status(200).json(commentsWithReplies);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });

  //see all the replies to a specific comment
  router.get(
    "/:postId/comments/:commentId/replyComment/:replyId",
    async (req, res) => {
      const postId = parseInt(req.params.postId, 10);
      const commentId = parseInt(req.params.commentId, 10);
      const replyId = parseInt(req.params.replyId, 10);
      const userId = req.session.userId;

      try {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
            commentableType: "post",
            CommentableId: postId,
          },
        });

        if (comment) {
          const reply = await Comment.findOne({
            where: {
              id: replyId,
              commentableType: "comment",
            },
          });

          if (reply) {
            const nestedComments = await Comment.getAllNestedComments(reply);
            res.status(200).json({
              ...reply.toJSON(),
              replies: nestedComments,
            });
          } else {
            res.status(404).send({ message: "Reply not found" });
          }
        } else {
          res.status(404).send({ message: "Comment not found" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
      }
    }
  );

  //create a reply to a comment
  router.post("/:id/replyComments", async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const content = req.body.content;
    const userId = req.session.userId;
    console.log("Received new comment:", { postId, content, userId });
    try {
      const newComment = await Comment.create({
        content: content,
        UserId: userId,
        CommentableId: postId,
        commentableType: "comment",
      });

      res.status(201).json({
        message: "Reply created succesfully",
        comment: newComment,
      });
    } catch (err) {
      handleErrors(err, res);
    }
  });

  //update a reply to a comment
  router.patch("/:postId/replyComments/:commentId", async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const content = req.body.content;
    const userId = req.session.userId;
    try {
      const comment = await Comment.findOne({
        where: {
          id: req.params.commentId,
        },
      });
      await authorizeCommentEdit;
      const updatedComment = await comment.update(req.body);
      res.status(200).json(updatedComment);
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

      // Soft delete the post by setting isDeleted to true and updating the content and title
      await Post.update(
        { isDeleted: true, content: "Deleted", title: "Deleted" },
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
  router.delete("/comments/:commentId", authenticateUser, async (req, res) => {
    //const postId = parseInt(req.params.postId, 10);
    const commentId = parseInt(req.params.commentId, 10);
    try {
      const comment = await Comment.findOne({
        where: {
          id: commentId,
        },
      });
      await authorizeCommentDelete(req.session, comment);

      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      await comment.update({ isDeleted: true, content: "Deleted" });

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });

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
