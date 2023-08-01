"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserChatRelation extends Model {
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
  userChatRelation.init(
    {
      UserId: DataTypes.INTEGER,
      ChatroomId: DataTypes.INTEGER,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserChatRelation",
      tableName: "userchatrelations",
    }
  );
  return UserChatRelation;
};
