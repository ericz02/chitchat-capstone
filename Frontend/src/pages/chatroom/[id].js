"use client";
import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect,useContext } from "react";
import { FaUserCircle, FaCommentDots, FaThumbsUp } from "react-icons/fa";
import Link from "next/link";
import { AuthContext } from "@/app/contexts/AuthContext";
import dynamic from "next/dynamic";



const ViewChatRoom = () => {

  const router = useRouter();
  const { id } = router.query; // This will get the chatroom ID from the URL
  const [posts, setPosts] = useState([]);
  const [chatroom, setChatroom] = useState(null);
  const [info, setInfo] = useState({name:"", description:""});//this object contains {name, description, length}
  const [postLength, setPostLength] = useState(null);
  const[joined,setJoined] = useState(false);
  const[role,setRole] = useState(null);
  const [joining, setJoining]  = useState(false);//purpose of this boolean is everythime a user leaves or joins a room they will rerender the page to show either the leave or join button

  const handleDeleteChatroom = async() => {
    try {
      const response = await fetch(`/api/chatrooms/${id}`, {
        method:"DELETE",
        credentials: "include",
      });
      if(!response.ok){
        console.log("failed to delete chatroom");
      }
      console.log("successfully deleted chatroom");
      router.push("/");
      return;
      
    } catch (error) {
      console.error("Error joining:", error);
    }
  };
  const handleJoin = async() =>{
      try{
        const response = await fetch(`/api/chatrooms/${id}/addUser`,{
          method: "POST",
          credentials: "include",
        });
        if(!response.ok){
          console.log("failed to join chatroom!");
          router.push("/login");
          return;
        }
        console.log("joined successfully!");
        setJoining(true);
      }catch(error){
        console.error("Error joining:", error);
      }
  };
  const handleLeave = async() =>{
    try {
      const response = await fetch(`/api/chatrooms/${id}/removeUser`,{
        method:"DELETE",
        credentials:"include",
      });
      if(!response.ok){
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
  
  //check if the logged in user is a member of this chatroom 
  useEffect(()=>{
    const checkMembership = async ()=>{
      try{
        const response = await fetch(`/api/chatrooms/isMemberOf/${id}`,{
        method:"GET",
      });
      const data = await response.json();
      if(data.there){
        console.log("is there reqeuse MADEEE");
        setJoined(true);
        setRole(data.role);
      }else{
        setJoined(false);
      }
      }catch(error){
        console.error("Error fetching membership:", error);
      }
    }
    if(id){
      checkMembership();
      setJoining(false);//reset the boolean so that when the user joins another room it will rerender the page to say that they are a member
    }
  },[id,joining]);

  console.log("joined: ",joined, "role: ", role, "id: ",id);
  //fetch all posts from this chatroom
  useEffect(() => {
    if (id) {
      fetch(`/api/chatrooms/${id}/posts`,{method:"GET"})
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
  
              return { ...post, user: userData };//spread the post itself, the user data gotten from post.userid, and the chatroom from post.chatroomId
            })
          );
            setPosts(postsWithUserDetails);
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
    <>
    <RootLayout  >
    <div className = " border-black border-2 m-10  w-4/5 flex-row self-center p-2">
            
      <div className = " p-4 flex flex-col justify-items-center bg-slate-100">
            {(role ==="admin")?(<div className = "flex justify-end	">
              <button
                className="bg-red-100	text-black  rounded-[10px] hover:bg-red-500 transition-colors 
                duration-300 ease-in-out px-4 py-2  w-1/6 text-xs "
                onClick = {handleDeleteChatroom}
                >
                Delete Chatroom
              </button>
            </div>) :(<></>)}
            


        <h1 className = "flex justify-center	text-5xl py-4">  {info.name}</h1>

          {(joined) ?(
          <div className = "flex justify-center" >
            <button
              className="bg-red-100		 text-black px-4 py-2 mx-1 mb-4 rounded-[10px] hover:bg-red-500 transition-colors 
              duration-300 ease-in-out border-black border-2"
              onClick = {handleLeave}
            >
              Leave
            </button>
          </div> 
          ):(
          <div className = "flex justify-center" >
            <button
                className="bg-green-100		 text-black px-4 py-2 mx-1 mb-4 rounded-[10px] hover:bg-green-500 transition-colors 
                duration-300 ease-in-out border-black border-2"
                onClick = {handleJoin}
              >
                Join
            </button>
          </div>)}
            {(joined)?(
            <div className = "flex justify-center mb-2">
              <p className = "font-mono">
                You are a {role}.
              </p>
            </div>):(<></>)}
          <div className = "flex justify-center	">
            <h2 className = "border-black border-2 p-4 bg-cyan-50	 rounded-[10px]	 w-3/4 ">
              {info.description}
            </h2>
          </div>
      </div>
   

      <div className=" p-4    flex-row items-center">
        {(postLength>0)?(posts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id}  >
            <div
              key={post.id}
              className="bg-[#DDE6ED] p-4 rounded-md shadow-md   my-6 cursor-pointer "
            >
              <div className="font-bold text-[20px]">
                 cc/{info.name}
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
        ))):(<p className="text-xlf flex justify-center	 text-red text-5xl">No Posts</p>)}
      </div>

    </div>
    </RootLayout>
    </>
  );
};

export default dynamic (() => Promise.resolve(ViewChatRoom), {ssr: false});

// export default ViewChatRoom;
