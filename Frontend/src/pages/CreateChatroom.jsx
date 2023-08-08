"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";


const CreateChatroom = () => {
  const { currentUser } = useContext(AuthContext); //this is to get the current user that is creating the chatroom
  const [roomName, setChatroomName] = useState("");
  const [roomDescription, setChatroomDescription] = useState("");
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    const chatroomData = {
      chatroomName: roomName,
      chatroomDescription: roomDescription,
    };
    var chatroomid = null;
    //create the chatroom in the database
    try {
      const response = await fetch("/api/chatrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatroomData),
        credentials: "include",
      });
      if (!response.ok) {
        console.error("failed to create chatroom!");
        return;
      }
      const parsedResponse = await response.json();
      chatroomid = parsedResponse.id;
      console.log("chatroom created successfully!");

    } catch (error) {
      console.error("Error creating post:", error);
    }

    //add the creator of the chatroom as an admin in the userchatroom relation
    try {
      const response = await fetch(
        `/api/chatrooms/${chatroomid}/addCreator/${currentUser.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.error("failed to create chatroom!");
        return;
      }
      console.log("creator is added as admin");
    } catch (error) {
      console.error("Error adding creator as admin:", error);
    }
    window.location.href = "/";
  };

    return(
        <ProtectedRoute>
            <div className = "flex flex-col justify-center p-5 ">
                <h1 className="flex justify-center text-2xl font-bold mb-4 mt-3">
                    Create Chatroom
                </h1>
                <form onSubmit = {handleSubmit}>
                    <div className="mb-4 mx-auto w-3/4">
                        <input
                        className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
                        type="text"
                        id="chatroomName"
                        placeholder="Chatroom Name:"
                        value = {roomName}
                        onChange = {(e)=> setChatroomName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 mx-auto w-3/4">
                        <textarea
                        className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
                        id="postDescription"
                        rows="4"
                        placeholder="Description:"
                        value = {roomDescription}
                        onChange = {(e)=>setChatroomDescription(e.target.value)}
                        />
                    </div>
                    <div className="bg-[#FFFFFF] p-4 flex flex-col justify-center ">
                        <button
                        className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white justify-center font-bold py-2 px-4 rounded mx-auto w-1/6"
                        type="submit"
                        >
                        Create
                        </button>
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    );
}
export default CreateChatroom;
