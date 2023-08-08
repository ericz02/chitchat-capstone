import React from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";

const LikeButton = ({ postId, likesCount, currentUser }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent element

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
        }),
      });

      if (response.ok) {
        // Use the callback form of setIsLiked to get the updated isLiked value
        setIsLiked((prevIsLiked) => !prevIsLiked);
        window.location.reload();
      }

      // Update the likes count using the updateLikesCount function from the parent component
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  useEffect(() => {
    // Fetch the likes data for the current post
    fetch(`/api/posts/${postId}/like`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        // Check if the current user's ID exists in the likes data
        if ("isLiked" in data) {
          setIsLiked(data.isLiked);
        }
      })
      .catch((error) => console.error("Error fetching likes:", error));
  }, [isLiked]);

  return (
    <div
      className="flex items-center mr-4 rounded-full transform transition-transform hover:scale-110 cursor-pointer min-w-8 z-1"
      onClick={handleLike}
    >
      <FaThumbsUp className="mr-2" />
      <p className="text-[13px]">{likesCount}</p>
    </div>
  );
};

export default LikeButton;
