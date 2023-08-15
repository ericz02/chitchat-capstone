"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Chatroom = () => {
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    // Fetch the list of chatrooms from the server
    fetch("/api/chatrooms")
      .then((response) => response.json())
      .then((data) => setChatrooms(data))
      .catch((error) => console.error("Error fetching chatrooms:", error));
  }, []);

  return (
    <div>
      <h1 className="text-center mt-12 text-2xl font-bold">Chatrooms</h1>
      <div className="grid grid-cols-3 gap-4 mt-12 justify-items-center ">
        {chatrooms.map((chatroom) => (
          <div className="w-4/5 ">
            <div
              key={chatroom.id}
              className="border-black border-2 bg-white h-32 p-4 rounded-lg"
              title={chatroom.chatroomName} // Add the 'title' attribute
            >
              <div className="">
                <Link href={`/chatroom/${chatroom.id}`}>
                  <div className="text-xl font-semibold flex justify-center underline mb-1">
                    {chatroom.chatroomName}
                  </div>
                  <div className=" text-sm font-normal flex justify-center ">
                    {chatroom.chatroomDescription}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatroom;
