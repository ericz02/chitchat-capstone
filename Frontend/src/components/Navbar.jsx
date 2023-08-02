'use client'
import { BiSearch } from "react-icons/bi";
import { useState } from "react";
import Modal from "../ui/Modal";
import DropdownForm from "./DropDownForm";

const Navbar = () => {
  const handleLogoClick = () => {
    // Add your logic here for what should happen when the logo is clicked
    // For example, you can navigate to a different page using 'window.location.href'
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };
  
  return (
 
    <div className=" bg-[#526D82] py-4 fixed w-5/6">
      <div className="  flex flex-col md:flex-row items-center justify-between text-white px-4  ">
        <div className="relative flex items-center mb-2 md:mb-0 mx-auto md:mr-auto">
          <BiSearch className="text-white absolute left-4" size={20} />
          <input
            type="search"
            className="p-3 pl-10 w-[400px] md:w-auto bg-transparent rounded-[10px] border border-gray-300 dark:bg-transparent dark:border 
              border-l-gray-700 dark:border-gray-400 dark:placeholder-gray-100 dark:text-white outline-none "
            placeholder="Search Communities, Posts, Users..."
            required
          />
        </div>
        {/* Clickable Image need an onClick event */}
        <a href="#" className="ml-4 md:ml-0 md:mr-8" onClick={showModal}> 
          <img
            src="next.svg" // Replace with the actual image path
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full cursor-pointer border-black border-2"
          />
        </a>
      </div>
      <Modal isVisible={isModalVisible} hideModal={hideModal}>
      <DropdownForm darkMode={darkMode} setDarkMode={setDarkMode}  />
      </Modal>
    </div>
  
  );
};

export default Navbar;
