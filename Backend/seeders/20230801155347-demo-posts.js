"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "Eric",
          lastName: "Zheng",
          userName: "oldman02",
          email: "eric@gmail.com",
          password: await bcrypt.hash("123", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Felix",
          lastName: "Chen",
          userName: "bigtoe",
          email: "felix@gmail.com",
          password: await bcrypt.hash("456", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Robert",
          lastName: "Ortiz",
          userName: "robcomedy",
          email: "rob@gmail.com",
          password: await bcrypt.hash("789", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Jay",
          lastName: "Chen",
          userName: "airpodmaxstuck",
          email: "jay@gmail.com",
          password: await bcrypt.hash("369", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert("chatrooms", [
      {
        chatroomName: "Cars",
        chatroomDescription: "A room where people can talk about cars",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        chatroomName: "Coffee",
        chatroomDescription:
          "A place where coffee enthusiasts can share their brews.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const users = await queryInterface.sequelize.query(`SELECT id FROM users`);

    const ericId = users[0][0].id;
    const felixId = users[0][1].id;
    const robertId = users[0][2].id;
    const jayId = users[0][3].id;

    const chatrooms = await queryInterface.sequelize.query(
      `SELECT id FROM chatrooms`
    );

    const carRoomId = chatrooms[0][0].id;
    const coffeeRoomId = chatrooms[0][1].id;

    await queryInterface.bulkInsert("posts", [
      {
        title: "Why are cars so expensive?",
        content:
          "I'm so tired of car prices these days. Searching for a car is like looking for my soul",
        UserId: ericId,
        ChatroomId: carRoomId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Dunkin Donuts coffee is not bad.",
        content:
          "Dunkin Donuts coffee recently has gotten better. They used to use too much sugar but now they make it pretty perfectly. As far as Dunkin goes.",
        UserId: robertId,
        ChatroomId: coffeeRoomId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("comments", [
      {
        UserId: felixId,
        CommentableId: 1,
        commentableType: "post",
        content:
          "Very true. It took forever to find a car I wanted and the prices are insane. I had to sell my kidney!",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: ericId,
        CommentableId: 1,
        commentableType: "comment",
        content: "At least you found the car you wanted and got it :)",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: jayId,
        CommentableId: 2,
        commentableType: "post",
        content: "Wow I've never tried it, I should give a try some day",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: robertId,
        CommentableId: 2,
        commentableType: "comment",
        content: "Yeah, you should try it out sometime when you can",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("userchatrooms", [
      {
        UserId: 1,
        ChatroomId: 1,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 3,
        ChatroomId: 2,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("userchatrooms", null, {});
    await queryInterface.bulkDelete("comments", null, {});
    await queryInterface.bulkDelete("posts", null, {});
    await queryInterface.bulkDelete("chatrooms", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
