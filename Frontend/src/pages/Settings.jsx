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
    <div className="bg-[#F5F7FA] p-4 flex justify-center min-h-screen">
      <div className="bg-white p-8 h-[560px] rounded-md shadow-md w-2/3 my-6 cursor-pointer">
        {userData ? (
          <>
            <div className="flex flex-row items-center mb-6">
              <img
                src={userData.profilePicture} // Replace with the actual image path
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full mr-4"
              />
              <div className="text-[18px] font-semibold">
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

            <div className="text-[20px]">
              <p>About me:</p>
              <p>{userData.aboutMe ? userData.aboutMe : "No content yet."}</p>
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
