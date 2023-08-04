'use client'

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const ViewPost = () => {
  const router = useRouter();
  const { id } = router.query; // This will get the post ID from the URL

  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch post from the server based on the post ID
      fetch(`http://localhost:4000/posts/${id}`)
        .then((response) => response.json())
        .then((data) => setPost(data))
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p className="bg-[#FFFFFF] h-[2000px] p-4 flex flex-col">
        this is the page to view posts
      </p>
      {/* Display the post content */}
      <div>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default ViewPost;

