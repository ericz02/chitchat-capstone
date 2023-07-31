import Image from "next/image";
import { FaHome, FaCog, FaMailBulk, FaComments } from "react-icons/fa";
import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="flex-none bg-[#27374D] w-1/6 p-4 fixed h-full z-20">
      <div className="flex flex-col items-center justify-center">
        
        <Link href="/">
          <Image
            className="m-auto"
            src={chitchatLogo}
            alt="Company Logo"
            height={150}
            width={150}
          />
        </Link>

        <div className="flex flex-col items-left justify-center">
          <Link href="/">
            <div className="flex items-center mt-4 ml-4 text-[24px] text-white self-start">
              <FaHome style={{ marginRight: "8px" }} size={24} /> Home{" "}
            </div>
          </Link>

          <Link href="/settings">
            <div className="flex items-center mt-4   ml-4 text-[24px] text-white self-start">
              <FaCog style={{ marginRight: "8px" }} size={24} /> Settings{" "}
            </div>
          </Link>

          <Link href="/contact">
            <div className="flex items-center mt-4 ml-4 text-[24px] text-white self-start">
              <FaMailBulk style={{ marginRight: "8px" }} size={24} /> Contact Us{" "}
            </div>
          </Link>
        </div>

        {/* TODO: Wrap in link component to chitchatrooms */}
        <div className="flex items-center mt-36 text-[20px] text-white self-center">
          <FaComments style={{ marginRight: "8px" }} size={24} /> ChitChatRooms{" "}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
