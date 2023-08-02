"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("likes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      likeableType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      likeableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    //Recommended index for faster querying
    await queryInterface.addIndex("likes", ["likeableType", "likeableId"]);
    await queryInterface.addIndex("likes", ["userId"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("likes");
  },
};
