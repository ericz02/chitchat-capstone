"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";


const CreatePost = () => {
  const { currentUser } = useContext(AuthContext);
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
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-[#FFFFFF] p-4 flex flex-col justify-center ">
        <h1 className="flex justify-center text-2xl font-bold mb-4 mt-3">
          New Post
        </h1>
        <form onSubmit={handleNewPost} method="post">
          <div className="mb-4 mx-auto w-3/4">
            <input
              className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
              type="text"
              id="postName"
              placeholder="Title:"
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
            />
          </div>
          <div className="mb-4 mx-auto w-3/4">
            <textarea
              className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
              id="postDescription"
              rows="4"
              placeholder="Description:"
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
            />
          </div>
          <div className="mb-4 mx-auto w-3/4">
            <select
              className="w-full px-3 pb-10 pt-2 border rounded bg-[#E6E6E6] mt-3"
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
          <div className="bg-[#FFFFFF] p-4 flex flex-col justify-center ">
            <button
              className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white justify-center font-bold py-2 px-4 rounded mx-auto w-1/6"
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

