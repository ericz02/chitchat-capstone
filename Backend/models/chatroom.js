'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  chatroom.init({
    chatroomName: DataTypes.STRING,
    chatroomDescription: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'chatroom',
    tableName:'chatrooms'
  });
  return chatroom;
};