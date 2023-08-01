"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "author",
      });

      this.belongsTo(models.Post, {
        foreignKey: "CommentableId",
        constraints: false,
        scope: {
          commentableType: "post",
        },
        as: "post",
      });

      this.hasMany(models.Comment, {
        foreignKey: "CommentableId",
        constraints: false,
        scope: {
          commentableType: "comment",
        },
        as: "replies",
      });

      this.hasMany(models.Likes, {
        foreignKey: "likeableId",
        scope: {
          likeableType: "comment",
        },
        as: "likes",
      });
    }
  }
  Comment.init(
    {
      UserId: DataTypes.INTEGER,
      CommentableId: DataTypes.INTEGER,
      commentableType: DataTypes.STRING,
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [3, 500],
            msg: "Your comment must be between 3 and 500 characters",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
    }
  );
  return Comment;
};
