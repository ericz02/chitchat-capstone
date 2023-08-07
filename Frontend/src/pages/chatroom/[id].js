"use client";
import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaUserCircle, FaCommentDots, FaThumbsUp } from "react-icons/fa";
import Link from "next/link";


// export const Comment = ({ comment }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Fetch the user's data based on the comment's UserId
//     fetch(`/api/user/${comment.UserId}`)
//       .then((response) => response.json())
//       .then((data) => setUser(data))
//       .catch((error) => console.error("Error fetching user:", error));
//   }, [comment.UserId]);
//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toDateString(); // Format the timestamp to display only the date
//   };
//   return (
//     <div className="ml-4 border-l-2 pl-4 mt-4">
//       <div className="flex items-center mb-1">{/*console.log("user: ",user)*/}
//         {user && user.profilePicture ? (
//           <img
//             className="w-8 h-8 rounded-full mr-2"
//             src={user.profilePicture}
//             alt={`Avatar of ${user.userName}`}
//           />
//         ) : (
//           <FaUserCircle className="w-8 h-8 mr-2 text-gray-500" />
//         )}
//         <div>
//           {user && <span className="font-semibold">{user.userName}</span>}
//         </div>
//       </div>
//       <p className="text-gray-600">{comment.content}</p>
//       {comment.createdAt && (
//         <span className="text-gray-500 text-xs">
//           {formatDate(comment.createdAt)}
//         </span>
//       )}
//       {comment.replies && comment.replies.length > 0 && (
//         <div className="mt-2">
//           {comment.replies.map((reply) => (
//             <Comment key={reply.id} comment={reply} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };


const ViewChatRoom = () => {
  const router = useRouter();
  const { id } = router.query; // This will get the chatroom ID from the URL

  const [posts, setPosts] = useState(null);
  const [chatroom, setChatroom] = useState(null);
  const [info, setInfo] = useState({});

  //fetch all posts from this chatroom
  useEffect(() => {
    if (id) {
      fetch(`/api/chatrooms/${id}/posts`,{method:"GET"})
        .then((response) => response.json())
        .then((data) => {
          setPosts(data);
          setInfo({length: data.length});
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
          setInfo({...info, name:data.chatroomName, description: data.chatroomDescription});
        })
        .catch((error) => console.error("Error fetching chatroom:", error));
    }
  }, [id]);
  
  console.log("here are all the posts in this chatroom: ", posts);
  console.log("this chatrooms information:", chatroom);
  console.log("info: ", info);
  
  return (
    <RootLayout>
    <div className = "m-10">
      <div className = "border-black border-2 p-4">
        <h1>chatroomName:  {info.name}</h1>
        <h2>description: {info.description}</h2>
      </div>

      <div className="ml-[70px]">

  {(posts)?(posts.map((post) => (
  <Link href={`/post/${post.id}`} key={post.id}>
    <div
      key={post.id}
      className="bg-[#DDE6ED] p-4 rounded-md shadow-md w-2/3 pr-5 my-6 ml-10 cursor-pointer"
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
