"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserChatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "UserId" });
      this.belongsTo(models.Chatroom, { foreignKey: "ChatroomId" });
    }
  }
  UserChatRoom.init(
    {
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
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserChatRoom",
      tableName: "userchatrooms",
    }
  );
  return UserChatRoom;
};
