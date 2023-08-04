"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "profilePicture", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7aYKpm6-eaTSFFUBagnmL23fzGsu4j3H7ag&usqp=CAU",
    });
    await queryInterface.addColumn("users", "aboutMe", {
      type: Sequelize.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Your about me must be less than 500 characters",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "profilePicture");
    await queryInterface.removeColumn("users", "aboutMe");
  },
};
