import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const CommentSection = ({ comment, replyContent, setReplyContent }) => {
  const [user, setUser] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch the user's data based on the comment's UserId
    fetch(`/api/user/${comment.UserId}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));
  }, [comment.UserId]);

  useEffect(() => {
    // Initialize comments state with the comment's replies
    setComments(comment.replies);
  }, [comment.replies]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString(); // Format the timestamp to display only the date
  };

  const handleReplySubmit = (replyContent, commentId) => {
    // Fetch the backend API route to create a reply comment
    fetch(`/api/posts/${commentId}/replyComments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: replyContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Clear the reply input
        setReplyContent("");
        // Hide the reply input after submitting the reply
        setShowReplyInput(false);
        // Update the comments state to include the new reply
        setComments((prevComments) => [...prevComments, data]);
      })
      .catch((error) => console.error("Error creating reply:", error));
  };

  return (
    <div className="ml-10 border-l-2 pl-4 mt-4 bg-gray-100 p-4 rounded-md shadow-md">
      {/* Display the user's avatar and username */}
      <div className="flex items-center mb-1">
        {user && user.profilePicture ? (
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={user.profilePicture}
            alt={`Avatar of ${user.userName}`}
          />
        ) : (
          <FaUserCircle className="w-8 h-8 mr-2 text-gray-500" />
        )}
        <div>
          {user && <span className="font-semibold">{user.userName}</span>}
        </div>
      </div>
      {/* Display the comment content */}
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
          className="px-4 py-2 mt-2 bg-gray-200 rounded-md"
          onClick={() => setShowReplyInput(true)}
        >
          Reply
        </button>
      )}
      {comments && comments.length > 0 && (
        <div className="mt-2">
          {comments.map((reply) => (
            <CommentSection
              key={reply.id}
              comment={reply}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
