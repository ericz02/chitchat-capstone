'use client'
import Link from "next/link";
import { useState, useEffect } from "react";


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
        
        <div key={post.id} className="bg-white p-4 rounded-md shadow-md mb-4">
          console.log(post)
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
