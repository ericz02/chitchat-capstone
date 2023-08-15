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
      <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
        {chatrooms.map((chatroom) => (
          <div
            key={chatroom.id}
            className="rounded-lg bg-blue-500 hover:bg-blue-700 text-white text-center p-4 transform transition-transform hover:scale-105 cursor-pointer overflow-hidden hover:skew-y-3"
            title={chatroom.chatroomName} // Add the 'title' attribute
          >
            <Link href={`/chatroom/${chatroom.id}`}>
              <div className="text-[10px]">{chatroom.chatroomName}</div>
            </Link>
          </div>
        ))}
      </div>
  );
};

export default ChatroomList;
