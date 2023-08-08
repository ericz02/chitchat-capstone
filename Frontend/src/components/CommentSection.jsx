import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const CommentSection = ({ comment, replyContent, setReplyContent, postId }) => {
  const [user, setUser] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [comments, setComments] = useState([]);

  console.log("The comment being passed:", comment);
  console.log("post id:", postId);

  useEffect(() => {
    // Fetch the user's data based on the comment's UserId
    if (comment && comment.UserId) {
      // Add a conditional check here
      fetch(`/api/user/${comment.UserId}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [comment]);

  useEffect(() => {
    // Initialize comments state with the comment's replies
    setComments(comment.replies);
  }, [comment.replies]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString(); // Format the timestamp to display only the date
  };

  const handleReplySubmit = async (replyContent, commentId, postId) => {
    console.log("CommentId:", commentId);
    console.log("replyContent:", replyContent);

    try {
      if (comment.commentableType === "comment") {
        // If replying to a comment, use a POST request to create a reply comment
        const response = await fetch(`/api/posts/${commentId}/replyComments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: replyContent }),
        });

        if (!response.ok) {
          throw new Error("Failed to create reply");
        }

        const data = await response.json();
        console.log(data);

        // Assuming new comments have no replies initially
        const fullData = {
          ...data.comment,
          replies: [],
        };
        setComments((prevComments) => [...prevComments, fullData]);
      } else {
        // If replying to the original post, use a POST request to create a reply comment
        const response = await fetch(`/api/posts/${commentId}/replyComments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: replyContent }),
        });

        if (!response.ok) {
          throw new Error("Failed to create reply");
        }

        const data = await response.json();
        console.log(data);

        // Assuming new comments have no replies initially
        const fullData = {
          ...data.comment,
          replies: [],
        };
        setComments((prevComments) => [...prevComments, fullData]);
      }

      // Reset the reply input after successful reply creation
      setReplyContent("");
      setShowReplyInput(false);
    } catch (error) {
      console.error("Error creating reply:", error);
    }
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
            onClick={() => handleReplySubmit(replyContent, comment.id, postId)}
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
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
