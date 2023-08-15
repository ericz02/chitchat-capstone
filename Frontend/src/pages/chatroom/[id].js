"use client";
import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { FaUserCircle, FaCommentDots, FaThumbsUp } from "react-icons/fa";
import Link from "next/link";
import dynamic from "next/dynamic"; //solution for the hydration error.
import LikeButton from "@/components/LikeButton";
import CreatePost from "../CreatePost";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContext } from "@/app/contexts/AuthContext";

const ViewChatRoom = () => {
  const router = useRouter();
  const { id } = router.query; // This will get the chatroom ID from the URL
  const [posts, setPosts] = useState([]);
  const [chatroom, setChatroom] = useState({});
  const [info, setInfo] = useState({ name: "", description: "" }); //this object contains {name, description, length}
  const [postLength, setPostLength] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [role, setRole] = useState(null);
  const [joining, setJoining] = useState(false); //purpose of this boolean is everythime a user leaves or joins a room they will rerender the page to show either the leave or join button
  const [warning, setWarning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [postData, setPostData] = useState({
    postName: "",
    postDescription: "",
  });
  const [createPostWarning, setCreatePostWarning] = useState(false);
  //this function is for when an admin tries to leave their chatroom. this will remove the user from the chatroom and also delete the chatroom.

  const adminLeave = async () => {
    try {
      const leaveResponse = await fetch(`/api/chatrooms/${id}/removeUser`, {
        method: "DELETE",
        credentials: "include",
      });
      const deleteResponse = await fetch(`/api/chatrooms/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!leaveResponse.ok && !deleteResponse.ok) {
        console.log("failed to leave a chatroom!");
        router.push("/login");
        return;
      }
      console.log("Admin successfully left ");
      router.push("/");
      return;
    } catch (error) {
      console.error("Error joining:", error);
    }
  };

  const handleDeleteChatroom = async () => {
    try {
      const response = await fetch(`/api/chatrooms/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        console.log("failed to delete chatroom");
      }
      console.log("successfully deleted chatroom");
      router.push("/");
      return;
    } catch (error) {
      console.error("Error joining:", error);
    }
  };

  const handleJoin = async () => {
    try {
      const response = await fetch(`/api/chatrooms/${id}/addUser`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        console.log("failed to join chatroom!");
        router.push("/login");
        return;
      }
      console.log("joined successfully!");
      setJoining(true);
    } catch (error) {
      console.error("Error joining:", error);
    }
  };

  const handleLeave = async () => {
    try {
      const response = await fetch(`/api/chatrooms/${id}/removeUser`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        console.log("failed to leave a chatroom!");
        router.push("/login");
        return;
      }
      console.log("successfully left chatroom");
      setJoining(true);
    } catch (error) {
      console.error("Error joining:", error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString(); // Format the timestamp to display only the date
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    //reset the state to check if the user is a member or not.
    setCreatePostWarning(false);
    //prep the data to post
    if (!isMember && role === null) {
      console.log("you are either not a member or not logged in!");
      setCreatePostWarning(true);
      setShowForm(false);
      return;
    }
    const data = {
      title: postData.postName,
      content: postData.postDescription,
      chatroomId: id,
    };
    console.log(" send this data to the post request: ", postData);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Failed to create post.");
        return;
      }
      console.log("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
    }
    setShowForm(false);
    //clear the form data
    setPostData({ postName: "", postDescription: "" });
  };

  //check if the logged in user is a member of this chatroom
  useEffect(() => {
    const checkMembership = async () => {
      try {
        const response = await fetch(`/api/chatrooms/isMemberOf/${id}`, {
          method: "GET",
        });
        const data = await response.json();
        if (data.there) {
          console.log("is there reqeuse MADEEE");
          setIsMember(true);
          setRole(data.role);
        } else {
          setIsMember(false);
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };
    if (id) {
      checkMembership();
      setJoining(false); //reset the boolean so that when the user joins another room it will rerender the page to say that they are a member
    }
  }, [id, joining]);

  console.log("joined: ", isMember, "role: ", role, "id: ", id);

  //fetch all posts from this chatroom
  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}/chatroomPosts`, { method: "GET" })
        .then((response) => response.json())
        .then(async (data) => {
          setPostLength(data.length);
          //fetch user data so that the posts state will contain posts and user who created
          const postsWithUserDetails = await Promise.all(
            data.map(async (post) => {
              //get user information
              const userResponse = await fetch(`/api/user/${post.UserId}`, {
                method: "GET",
              });
              const userData = await userResponse.json();

              return { ...post, user: userData }; //spread the post itself, the user data gotten from post.userid, and the chatroom from post.chatroomId
            })
          );
          setPosts(postsWithUserDetails);
        })
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id, showForm]);

  //fetch information about this chatroom
  useEffect(() => {
    if (id) {
      fetch(`/api/chatrooms/${id}`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          setChatroom(data);
          setInfo({
            name: data.chatroomName,
            description: data.chatroomDescription,
          });
        })
        .catch((error) => console.error("Error fetching chatroom:", error));
    }
  }, [id]);

  console.log("here are all the posts in this chatroom: ", posts);
  console.log("this chatrooms information:", chatroom);
  console.log("info: ", info, " length: ", postLength);

  return (
    <>
      <RootLayout>
        <div className="bg-slate-50  border-black border-2 m-10 rounded-md shadow-md w-4/5 flex-row self-center p-2">
          <div className=" p-4 flex flex-col justify-items-center">
            {role === "admin" && isMember ? (
              <div className="flex justify-end">
                {/*set it to if ismember and role = admin then put this button.*/}
                <button
                  className="bg-red-100 border border-gray-900 border-2	text-black  rounded-[10px] hover:bg-red-500 transition-colors 
                    duration-300 ease-in-out px-4 py-2  w-1/6 text-xs "
                  onClick={handleDeleteChatroom}
                >
                  Delete Chatroom
                </button>
              </div>
            ) : (
              <></>
            )}

            <h1 className="flex justify-center text-5xl py-2"> {info.name} </h1>
            <div className="flex justify-center text-sm py-2">
              Created on: {formatDate(chatroom.createdAt)}
            </div>

            {isMember ? (
              <div>
                <div className="flex justify-center">
                  <button
                    className="bg-red-100	text-black px-4 py-2 mx-1 mb-2 mt-1 rounded-[10px] hover:bg-red-500 transition-colors 
                      duration-300 ease-in-out border-black border-2"
                    onClick={
                      role === "admin"
                        ? () => {
                            setWarning(true);
                          }
                        : handleLeave
                    }
                  >
                    Leave
                  </button>
                </div>{" "}
                {console.log("warning:", warning)}
                {warning ? (
                  <div className="flex justify-center ">
                    <div className="text-xs flex-col border-black border-1 bg-red-200	p-4 rounded-[20px]">
                      <p className="mb-2">
                        You are the ADMIN if you leave this room will be
                        deleted. Are you sure you want to leave?{" "}
                      </p>
                      <div className="flex justify-center">
                        <button
                          className="bg-red-100		 text-black px-4 py-2 mx-1 mb-4 rounded-[10px] hover:bg-red-500 transition-colors 
                        duration-300 ease-in-out border-black border-2"
                          onClick={adminLeave}
                        >
                          Yes
                        </button>
                        <button
                          className="bg-red-100		 text-black px-4 py-2 mx-1 mb-4 rounded-[10px] hover:bg-red-500 transition-colors 
                        duration-300 ease-in-out border-black border-2"
                          onClick={() => {
                            setWarning(false);
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  className="bg-green-100		 text-black px-4 py-2 mx-1 mb-4 rounded-[10px] hover:bg-green-500 transition-colors 
                duration-300 ease-in-out border-black border-2"
                  onClick={handleJoin}
                >
                  Join
                </button>
              </div>
            )}
            {isMember ? (
              <div className="flex justify-center mb-2">
                <p className="font-mono">You are a {role}.</p>
              </div>
            ) : (
              <></>
            )}
            <div className="flex justify-center	">
              <h2 className="border-black border-2 p-4 bg-cyan-50 rounded-[10px] w-3/4 ">
                {info.description}
              </h2>
            </div>
          </div>

          <div className="flex-col justify-items-center">
            <div className="flex justify-center">
              <button
                className="bg-white	text-black rounded-[10px] hover:bg-teal-200	 transition-colors 
                    duration-300 ease-in-out p-2 mt-6 border-black border-2"
                onClick={() => {
                  setShowForm(!showForm);
                }}
              >
                Create Post
              </button>
            </div>

            {showForm && (
              <div className="flex justify-center m-4 ">
                <div className="border-black border-2 p-2 w-3/4 rounded-md">
                  <form
                    onSubmit={handleCreatePost}
                    method="post"
                    className="w-full "
                  >
                    <div className="m-4">
                      <input
                        className="border-slate-400 border-2 w-full rounded-md p-2"
                        placeholder="Title: "
                        type="text"
                        id="title"
                        value={postData.postName}
                        onChange={(e) => {
                          setPostData({
                            ...postData,
                            postName: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="m-4">
                      <textarea
                        className="border-slate-400 border-2 w-full rounded-md p-2"
                        placeholder="Description: "
                        id="postDescription"
                        rows="4"
                        value={postData.postDescription}
                        onChange={(e) => {
                          setPostData({
                            ...postData,
                            postDescription: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex justify-center mb-2">
                      <input
                        className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md"
                        type="submit"
                      />
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                        onClick={() => {
                          setShowForm(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {createPostWarning && (
              <div className="text-center text-red-500">
                <p>
                  Create Post Failed, you are either not a member or not logged
                  in.
                </p>
              </div>
            )}
          </div>

          <div className=" p-4  flex-row items-center">
            {postLength > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className=" bg-zinc-100 rounded-md shadow-md   cursor-pointer border-gray-400 border-2 my-6 p-4 hover:skew-y-1"
                >
                  <div className="font-bold text-[20px] ">
                    cc/{info.name}
                    <p className="text-[10px] font-light">
                      Posted by | {post.user.userName}
                    </p>
                    <p className="text-[10px] font-light">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <Link href={`/post/${post.id}`}>
                    <div className="	bg-cyan-50	 p-3 m-2 rounded-md hover:skew-x-2">
                      <div className="flex justify-between items-center mb-4 ">
                        <h2 className="text-xl">{post.title}</h2>
                      </div>
                      <p className="text-gray-600">{post.content}</p>
                    </div>
                  </Link>

                  <div className="top-2 right-2 flex items-center justify-end mt-4">
                    <div>
                      <LikeButton postId={post.id} userId={post.UserId} />
                    </div>

                    <div className="flex items-center ml-4 ">
                      <FaCommentDots className="mr-2" />
                      <p className="text-[13px]">{post.commentsCount}</p>
                      {console.log("comment coutn: ", post.commentsCount)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xlf flex justify-center text-red text-5xl">
                No Posts
              </p>
            )}
          </div>
        </div>
      </RootLayout>
    </>
  );
};

export default dynamic(() => Promise.resolve(ViewChatRoom), { ssr: false }); //this solves the hydration error.

// export default ViewChatRoom;
