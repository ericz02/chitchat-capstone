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
    //validatethis = {chatroomName:validatethis};
    var roomId;
    try {
      const ChatroomValid = await fetch(`http://localhost:4000/chatrooms/validate/${validatethis}`,{
             method:"GET",
             headers: {
             "Content-Type": "application/json",
            }});

      console.log(ChatroomValid.ChatroomId);
        if(ChatroomValid.ChatroomId){
           roomId = ChatroomValid.ChatroomId;
        }
        else{
          console.log("invalid Chatroom");
          return null;
        }
    } catch (error) {
      console.error("failed to validate chatroom name:", error);
    }

    // try {
    //   const ChatroomValid = await fetch(`http://localhost:4000/chatrooms/valid`,{
    //     method:"GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(validatethis),
    //   });
    //     if(ChatroomValid.ChatroomId){
    //        roomId = ChatroomValid.ChatroomId;
    //     }
    //     else{
    //       console.log("invalid Chatroom");
    //       return null;
    //     }
    // } catch (error) {
    //   console.error("failed to validate chatroom name:", error);
    // }
  
   
    const postDetails = {
      title:e.target.postTitle.value,
      content:e.target.Description.value,
      chatroomId:roomId,
    }

    console.log("this is the thing that is getting sent to the post request", postDetails);
    try {
      const response = await fetch("http://localhost:4000/posts",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postDetails),
      })
      if(response){
        console.log(response);
      }else{
        console.log("failed to post the post");
      }
      router.push("/");
      return null;
    } catch (error) {
      console.error("failed to post:", error);
    }
    console.log(e.target.postTitle.value);
    console.log(e.target.Description.value);
    console.log(e.target.chatroom.value);
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
