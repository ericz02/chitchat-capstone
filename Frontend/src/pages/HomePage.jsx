'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaTh, FaThumbsUp } from "react-icons/fa";


const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from the server
    fetch('http://localhost:4000/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);



  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col justify-center mb-4">
        <div className="flex flex-col items-center ml-4 pr-6">
          <Link href="/create">
            <button className="bg-[#5175a8] px-4 py-2 rounded-[10px] hover:bg-[#526D82] transition-colors 
              duration-300 ease-in-out mt-8 text-white"
            >
              Create Post
            </button>{" "}
          </Link>
        </div>
      </div>

      {posts.map((post) => (
        <Link href={`/post/${post.id}`} key={post.id}>
          
        <div key={post.id} className="bg-white p-4 rounded-md shadow-md w-2/3 pr-5 my-6 flex md:flex-col items-center " > 
          <div className="flex flex-col justify-center mb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            {/* Add the post details, e.g., author, date, etc., here */}
          </div>
          <p className="text-gray-600">{post.content}</p>
          <div className="flex items-center mt-4">
          </div>
        </div>
        </Link>
        
      ))}
    </div>
  );
};

export default HomePage;
