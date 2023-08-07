import RootLayout from "@/app/layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

export const Comment = ({ comment, setPost }) => {
  //the user who made the comment
  const [user, setUser] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetch(`/api/user/${comment.UserId}`)
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
      <div className="flex items-center mb-1">
        {user && user.profilePicture ? (
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={user.profilePicture}
            alt={`Avatar of ${user.userName}`}
          />
        ) : (
          <FaUserCircle className="w-8 h-8 mr-2 text-gray-500" />//first statement will always be true.
        )}
        <div>
          {user && <span className="font-semibold text-sm ">{user.userName}</span>}
        </div>
      </div>
      <p className="text-gray-600">{comment.content}</p>
      {comment.createdAt && (
        <span className="text-gray-500 text-xs">
          {formatDate(comment.createdAt)}
        </span>
      )}
      {/* Show the reply input when the button is clicked */}
      {showReplyInput && (
        <div>
          <textarea
            className="border border-gray-300 rounded-md w-full p-2 mt-2"
            rows={3}
            placeholder="Type your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-md"
            onClick={() => handleReplySubmit(replyContent, comment.id)}
          >
            Submit Reply
          </button>
        </div>
      )}
      {/* Show the button to reveal the reply input */}
      {!showReplyInput && (
        <button
          className="px-2 py-1 m-2 bg-gray-200 rounded-md text-xs"
          onClick={() => setShowReplyInput(true)}
        >
          Reply
        </button>
      )}
      {comment.replies && comment.replies.length > 0 && (//base case
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} />//recursive call
          ))}
        </div>
      )}
    </div>
  );
};

const ViewPost = () => {
  const router = useRouter();
  const { id } = router.query; // This will get the post ID from the URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch post from the server based on the post ID
      fetch(`/api/posts/${id}`)
        .then((response) => response.json())
        .then((data) => setPost(data))
        .catch((error) => console.error("Error fetching post:", error));
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
        <div className="flex flex-col justify-center mb-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          {/* Add the post details, e.g., author, date, etc., here */}
        </div>
        <p className="text-gray-600">{post.content}</p>
        <div className="flex items-center mt-4">
          {/* Render the comments */}
          {post.comments && post.comments.length > 0 && (
            <div>{ console.log(post.comments)}
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

export default ViewPost;
