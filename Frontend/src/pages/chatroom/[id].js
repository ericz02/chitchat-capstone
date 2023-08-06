import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

export const Comment = ({ comment }) => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    // Fetch the user's data based on the comment's UserId
    fetch(`http://localhost:4000/user/${comment.UserId}`)//when we fetch here there is a 404 error that is why the comments dont display their user properties
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));
  }, [comment.UserId]);
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString(); // Format the timestamp to display only the date
  };
  return (
    <div className="ml-4 border-l-2 pl-4 mt-4">
      <div className="flex items-center mb-1">{/*console.log("user: ",user)*/}
        {user && user.image_URL ? (
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={user.image_URL}
            alt={`Avatar of ${user.userName}`}
          />
        ) : (
          <FaUserCircle className="w-8 h-8 mr-2 text-gray-500" />
        )}
        <div>
          {user && <span className="font-semibold">{user.userName}</span>}
        </div>
      </div>
      <p className="text-gray-600">{comment.content}</p>
      {comment.createdAt && (
        <span className="text-gray-500 text-xs">
          {formatDate(comment.createdAt)}
        </span>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

const ViewChatRoom = () => {
  const router = useRouter();
  const { id } = router.query; // This will get the post ID from the URL

  const [post, setPost] = useState(null);
  const [chatroom, setChatroom] = useState(null);
  useEffect(() => {
    if (id) {
      // Fetch post from the server based on the post ID
      fetch(`http://localhost:4000/posts/${id}`)
        .then((response) => response.json())
        .then((data) => setPost(data))
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      // Fetch chatroom from the server based on the chatroom ID
      fetch(`http://localhost:4000/chatrooms/${id}`)
        .then((response) => response.json())
        .then((data) => setChatroom(data))
        .catch((error) => console.error("Error fetching chatroom:", error));
    }
  }, [id]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <RootLayout>
      <div
        key={post.id}
        className="bg-white p-4 rounded-md shadow-md w-2/3 pr-5 my-6 ml-10 flex flex-col sm:flex-col md:flex-col justify-start"
      >
          <h1 className="text-xl font-semibold mt-4 mb-4">
            {chatroom.chatroomName}
          </h1>
          <p className="text-gray-600">{chatroom.chatroomDescription}</p>
        <div className="flex flex-col justify-center mb-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">
            {/* Add the post details, e.g., author, date, etc., here */}
            {post.content}
          </p>
        
        </div>
        <div className="flex items-center mt-4">
          {/* Render the comments */}
          {post.comments && post.comments.length > 0 && (
            <div>
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
};

export default ViewChatRoom;
