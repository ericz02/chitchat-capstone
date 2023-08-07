"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../app/contexts/AuthContext";

//make it so that this route is protected people cant acces this page unless they are logged in
const CreatePost = () => {
  const {currentUser} = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!currentUser){
      console.log("You are not logged in");
      return null;
    }
    //validate to see if the chatroom exists
    var validatethis = e.target.chatroom.value;
    validatethis = {chatroomName:validatethis};
    var roomId;

    try {
      const ChatroomResponse = await fetch(`http://localhost:4000/chatrooms/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatethis),
      });
    
      if (ChatroomResponse.ok) {
        const ChatroomValid = await ChatroomResponse.json();
        console.log("response:", ChatroomValid);
    
        if (ChatroomValid.id) {
          roomId = ChatroomValid.id;
        } else {
          console.log("Invalid Chatroom");
          return null;
        }
      } else {
        console.log("Failed to validate chatroom name. Server returned status:", ChatroomResponse.status);
      }
    } catch (error) {
      console.error("Failed to validate chatroom name:", error);
    }
    
    console.log("room Id:", roomId);
   
    const postDetails = {
      title:e.target.postTitle.value,
      content:e.target.Description.value,
      chatroomId:parseInt(roomId),
    }

    console.log("this is the thing that is getting sent to the post request", JSON.stringify(postDetails));
    try {
      const response = await fetch("http://localhost:4000/posts",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postDetails),
      })
      
      if(response.ok){
        const finalResponse = await response.json();
        console.log("posted:", finalResponse);
      }else{
        console.log("Failed to post post:", response.status);
      }
      router.push("/");
      return null;
    } catch (error) {
      console.error("failed to post:", error);
    }
  };


  return (
    <div className="bg-[#FFFFFF] p-4 flex flex-col justify-center ">
      <h1 className="flex justify-center text-2xl font-bold mb-4 mt-3">
         New Post
      </h1>
      <form onSubmit={handleSubmit} className = "flex flex-col justify-center">
        <div className="mb-4 mx-auto w-3/4">
          
          <input
            className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
            type="text"
            id="postName"
            name = "postTitle"
            placeholder="Title:"
          />
        </div>
        <div className="mb-4 mx-auto w-3/4">
          <textarea
            className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
            id="postDescription"
            name="Description"
            rows="4"
            placeholder="Description:"
          />
        </div>
        <div className="mb-4 mx-auto w-3/4">
          <textarea
            className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
            id="postRoom"
            name="chatroom"
            rows="4"
            placeholder="ChitChat Room:"
          />
        </div>
        <button  className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-auto w-1/6">
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
