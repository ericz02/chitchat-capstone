"use client";
import RootLayout from "@/app/layout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <RootLayout>
   <div key={post.id} className="bg-white p-4 rounded-md shadow-md w-2/3 pr-5 my-6 ml-10 flex flex-col sm:flex-col md:flex-col justify-start" > 
          <div className="flex flex-col justify-center mb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            {/* Add the post details, e.g., author, date, etc., here */}
          </div>
          <p className="text-gray-600">{post.content}</p>
          <div className="flex items-center mt-4">
          </div>
        </div>
    </RootLayout>
  );
};

export default ViewPost;
