"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "author", //alias for User model
      });

      this.hasMany(models.Comment, {
        foreignKey: "postId",
        as: "comments",
      });

      this.hasMany(models.Likes, {
        foreignKey: "likeableId",
        scope: {
          likeableType: "post",
        },
        as: "likes",
      });
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 50],
            msg: "Your title must be between 3 and 50 characters",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [3, 500],
            msg: "Your content must be between 3 and 500 characters",
          },
        },
      },
      likesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      image_URL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      ChatroomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "chatrooms",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      cacheColumns: (models) => [
        {
          model: "Post",
          column: "likesCount",
          foreignKey: "postId",
          where: {
            likeableType: "post",
          },
        },
      ],
    }
  );
  return Post;
};
