const express = require("express");
const router = express.Router();
const { Chatroom } = require("../models");
const { authenticateUser } = require("../middleware/auth");

// CRUD for Chatroom

//get a list of all chatrooms
router.get("/", async (req, res) => {
    try {
      const allChatrooms = await Chatroom.findAll();
      res.status(200).json(allChatrooms);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  });

// get a chatroom by id
router.get("/:id", async (req, res) => {

  const chatroomId = parseInt(req.params.id, 10);

  try {
    const chatroom = await Chatroom.findOne({where: {id: chatroomId}});

    if (chatroom) {
      res.status(200).json(chatroom);
    } else {
      res.status(404).send({message: 'Chatroom not found'});
    }
  } catch (err) {
    console.error(err);
      res.status(500).send({ message: err.message });
  }
});

// create a new chatroom
router.post("/", async(req,res)=>{
  try {
    const newChatroom = await Chatroom.create(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).send({message:err.message});
  }
});


// update a chatroom by id
router.patch("/:id", async(req, res)=>{
  const chatroomId = parseInt(req.params.id,10);
  try {
    const[numberOfAffectedRows, affectedRows] = await Chatroom.update(req.body,{where: {id: chatroomId},returning:true});
    if (numberOfAffectedRows > 0) {
      res.status(200).json(affectedRows[0]);
  }
  else{
      res.status(404).json({message:"post not found"});
  }
  } catch (err) {
    console.log(err);
    res.status(500).json({message:err.message});
  }
});

// Delete a chatroom by ID.
router.delete("/:id", async (req,res)=>{
  const chatroomId = parseInt(req.params.id, 10);
  try {
    const deleteChatroom = await Chatroom.destroy({where: {id:chatroomId}});

    if(deleteChatroom>0){
      res.status(200).send({message: "Chatroom deleted successfully"});
    }else{
      res.status(404).send({message: "Chatroom not found"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message:err.message});
  }
});


module.exports = router;