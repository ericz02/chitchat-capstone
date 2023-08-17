import Image from "next/image";
import { FaHome, FaCog, FaMailBulk, FaComments } from "react-icons/fa";
import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";
import ChatroomList from "../pages/ChatroomList";
import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the threshold as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize the state
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className=" bg-[#27374D] w-1/6 min-w-[120px] p-4 fixed h-full z-20 overflow-auto">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8">
          <Link href="/">
            <Image
              className="m-auto hover:animate-spin"
              src={chitchatLogo}
              alt="Company Logo"
              height={150}
              width={150}
            />
          </Link>
        </div>

        <div className={`flex flex-col items-${isMobile ? 'center' : 'left'} justify-center space-y-4`}>
          <Link href="/">
            <div className={`flex items-center mt-2 ml-4 text-[20px] text-white hover:text-gray-400 self-start ${isMobile && 'icon-only'}`}>
              <FaHome style={{ marginRight: "8px" }} size={24} /> {!isMobile && 'Home'}
            </div>
          </Link>

          <Link href="/settings">
            <div className={`flex items-center mt-2 ml-4 text-[20px] text-white hover:text-gray-400 self-start ${isMobile && 'icon-only'}`}>
              <FaCog style={{ marginRight: "8px" }} size={24} /> {!isMobile && 'Settings'}
            </div>
          </Link>

          <Link href="/contact">
            <div className={`flex items-center mt-2 ml-4 text-[20px] text-white hover:text-gray-400 self-start ${isMobile && 'icon-only'}`}>
              <FaMailBulk style={{ marginRight: "8px" }} size={24} /> {!isMobile && 'Contact Us'}
            </div>
          </Link>
        </div>

        <Link href="/chatroomPage">
          <div className={`flex items-center mt-16 text-[20px] text-white hover:text-gray-400 self-center ${isMobile && 'ml-3'}`}>
            <FaComments style={{ marginRight: "8px" }} size={24} /> {!isMobile && 'ChitChatRooms'}
          </div>
        </Link>

        <div className={`mt-4 ${isMobile && 'icon-only'}`}>
          <Link href="/createChatroom">
            <button
              className="px-2 py-2 text-s text-white hover:text-gray-400 bg-[#526D82] rounded-[10px] hover:bg-[#43556B] 
              transition-colors duration-300 ease-in-out"
            >
              {!isMobile ? "+ Create Chatroom" : "+"}
            </button>
          </Link>
        </div>
        <ChatroomList />
      </div>
    </div>
  );
};

export default Sidebar;
