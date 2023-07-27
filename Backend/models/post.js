"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
      image_URL: {
        type: DataTypes.BYTEA,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ChatroomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
    }
  );
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    image_URL: DataTypes.BLOB,
    UserId: DataTypes.INTEGER,
    ChatroomId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
    tableName:'posts'
  });
