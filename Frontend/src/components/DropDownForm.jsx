'use client'
import { useState, useEffect } from "react";


const DropdownForm = ({ darkMode, setDarkMode }) => {
    const [loggedIn, setLoggedIn] = useState(true);
  
    const handleDarkModeToggle = () => {
      setDarkMode((prevDarkMode) => !prevDarkMode);
    };
  
    const handleLoginLogoutToggle = () => {
      // Add your logic here for handling login/logout
      setLoggedIn((prevLoggedIn) => !prevLoggedIn);
    };
    let background = document.getElementById('dynamic_page')
    useEffect(() => {
        if (darkMode) {
            background.classList.add('bg-black')
        } else {
            background.classList.remove('bg-black')
        }
    }, [darkMode])
   
    return (
      <div className="flex flex-col space-y-4">
        {/* Dark Mode Switch */}
        <div className="flex items-center justify-between">
          <label htmlFor="darkModeSwitch" className="text-gray-800">
            {darkMode ? "Dark Mode" : "Light Mode"}
          </label>
          
          <button
            id="darkModeSwitch"
            className={`w-12 h-6 flex items-center rounded-full p-1 ${
              darkMode ? "bg-gray-700" : "bg-yellow-500"
            }`}
            onClick={handleDarkModeToggle}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
        
          </button>
        </div>
  
        {/* Login/Logout Toggle */}
        <button
          onClick={handleLoginLogoutToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loggedIn ? "Logout" : "Login"}
        </button>
      </div>
    );
  };
  
  export default DropdownForm;
  
  
  