const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models");

router.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
    });
    // req.session.userId = user.id; //for if we want to automatically login user after they have signed up.
    res.status(201).json({
      message: "User Created Successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error occurred while creating user",
      error: err,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user === null) {
      //check to see if the user is actually in the database.
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    //if the user is valid check to see if the password is valid.
    bcrypt.compare(req.body.password, user.password, (error, result) => {
      if (result) {
        req.session.userId = user.id;
        res.status(200).json({
          message: "Logged in successfully",
          user: {
            name: user.name,
            email: user.email,
          },
        });
      } else {
        res.status(401).json({ message: "Incorrect credentials" });
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occured during the login process" });
  }
});

router.delete("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.sendStatus(500);
    }
    res.clearCookie("connect.sid");
    return res.sendStatus(200);
  });
});
//////////////////////////
router.get("/check-auth", (req, res) => {
    if (req.session.userId) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });
module.exports = router;
