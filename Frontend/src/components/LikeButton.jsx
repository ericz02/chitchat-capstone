import React from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";

const LikeButton = ({postId, userId}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const checkLikes = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like?userId=${userId}`);
      const data = await response.json();
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
    } catch (error) {
      console.error("Error checking likes:", error);
    }
  };

  useEffect(() => {
    checkLikes();
  }, [postId, userId]);

  const handleLike = async () => {

    try{
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      console.log(data);
      console.log("isLiked", data.isLiked);
      console.log("likesCount", data.likesCount);
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
    } catch (error) {
      console.error("Error liking post:", error);

    }
  };
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
