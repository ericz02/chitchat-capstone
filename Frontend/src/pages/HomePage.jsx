"use client";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { FaCommentDots, FaThumbsUp } from "react-icons/fa";
import LikeButton from "@/components/LikeButton";
import { AuthContext } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const authContext = useContext(AuthContext); //this is to get the current user that is creating the chatroom
  //const currentUser = authContext ? authContext.currentUser : null;
  const router = useRouter();

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

            return { ...post, user: userData, chatroom: chatroomData }; //spread the post itself, the user data gotten from post.userid, and the chatroom from post.chatroomId
          })
        );
        setPosts(postsWithUserDetails);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString(); // Format the timestamp to display only the date
  };

  return (
    <div className="w-full flex flex-col ">
      <div className="flex flex-col justify-center mb-4 ">
        <div className="flex flex-col items-center">
          <Link href="/create">
            <button
              className="bg-white text-black px-4 py-2 rounded-[10px] hover:bg-teal-200 transition-colors 
              duration-300 ease-in-out mt-14 border-black border-2"
            >
              Create Post
            </button>{" "}
          </Link>
        </div>
      </div>

      <div className="flex-col ">
        {posts.map((post) => (
          <div className=" flex justify-center my-6">
            <div
              key={post.id}
              className="bg-zinc-100 rounded-md shadow-md cursor-pointer relative border-gray-700 border-2 w-2/3 p-4 hover:scale-105 hover:ease-in duration-100"
              // py-11 px-6 w-2/3 pr-5 my-6 ml-10
            >
              <div className="font-bold text-[20px] ">
                cc/{post.chatroom.chatroomName}
                <p className="text-[10px] font-light">
                  Posted by | {post.user.userName}
                </p>
                <p className="text-[10px] font-light">
                  {formatDate(post.createdAt)}
                </p>
              </div>
              <Link href={`/post/${post.id}`}>
                <div className="bg-cyan-50 p-3 m-2 rounded-md border border-gray-700">
                  <div className="flex justify-between items-center mb-4 ">
                    <h2 className="text-xl">{post.title}</h2>
                  </div>
                  <p className="text-gray-600">{post.content}</p>
                </div>
              </Link>
              <div className="absolute top-2 right-2 flex items-center justify-end mt-4">
                <div>
                  <LikeButton
                    postId={post.id}
                    userId={post.UserId}
                    commentableType="post"
                  />
                </div>
                <Link href={`/post/${post.id}`}>
                  <div className="flex items-center ml-4">
                    <FaCommentDots className="mr-2" />
                    <p className="text-[13px]">{post.commentsCount}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
//className="absolute top-2 right-2 flex items-center justify-end mt-4"
