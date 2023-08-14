import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (query) => {
    if (query.trim() === "") {
      setSearchResults(null);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
      setSearchResults(null);
    }
  };

  return (
    <div className="relative ">
      <div className=" flex items-center  mb-2 md:mb-0 mx-auto md:mr-auto">
        <BiSearch className="text-blue-500 absolute left-4" size={20} />
        <input
          type="search"
          className="p-3 pl-10 w-full md:w-[400px]  rounded-[10px] border border-gray-300 dark:border border-l-gray-700 dark:border-gray-400 dark:placeholder-gray-100 dark:text-white outline-none"
          placeholder="Search Communities, Posts, Users..."
          onChange={(e) => handleSearch(e.target.value)}
          required
        />
      </div>
      {searchResults && (
        <div className="search-results absolute text-blue-500 w-[400px] p-2 rounded-md shadow-md bg-slate-200">
          <ul>
            <h6 className="text-lg font-bold text-gray-400">Chatrooms:</h6>
            {searchResults.chatrooms.map((chatroom) => (
              <li key={chatroom.id} className=" hover:text-purple-500">
                <Link href={`/chatroom/${chatroom.id}`}>
                  {chatroom.chatroomName}
                </Link>
              </li>
            ))}
          </ul>
          <ul>
          <h6 className="text-lg font-bold text-gray-400">Post:</h6>
            {searchResults.posts.map((post) => (
              <li key={post.id} className=" hover:text-purple-500">
                <Link href={`/post/${post.id}`}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul>
          <h6 className="text-lg font-bold text-gray-400">Users:</h6>
            {searchResults.userPosts.map((post) => (
              <li key={post.id} className=" hover:text-purple-500">
                <Link href={`/post/${post.id}`}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
