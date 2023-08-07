import Image from "next/image";
import { FaHome, FaCog, FaMailBulk, FaComments } from "react-icons/fa";
import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";
import ChatroomList from "../pages/ChatroomList";

const Sidebar = () => {
  return (
    <div className=" bg-[#27374D] w-1/6 min-w-[120px] p-4 fixed h-full z-20 overflow-auto">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8">
          <Link href="/">
            <Image
              className="m-auto"
              src={chitchatLogo}
              alt="Company Logo"
              height={150}
              width={150}
            />
          </Link>
        </div>

        <div className="flex flex-col items-left justify-center space-y-4">
         <Link href="/">
            <div className="flex items-center mt-4 ml-4 text-[20px] text-white self-start">
              <FaHome style={{ marginRight: "8px" }} size={24} /> Home{" "}
            </div>
          </Link>

          <Link href="/settings">
            <div className="flex items-center mt-4   ml-4 text-[20px] text-white self-start">
              <FaCog style={{ marginRight: "8px" }} size={24} /> Settings{" "}
            </div>
          </Link>

          <Link href="/contact">
            <div className="flex items-center mt-4 ml-4 text-[20px] text-white self-start">
              <FaMailBulk style={{ marginRight: "8px" }} size={24} /> Contact Us{" "}
            </div>
          </Link>
        </div>

        {/* TODO: Wrap in link component to chitchatrooms */}
        <div className="flex items-center mt-16 text-[20px] text-white self-center">
          <FaComments style={{ marginRight: "8px" }} size={24} /> ChitChatRooms{" "}

        </div>
        <Link href="/createChatroom">
            <button
              className="bg-[#E6E6E6] text-black px-4 py-1 rounded-[10px] hover:bg-[#526D82] transition-colors 
              duration-300 ease-in-out mt-3 text-3xl"
            >
              +
            </button>
          </Link>
        <ChatroomList />
      </div>
    </div>
  );
};


export default Sidebar;
