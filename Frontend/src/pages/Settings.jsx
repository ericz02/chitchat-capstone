"use client";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";

const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      // Fetch user data from the server for the logged-in user
      fetch(`http://localhost:4000/user/${currentUser.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [currentUser]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  console.log(userData);

  return (
    <div className="bg-[#FFFFFF] p-4 flex justify-center">
      <div className="bg-[#DDE6ED] p-[60px] rounded-md shadow-md w-2/3 pr-5 my-6 cursor-pointer flex justify-space">
        {userData ? (
          <>
            <div className="flex flex-row justify-evenly">
              <div>
                <img
                  src={userData.profilePicture} // Replace with the actual image path
                  alt="Logo"
                  width={100}
                  height={100}
                  className="rounded-full cursor-pointer"
                />
              </div>

              <div className="text-[16px]">
                <p>My Username: {userData.userName}</p>
                <p>My Email: {userData.email}</p>
                <p>
                  My Password: {showPassword ? userData.password : "********"}
                  <button
                    type="button" // Add this to prevent the button from triggering form submission
                    className="ml-2 underline text-blue-500"
                    onClick={handleTogglePasswordVisibility}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </p>
              </div>
            </div>
          </>
        ) : ( 
          //if the user is not logged in then say so.
          (!currentUser? <><p>Not Logged In</p></> : <p>Loading user data...</p>)
        )}
      </div>
    </div>
  );
};

export default Settings;
