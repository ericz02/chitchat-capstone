import { useEffect, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DropdownForm = ({ darkMode, setDarkMode }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleDarkModeToggle = () => {
    if(!currentUser){
      router.push("/login");
      return
    }
    
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const handleLoginLogoutToggle = () => {
    // Add your logic here for handling login/logout
    if (currentUser) {
      // If the user is logged in, perform logout
      logout();
      router.push("/");
      return;
    } else {
      // If the user is not logged in, redirect to the login page
      // You can add the appropriate route for the login page below
      // Replace "/login" with your actual login page route
      router.push("/login");
      return;
    }
  };

  // let background = document.getElementById("dynamic_page");

  // useEffect(() => {
  //   if (darkMode) {
  //     background.classList.add("bg-gray-500");
  //   } else {
  //     background.classList.remove("bg-gray-500");
  //   }
  // }, [darkMode]);

  return (
    <div className="flex flex-col space-y-4 " >
      {/* Dark Mode Switch */}
      <div className="flex items-center justify-between">
        <label htmlFor="darkModeSwitch" className="text-gray-800">
          {darkMode ? "Dark Mode" : "Light Mode"}
        </label>

        <button
          id="darkModeSwitch"
          className={`w-12 h-6 flex items-center rounded-full p-1 ml-3 ${
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
        {currentUser ? "Logout" : "Login"}
      </button>
    </div>
  );
};

export default DropdownForm;
