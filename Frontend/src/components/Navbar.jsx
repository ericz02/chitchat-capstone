"use client";

import { BiSearch } from "react-icons/bi";
import { useState, useContext } from "react";
import Modal from "../ui/Modal";
import DropdownForm from "./DropDownForm";
import { AuthContext } from "@/app/contexts/AuthContext"; // Import the AuthContext
import SearchBar from "./SearchBar";
const Navbar = ({ darkMode, setDarkMode }) => {
  const { currentUser } = useContext(AuthContext); // Access the currentUser from the AuthContext

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="bg-[#526D82] py-4 fixed w-5/6 z-10">
      <div className="flex flex-shrink-0 md:flex-row items-center text-blue px-4 pl-24">
        <div className="flex items-center justify-center ml-auto">
          <SearchBar />
        </div>
        <div className="flex items-center ml-auto">
          {currentUser ? (
            <a href="#" className="ml-4 md:ml-0 md:mr-8" onClick={showModal}>
              <img
                src={currentUser.profilePicture}
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full cursor-pointer ml-1 hover:scale-105"
              />
            </a>
          ) : (
            <a href="#" className="ml-4 md:ml-0 md:mr-8" onClick={showModal}>
              <img
                src="/female-icon.png"
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full cursor-pointer ml-4 md:ml-0 md:mr-8"
              />
            </a>
          )}
        </div>
      </div>
      <Modal isVisible={isModalVisible} hideModal={hideModal} >
        <DropdownForm darkMode={darkMode} setDarkMode={setDarkMode}/>
      </Modal>
    </div>
  );
};

export default Navbar;
