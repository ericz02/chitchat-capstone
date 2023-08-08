"use client";

import { BiSearch } from "react-icons/bi";
import { useState, useContext } from "react";
import Modal from "../ui/Modal";
import DropdownForm from "./DropDownForm";
import Cookies from "js-cookie";
import { AuthContext } from "@/app/contexts/AuthContext"; // Import the AuthContext

const Navbar = () => {
  const { currentUser } = useContext(AuthContext); // Access the currentUser from the AuthContext

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
    <div className="bg-[#526D82] py-4 fixed w-5/6 z-30">
      <div className="flex flex-shrink-0 md:flex-row items-center justify-between text-white px-4 pl-24">
        <div className="relative flex items-center mb-2 md:mb-0 mx-auto md:mr-auto">
          <BiSearch className="text-white absolute left-4" size={20} />
          <input
            type="search"
            className="p-3 pl-10 w-full md:w-[400px] bg-transparent rounded-[10px] border border-gray-300 dark:bg-transparent dark:border border-l-gray-700 dark:border-gray-400 dark:placeholder-gray-100 dark:text-white outline-none"
            placeholder="Search Communities, Posts, Users..."
            required
          />
        </div>
        {currentUser ? (
          <div className="flex items-center">
            <a href="#" className="ml-4 md:ml-0 md:mr-8" onClick={showModal}>
              <img
                src={currentUser.profilePicture}
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full cursor-pointer ml-1"
              />
            </a>
          </div>
        ) : (
          <div className="flex items-center">
            <a href="#" className="ml-4 md:ml-0 md:mr-8" onClick={showModal}>
              <img
                src="/female-icon.png"
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full cursor-pointer ml-4 md:ml-0 md:mr-8"
              />
            </a>
          </div>
        )}
      </div>
      <Modal isVisible={isModalVisible} hideModal={hideModal}>
        <DropdownForm darkMode={darkMode} setDarkMode={setDarkMode} />
      </Modal>
    </div>
  );
};

export default Navbar;
