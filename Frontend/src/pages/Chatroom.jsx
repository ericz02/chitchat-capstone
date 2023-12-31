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
      <h1 className="text-center mt-12  text-2xl font-bold">Chatrooms</h1>
      <div className="grid grid-cols-3 gap-6 mt-12 justify-items-center mb-12">
        {chatrooms.map((chatroom) => (
          <div className="w-4/5 ">
            <div
              key={chatroom.id}
              className="border-black border-2 bg-white h-32 p-4 rounded-lg shadow-lg shadow-lime-100 hover:scale-105 hover:ease-in duration-100"
              title={chatroom.chatroomName} // Add the 'title' attribute
            >
              <div className="">
                <Link href={`/chatroom/${chatroom.id}`}>
                  <div className="text-xl font-semibold flex justify-center underline mb-1">
                    <div className="text-blue-700">{chatroom.chatroomName}</div>
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
