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
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      CommentableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      commentableType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["post", "comment"]],
        },
      },
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
      likesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
      cacheColumns: (models) => [
        {
          model: "Comment",
          column: "likesCount",
          foreignKey: "commentId",
          where: {
            likeableType: "comment",
          },
        },
      ],
    }
  );
  return Comment;
};
