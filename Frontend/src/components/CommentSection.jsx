import { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import {
  FaUserCircle,
  FaEllipsisH,
  //FaCommentDots,
  //FaThumbsUp,
  //FaTimes,
} from "react-icons/fa";
import { AuthContext } from "@/app/contexts/AuthContext";
import LikeButton from "./LikeButton";
const CommentSection = ({
  comment,
  replyContent,
  setReplyContent,
  newComment,
  onUpdateComment,
}) => {
  const [user, setUser] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [comments, setComments] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftContent, setDraftContent] = useState(comment.content);
  const router = useRouter();

  useEffect(() => {
    // Check if comment.replies exists and is an array before setting the state
    if (Array.isArray(comment.replies)) {
      setComments(comment.replies);
    }
  }, [comment.replies]);

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
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const dropdownRef = useRef(null);

  const handleReply = () => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setShowReplyInput(true);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setDraftContent(comment.content);
    setShowDropdown(false); // Close the dropdown when entering edit mode
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `/api/posts/${comment.postId}/replyComments/${comment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: draftContent }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const data = await response.json();

      onUpdateComment({ ...comment, content: draftContent });

      setIsEditMode(false);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString(); // Format the timestamp to display only the date
  };

  const handleReplySubmit = async (replyContent, commentId) => {
    try {
      // If replying to a comment or the original post, use a POST request to create a reply comment
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

      console.log("New Comment Data:", fullData);

      // Add the new comment to the comments list immediately
      setComments((prevComments) => [...(prevComments || []), fullData]);

      // Reset the reply input after successful reply creation
      setReplyContent("");
      setShowReplyInput(false);
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Stop the event from propagating up the DOM tree
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const handleDelete = async () => {
    try {
      // Send a DELETE request to the server to delete the comment
      const response = await fetch(`/api/posts/comments/${comment.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      /* console.log("COmment do be deleted");

      setComments((prevComments) => {
        console.log("Inside setComments, prevComments:", prevComments);

        return Array.isArray(prevComments)
          ? prevComments.map((c) =>
              c.id === comment.id ? { ...c, content: "DELETED" } : c
            )
          : [];
      }); */
      onUpdateComment({ ...comment, content: "Deleted" });

      setShowDropdown((prevShowDropdown) => !prevShowDropdown);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleMainCommentUpdate = (updatedComment) => {
    // Assuming 'allComments' is your main state in the parent component that stores all comments
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  return (
    <div className="relative ml-10 border-l-2 pl-4 mt-4 bg-gray-100 p-4 rounded-md shadow-md pb-4">
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
      {/* Show the ellipsis button for the logged-in user's comments/replies */}
      {currentUser && comment.UserId === currentUser.id && (
        <div className="absolute top-0 right-0">
          {/* Dropdown container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => toggleDropdown(e)}
              className="focus:outline-none"
            >
              <FaEllipsisH className="w-4 h-4 mr-2" />
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 bg-white shadow-md rounded-md">
                <button
                  className="block w-full py-2 px-4 hover:bg-gray-100 text-left"
                  onClick={toggleEditMode}
                >
                  Edit
                </button>
                <button
                  className="block w-full py-2 px-4 hover:bg-gray-100 text-left"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Display the comment content */}
      {!isEditMode ? (
        <p className="text-gray-600">{comment.content}</p>
      ) : (
        <div>
          <textarea
            className="border border-gray-300 rounded-md w-full p-2 mt-2"
            rows={5}
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              className="px-4 py-2 mr-2 bg-green-500 text-white rounded-md"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => setIsEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {newComment && (
        <div className="bg-green-100 p-2 mt-2 rounded-md">
          <p className="text-green-800">{newComment.content}</p>
        </div>
      )}
      {comment.createdAt && (
        <span className="text-gray-500 text-xs">
          {formatDate(comment.createdAt)}
          <LikeButton postId={comment.id} userId={comment.UserId} />
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
          <div className="flex justify-between mt-2">
            <div>
              <button
                className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md"
                onClick={() => handleReplySubmit(replyContent, comment.id)}
              >
                Submit Reply
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => {
                  setShowReplyInput(false);
                  setReplyContent("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Show the button to reveal the reply input */}
      {!showReplyInput && (
        <button
          className="px-2 py-1 mt-2 ml-2 text-[12px] bg-gray-200 hover:bg-gray-300 rounded-md"
          onClick={handleReply}
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
              onUpdateComment={handleMainCommentUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
