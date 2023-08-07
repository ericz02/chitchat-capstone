"use client";
import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaUserCircle, FaCommentDots, FaThumbsUp } from "react-icons/fa";
import Link from "next/link";


const ViewChatRoom = () => {
  const router = useRouter();
  const { id } = router.query; // This will get the chatroom ID from the URL

  const [posts, setPosts] = useState(null);
  const [chatroom, setChatroom] = useState(null);
  const [info, setInfo] = useState({name:"", description:""});//this object contains {name, description, length}
  const [postLength, setPostLength] = useState(null);

  //fetch all posts from this chatroom
  useEffect(() => {
    if (id) {
      fetch(`/api/chatrooms/${id}/posts`,{method:"GET"})
        .then((response) => response.json())
        .then((data) => {
          setPosts(data);
          setPostLength(data.length);
        })
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id]);

  //fetch information about this chatroom
  useEffect(() => {
    if (id) {
      fetch(`/api/chatrooms/${id}`,{method:"GET"})
        .then((response) => response.json())
        .then( (data) => {
          setChatroom(data);
          setInfo({name:data.chatroomName, description: data.chatroomDescription});
        })
        .catch((error) => console.error("Error fetching chatroom:", error));
    }
  }, [id]);
  
  console.log("here are all the posts in this chatroom: ", posts);
  console.log("this chatrooms information:", chatroom);
  console.log("info: ", info, " length: ", postLength);
  
  return (
    <RootLayout >
    <div className = " border-black border-2 m-10  w-4/5 flex-row self-center p-2">

      <div className = " p-4 flex flex-col justify-items-center bg-slate-100			">
        <h1 className = "flex justify-center	text-5xl py-4">  {info.name}</h1>
        <div className = "flex justify-center">
          <button
              className="bg-green-300		 text-black px-4 py-2 mx-1 mb-4 rounded-[10px] hover:bg-[#526D82] transition-colors 
              duration-300 ease-in-out "
            >
              Join
            </button>
            <button
              className="bg-red-300	 text-black px-4 py-2 mx-1 mb-4 rounded-[10px] hover:bg-[#526D82] transition-colors 
              duration-300 ease-in-out "
            >
              Leave
            </button>
        </div>    
          <div className = "flex justify-center	">
            <h2 className = "border-black border-2 p-4 bg-cyan-50	 rounded-[10px]	 w-3/4 ">
              About:  {info.description}
            </h2>
          </div>
      </div>
   

      <div className=" p-4    flex-row items-center">
        {(postLength>0)?(posts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id} >
            <div
              key={post.id}
              className="bg-[#DDE6ED] p-4 rounded-md shadow-md   my-6 cursor-pointer "
            >
              <div className="font-bold text-[20px]">
                 cc/{}
              </div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl">{post.title}</h2>
                  <p className="text-[10px]">Posted by | {}</p>
                </div>
                <p className="text-gray-600">{post.content}</p>
                <div className="flex items-center justify-end mt-4">
                  <div className="flex items-center mr-4">
                  <FaThumbsUp className="mr-2" />
                    <p className="text-[13px]">{post.likesCount}</p>
                </div>
                <div className="flex items-center">
                  <FaCommentDots className="mr-2" />
                  <p className="text-[13px]">{}</p>
                </div>
              </div>
            </div>
          </Link>
        ))):(<p className="text-xl">no posts</p>)}
      </div>

    </div>
    </RootLayout>
  );
};

export default ViewChatRoom;
