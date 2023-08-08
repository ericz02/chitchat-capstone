const express = require("express");
const router = express.Router();
const { Chatroom, Post, UserChatRoom } = require("../models");
const { authenticateUser } = require("../middleware/auth");

// functions to ensure users only update or delete their own chatrooms. depending on userChatroom role.
const authroizeEdit = (session, chatroom) => {
  /*add logic*/
};
const authorizeDelete = (session, chatroom) => {
  /*add logic*/
};
// CRUD for Chatroom

router.post("/validate", async (req, res) => {
  try {
    const ChatRoomName = req.body.chatroomName;
    const chatroom = await Chatroom.findOne({where:{chatroomName:ChatRoomName}});
    if(chatroom){
      res.status(200).json(chatroom);
    }else{
      res.status(404).json(null);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message});
  }
});



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
    const chatroom = await Chatroom.findOne({ where: { id: chatroomId } });

    if (chatroom) {
      res.status(200).json(chatroom);
    } else {
      res.status(404).send({ message: "Chatroom not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//get all chatroom posts
router.get("/:id/posts", async (req, res) => {
  const chatroomId = parseInt(req.params.id, 10);

  try {
    const chatroomPosts = await Post.findAll({
      where: {
        ChatroomId: chatroomId,
      },
    });

    if (chatroomPosts) {
      res.status(200).json(chatroomPosts);
    } else {
      res.status(404).send({ message: "Chatroom not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// create a new chatroom
router.post("/", authenticateUser, async (req, res) => {
  try {
    const newChatroom = await Chatroom.create(req.body);
    res.status(201).json(newChatroom);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

// update a chatroom by id
router.patch("/:id", authenticateUser, async (req, res) => {
  const chatroomId = parseInt(req.params.id, 10);
  try {
    const [numberOfAffectedRows, affectedRows] = await Chatroom.update(
      req.body,
      { where: { id: chatroomId }, returning: true }
    );
    if (numberOfAffectedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res.status(404).json({ message: "post not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a chatroom by ID.
router.delete("/:id", authenticateUser, async (req, res) => {
  const chatroomId = parseInt(req.params.id, 10);
  try {
    const deleteChatroom = await Chatroom.destroy({
      where: { id: chatroomId },
    });

    if (deleteChatroom > 0) {
      res.status(200).send({ message: "Chatroom deleted successfully" });
    } else {
      res.status(404).send({ message: "Chatroom not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//get all the users in a chatroom
router.get("/:id/users", async(req,res) =>{
  const chatroomId = parseInt(req.params.id, 10);
  try {
    const users = await UserChatRoom.findAll({
      where: { ChatroomId: chatroomId}
    });

    if(users&&users.length>0){
      res.status(200).json(users);
    }
    else{
      res.status(404).send({message:"this chatroom has no users or does not exist"});
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//add a creator of a chatroom as admin and the chatroom into the user-chatroom relation.
router.post("/:id/addCreator/:userId", async (req,res)=>{
  const chatroomId = parseInt(req.params.id,10);
  const userId = parseInt(req.params.userId,10);
  try{
    const addCreator = await UserChatRoom.create({
      UserId:userId,
      ChatroomId:chatroomId,
      role:"admin"
    });
    res.status(201).json(addCreator);

  }catch (err){
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//add a user to a chatroom
router.post("/:id/addUser/",authenticateUser, async(req,res) =>{
  //the chatroom to add the user to and the user itself
  const chatroomId = parseInt(req.params.id,10);
  const userId = req.session.userId;
  try {
    const addedUser = await UserChatRoom.create({UserId: userId, ChatroomId:chatroomId, role:"member"});
    res.status(201).json(addedUser);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }

});
//check if the user is a member of a chatroom
router.get('/isMemberOf/:id',authenticateUser, async(req,res) =>{
  const userId = req.session.userId;
  const chatroom = parseInt(req.params.id,10);
  try{
    const response = await UserChatRoom.findOne({where:{UserId:userId, ChatroomId:chatroom}});
    if(response){
      res.status(200).json({there:true, role:response.role});
    }
    else{
      res.status(200).json({there:false});
    }
  }catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//remove a user from a chatroom
router.delete("/:id/removeUser/:userId", async (req,res) =>{
  //the chatroom to remove the user from and the user itself
  const chatroomId = parseInt(req.params.id,10);
  const userId = parseInt(req.params.userId,10);
  try{
    const deletedUser = await UserChatRoom.destroy({
      where:{UserId:userId, ChatroomId:chatroomId}
    });
    if(deletedUser>0){
      res.status(200).send({message: "user Removed Successfully"});
    }
    else{
      res.status(404).send({message:"chatroom or user not found."});
    }
    
  }catch(err){
    console.log(err);
    res.status(500).json({ message: err.message });
  }

});

module.exports = router;
