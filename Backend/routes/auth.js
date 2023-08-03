const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models");

router.post("/signup", async (req,res)=> {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try{
        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User Created Successfully",
            user:{
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
            }
        });
    }
    catch(err){
        

    }
});

router.post("/login", async (req,res)=> {});

router.delete("/logout", async (req,res)=> {});

module.exports = router;
