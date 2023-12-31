import { useState, useEffect, useContext, useRef } from "react";
import {
  FaUserCircle,
  FaEllipsisH,
  FaCommentDots,
  FaThumbsUp,
} from "react-icons/fa";
import { AuthContext } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LikeButton from "./LikeButton";

const PostCard = ({ post, onUpdate, onUpdateComments }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftContent, setDraftContent] = useState(post.content);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [showReplyTextarea, setShowReplyTextarea] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  console.log("PostCard props", post, onUpdate, onUpdateComments);

  useEffect(() => {
    // Fetch the user's data based on the post's UserId
    fetch(`/api/user/${post.UserId}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));
  }, [post.UserId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString(); // Format the timestamp to display only the date
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Stop the event from propagating up the DOM tree
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const handleEdit = () => {
    if (!post.isDeleted) {
      setIsEditMode(true);
    }
    // Close the dropdown when clicking on the edit button
    setShowDropdown(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleReplyCancel = () => {
    setShowReplyTextarea(false);
  };

  const handleDelete = () => {
    // Fetch the backend API route to delete the post
    fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        onUpdate();
        router.push("/");
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  const handleSave = () => {
    fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: draftContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsEditMode(false);
        onUpdate(data.content); // Notify the parent component with the updated content
      })
      .catch((error) => {
        console.error("Error updating post content:", error);
      });
  };

  const handleReply = () => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setShowReplyTextarea(true);
    }
  };

  const handleCreateComment = () => {
    fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newCommentContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched post data", data);
        onUpdateComments(data);
        setNewCommentContent("");
        setShowReplyTextarea(false);
      })
      .catch((error) => console.error("Error creating comment:", error));
  };

  const handleSaveComment = (commentId, newContent) => {
    fetch(`/api/posts/${post.id}/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newContent }),
    })
      .then((response) => response.json())
      .then((updatedComment) => {
        // After successfully updating the comment on the server,
        // call the prop function to update the parent's state
        onUpdateComments(updatedComment);
      })
      .catch((error) => {
        console.error("Error updating comment:", error);
      });
  };

  return (
    <>
      <div
        key={post.id}
        className="bg-white border border-1 border-gray-700 p-4 rounded-md shadow-md w-2/3 pr-5 my-6 ml-10 flex flex-col sm:flex-col md:flex-col justify-start "
      >
        {currentUser && post.UserId === currentUser.id && (
          <div className="flex justify-end">
            {/* Dropdown container */}
            <div className="relative">
              <button
                onClick={(e) => toggleDropdown(e)}
                className="focus:outline-none"
              >
                <FaEllipsisH className="w-4 h-4" />
              </button>

              {/* Dropdown menu */}
              {showDropdown &&
                currentUser &&
                post.UserId === currentUser.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-8 right-2 bg-white shadow-md rounded-md"
                  >
                    <button
                      className="block w-full py-2 px-4 hover:bg-gray-100 text-left"
                      onClick={handleEdit}
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

        <div className="flex flex-col justify-center mb-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <div className="flex items-center text-gray-500 text-sm">
            {user && user.profilePicture ? (
              <img
                className="w-4 h-4 mr-2 rounded-full"
                src={user.profilePicture}
                alt={`Avatar of ${user.userName}`}
              />
            ) : (
              <FaUserCircle className="w-4 h-4 mr-2" />
            )}
            {user ? user.userName : "Unknown User"}
            <span className="mx-2">|</span>
            {formatDate(post.createdAt)}
            {post.updatedAt !== post.createdAt ? formatDate(post.updatedAt) : formatDate(post.createdAt)}
          </div>
        </div>

        {isEditMode ? (
          // Render the edit textarea when in edit mode
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
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Render the post content when not in edit mode
          <p className="text-gray-600">{post.content}</p>
        )}

        <div className="flex items-center mt-4">
          {currentUser ? (
            <LikeButton
              postId={post.id}
              userId={currentUser.id}
              commentableType="post"
            />
          ) : (
            <span className="text-gray-500 flex items-center">
              <FaThumbsUp className="mr-2" /> {post.likesCount}
            </span>
          )}

          <span className="text-gray-500 ml-auto flex items-center">
            <FaCommentDots className="mr-2" />
            Comments: {post.commentsCount}
          </span>
        </div>
      </div>
      {showReplyTextarea && (
        <div className="border border-1 border-gray-700 bg-white p-4 rounded-md shadow-md w-2/3 pr-5 my-6 ml-10 flex flex-col sm:flex-col md:flex-col justify-start">
          <textarea
            className="border border-gray-700 rounded-md w-full p-2 mt-2"
            rows={5}
            placeholder="Type your reply..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          />
          <div className="flex flex-row justify-between mt-2">
            <button
              className="px-4 py-2 mt-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              onClick={handleReplyCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={handleCreateComment}
            >
              Submit Reply
            </button>
          </div>
        </div>
      )}

      {!showReplyTextarea && (
        <div className="ml-10 ">
          <button
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            onClick={handleReply}
          >
            Reply
          </button>
        </div>
      )}
    </>
  );
};

export default PostCard;
