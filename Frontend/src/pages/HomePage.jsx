"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch posts from the server
    fetch("http://localhost:4000/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));

    // Check if the user is authenticated
    fetch("http://localhost:4000/auth/check-auth", {
      credentials: "include", // To include the session cookie
    })
      .then((response) => {
        if (response.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
        setAuthenticated(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-4xl pl-16">
      <div className="flex flex-col justify-center mb-4">
        <div className="flex flex-col items-center ml-4 pr-6">
          {authenticated ? (
            <Link href="/create">
              <button
                className="bg-[#5175a8] px-4 py-2 rounded-[10px] hover:bg-[#526D82] transition-colors 
              duration-300 ease-in-out mt-8 text-white"
              >
                Create Post
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="bg-[#5175a8] px-4 py-2 rounded-[10px] hover:bg-[#526D82] transition-colors
                duration-300 ease-in-out mt-8 text-white cursor-not-allowed opacity-50"
            >
              Create Post
            </button>
          )}
        </div>
      </div>

      {posts.map((post) => (
        <Link
          href={authenticated ? `/post/${post.id}` : "/login"}
          key={post.id}
        >
          <div
            key={post.id}
            className="bg-white p-4 rounded-md shadow-md w-2/3 pr-5 my-6 ml-10 flex flex-col sm:flex-col md:flex-col justify-start"
          >
            <div className="flex flex-col justify-center mb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              {/* Add the post details, e.g., author, date, etc., here */}
            </div>
            <p className="text-gray-600">{post.content}</p>
            <div className="flex items-center mt-4"></div>
          </div>
        </Link>
      ))}
    </div>
  );
};
export default HomePage;
