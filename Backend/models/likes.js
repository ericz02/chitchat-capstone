"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Post, {
        foreignKey: "likeableId",
        constraints: false,
        scope: {
          likeableType: "post",
        },
      });

      this.belongsTo(models.Comment, {
        foreignKey: "likeableId",
        constraints: false,
        scope: {
          likeableType: "comment",
        },
      });
    }
  }
  Likes.init(
    {
      likeableType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["post", "comment"]],
        },
      },
      likeableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Likes",
      tableName: "likes",
      indexes: [
        {
          unique: true,
          fields: ["likeableId", "likeableType", "userId"],
          name: "unique_likeable_user",
        },
      ],
    }
  );
  return Likes;
};
