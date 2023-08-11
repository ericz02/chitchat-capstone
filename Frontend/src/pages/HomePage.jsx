"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaCommentDots, FaThumbsUp } from "react-icons/fa";


const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from the server
    fetch("/api/posts", {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (data) => {
        // Fetch user details for each post
        const postsWithUserDetails = await Promise.all(
          data.map(async (post) => {
            const userResponse = await fetch(`/api/user/${post.UserId}`, {
              method: "GET",
            });

            // Fetch chatroom data (chatroom)
            const chatroomResponse = await fetch(
              `/api/chatrooms/${post.ChatroomId}`,
              {
                method: "GET",
              }
            );

            const chatroomData = await chatroomResponse.json();
            const userData = await userResponse.json();

            return { ...post, user: userData, chatroom: chatroomData };//spread the post itself, the user data gotten from post.userid, and the chatroom from post.chatroomId
          })
        );
        setPosts(postsWithUserDetails);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);
  //reverse the posts so that the most recent is first
  posts.reverse();
  
  return (
    
    <div className="mx-auto max-w-4xl pl-16">
      <div className="flex flex-col justify-center mb-4">
        <div className="flex flex-col items-center pr-6 mr-[70px]">
          <Link href="/create">
            <button
              className="bg-[#E6E6E6] text-black px-4 py-2 rounded-[10px] hover:bg-[#526D82] transition-colors 
              duration-300 ease-in-out mt-8"
            >
              Create Post
            </button>{" "}
          </Link>
        </div>
      </div>

      <div className="ml-[70px]">
        {posts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id}>
            <div
              key={post.id}
              className="bg-[#DDE6ED] hover:bg-[#C9D7E2] p-4 rounded-md shadow-md w-2/3 pr-5 my-6 ml-10 cursor-pointer"
            >
              <div className="font-bold text-[20px]">
                cc/{post.chatroom.chatroomName}
              </div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">{post.title}</h2>
                <p className="text-[10px]">Posted by | {post.user.userName}</p>
              </div>
              <p className="text-gray-600">{post.content}</p>
              <div className="flex items-center justify-end mt-4">
                <div className="flex items-center mr-4">
                  <FaThumbsUp className="mr-2" />
                  <p className="text-[13px]">{post.likesCount}</p>
                </div>
                <div className="flex items-center">
                  <FaCommentDots className="mr-2" />
                  <p className="text-[13px]">{post.commentsCount}</p>
                </div>
              </div>
            </div>
          </Link>
          
        ))}
      </div>
    </div>
  );
};

export default HomePage;
