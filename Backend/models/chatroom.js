"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.UserChatRoom, { foreignKey: "ChatroomId" });
      this.belongsToMany(models.User, {
        through: models.UserChatRoom,
        foreignKey: "ChatroomId",
      });
    }
  }
  Chatroom.init(
    {
      chatroomName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 30],
            msg: "The chatroom must be between 1 and 30 characters",
          },
        },
      },
      chatroomDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 150],
            msg: "The chatroom description must be between 8 and 150 characters",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Chatroom",
      tableName: "chatrooms",
    }
  );
  return Chatroom;
};
