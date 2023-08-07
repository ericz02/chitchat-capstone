"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const ChatroomList = () => {
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    // Fetch the list of chatrooms from the server
    fetch("/api/chatrooms")
      .then((response) => response.json())
      .then((data) => setChatrooms(data))
      .catch((error) => console.error("Error fetching chatrooms:", error));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {chatrooms.map((chatroom) => (
        <div
          key={chatroom.id}
          className="rounded-full bg-blue-500 text-white text-center p-3 transform transition-transform hover:scale-110 cursor-pointer min-w-8"
        >
          <Link href={`/chatroom/${chatroom.id}`}>
            <div>{chatroom.chatroomName}</div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ChatroomList;
