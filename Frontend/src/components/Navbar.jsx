'use client';
import { BiSearch } from "react-icons/bi";
import chitchatLogo from "../public/images/chitchat.png"
import { useState } from "react";
import Modal from "../ui/Modal";

const Navbar = () => {
  const handleLogoClick = () => {
   
    // Add your logic here for what should happen when the logo is clicked
    // For example, you can navigate to a different page using 'window.location.href'
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };
  
  return (
    <div className="bg-[#526D82] py-4 fixed w-5/6">
      <div className="flex items-center justify-end text-white px-4">
        <div className="relative flex items-center ">
          <BiSearch className="text-white absolute left-4 " size={20} />
          <input
            type="search"
            className="p-3 pl-10 w-[400px] bg-transparent rounded-[10px] border border-gray-300 dark:bg-transparent dark:border 
              border-l-gray-700 dark:border-gray-400 dark:placeholder-gray-100 dark:text-white outline-none"
            placeholder="Search Communities, Posts, Users..."
            required
          />
        </div>
        {/* Clickable Image need an onClick event */}
        <a href="#" className="ml-4 ms-96 mr-8 pl-24" onClick={showModal}> 
          <img
            src={chitchatLogo} //should be session users profile pic
            alt="Logo"
            width={40} 
            height={40}
            className="rounded-full cursor-pointer"
          />
        </a>
      </div>
      <Modal isVisible={isModalVisible} hideModal={hideModal}>
   </Modal>

    </div>
  );
};

export default Navbar;


