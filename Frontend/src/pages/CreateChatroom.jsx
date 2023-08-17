"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

const CreateChatroom = () => {
  const authContext = useContext(AuthContext); //this is to get the current user that is creating the chatroom
  const currentUser = authContext ? authContext.currentUser : null;
  const [roomName, setChatroomName] = useState("");
  const [roomDescription, setChatroomDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, []);

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
    router.push("/chatroomPage");
  };

  return (
    // <ProtectedRoute>
    <div className="flex justify-center items-center h-1/2 m-11">
      <form
        onSubmit={handleSubmit}
        method="post"
        className="bg-[#F2F5F7] border border-1 border-gray-700 mt-[200px] p-8 w-full md:w-[480px] lg:w-[600px] xl:w-[800px] min-w-[200px] rounded-md shadow-md my-6"
      >
        <h1 className="text-center text-2xl font-bold mb-4 mt-3">
          Create Chatroom
        </h1>
        <div className="mb-4">
          <input
            className="border border-1 border-gray-700 w-full px-3 py-2 rounded bg-white"
            type="text"
            id="chatroomName"
            placeholder="Chatroom Name"
            value={roomName}
            onChange={(e) => setChatroomName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <textarea
            className="border border-1 border-gray-700 w-full px-3 py-2 rounded bg-white"
            id="chatroomDescription"
            rows="4"
            placeholder="Description"
            value={roomDescription}
            onChange={(e) => setChatroomDescription(e.target.value)}
          />
        </div>
        <div className="p-4">
          <button
            className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded w-full"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
    // </ProtectedRoute>
  );
};
export default CreateChatroom;
