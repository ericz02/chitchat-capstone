import { useState, useEffect, useContext, useRef } from "react";
import { FaUserCircle, FaEllipsisH } from "react-icons/fa";
import { AuthContext } from "@/app/contexts/AuthContext";

const PostCard = ({ post }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftContent, setDraftContent] = useState(post.content);
  const [postState, setPostState] = useState(post);
  const dropdownRef = useRef(null);

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
    setIsEditMode(true);
    // Close the dropdown when clicking on the edit button
    setShowDropdown(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleDelete = () => {};

  const handleSave = () => {
    // Make a PATCH request to update the post content
    fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: draftContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        // The update was successful, update the post content and exit edit mode
        setIsEditMode(false);
        // Update the post content with the new draft content
        setPostState((prevPost) => ({ ...prevPost, content: draftContent }));
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating post content:", error);
      });
  };

  return (
    <div
      key={post.id}
      className="bg-white p-4 rounded-md shadow-md w-2/3 pr-5 my-6 ml-10 flex flex-col sm:flex-col md:flex-col justify-start relative"
    >
      {currentUser && post.UserId === currentUser.id && (
        <button
          onClick={(e) => toggleDropdown(e)}
          className="absolute top-2 right-2 focus:outline-none"
        >
          <FaEllipsisH className="w-4 h-4" />
        </button>
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
        <span className="mr-4 text-gray-500">Likes: {post.likesCount}</span>
        <span className="text-gray-500">Comments: {post.commentsCount}</span>
      </div>

      <button className="absolute bottom-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-md">
        Reply
      </button>

      {/* Dropdown menu */}
      {showDropdown && currentUser && post.UserId === currentUser.id && (
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
  );
};

export default PostCard;
