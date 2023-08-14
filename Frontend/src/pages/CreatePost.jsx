"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

const CreatePost = () => {
  
  const [postName, setPostName] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postRoom, setPostRoom] = useState("");
  const [chatrooms, setChatrooms] = useState([]);
  const router = useRouter();

  // Fetch all available chatrooms from the server
  useEffect(() => {
    fetch("/api/chatrooms")
      .then((response) => response.json())
      .then((data) => {
        setChatrooms(data);
      })
      .catch((error) => {
        console.error("Error fetching chatrooms:", error);
      });
  }, []);

  const handleNewPost = async (e) => {
    e.preventDefault();
    
    const selectedChatroom = chatrooms.find(
      (chatroom) => chatroom.chatroomName === postRoom
    );

    if (!selectedChatroom) {
      console.error("Selected chatroom does not exist.");
      return;
    }

    const postData = {
      title: postName,
      content: postDescription,
      chatroomId: selectedChatroom.id,
    };

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to create post.");
        return;
      }

      console.log("Post created successfully!");
      router.push("/");
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <ProtectedRoute>
    <div className="flex justify-center items-center h-1/2">
      <form
        onSubmit={handleNewPost}
        method="post"
        className="bg-[#DDE6ED] p-8 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-md shadow-md my-6"
      >
        <h1 className="text-2xl font-bold mb-4 mt-3 text-center">
          New Post
        </h1>
        <div className="mb-4">
          <input
            className="w-full px-3 py-2 border rounded bg-white"
            type="text"
            id="postName"
            placeholder="Title:"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <textarea
            className="w-full px-3 py-2 border rounded bg-white"
            id="postDescription"
            rows="4"
            placeholder="Description:"
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <select
            className="w-full px-3 py-2 border rounded bg-white"
            id="postRoom"
            value={postRoom}
            onChange={(e) => setPostRoom(e.target.value)}
          >
            <option value="" disabled>
              Select a ChitChat Room
            </option>
            {chatrooms.map((chatroom) => (
              <option key={chatroom.id} value={chatroom.chatroomName}>
                {chatroom.chatroomName}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-[#DDE6ED] p-4">
          <button
            className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded w-full"
            type="submit"
          >
            Submit Post
          </button>
        </div>
      </form>
    </div>
  </ProtectedRoute>
  
  );
};

export default CreatePost;
