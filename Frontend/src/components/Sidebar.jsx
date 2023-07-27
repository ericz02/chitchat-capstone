import Image from "next/image";
import { FaHome, FaCog, FaMailBulk, FaComments } from "react-icons/fa";
import chitchatLogo from "../public/images/chitchat.png";

const Sidebar = () => {
  return (
    <div className="flex-none bg-[#27374D] w-1/6 p-4 fixed h-full z-20">
      <Image
        className="m-auto"
        src={chitchatLogo}
        alt="Company Logo"
        height={150}
        width={150}
      />

      <div className="flex items-center mt-4 ml-5 text-[24px] text-white">
        <FaHome style={{ marginRight: "12px" }} size={24} /> Home {/* Updated the size prop */}
      </div>

      <div className="flex items-center mt-4 ml-5 text-[24px] text-white">
        <FaCog style={{ marginRight: "12px" }} size={24} /> Settings {/* Updated the size prop */}
      </div>

      <div className="flex items-center mt-4 ml-5 text-[24px] text-white">
        <FaMailBulk style={{ marginRight: "12px" }} size={24} /> Contact Us {/* Updated the size prop */}
      </div>

      <div className="flex items-center mt-36 ml-5 text-[20px] text-white">
        <FaComments style={{ marginRight: "12px" }} size={24} /> ChitChatRooms {/* Updated the size prop */}
      </div>
    </div>
  );
}

export default Sidebar;
