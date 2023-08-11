"use client";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";

const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewProfilePictureInput, setShowNewProfilePictureInput] =
    useState(false);
  const [showAboutMeInput, setShowAboutMeInput] = useState(false);
  const [aboutMeText, setAboutMeText] = useState("");

  useEffect(() => {
    if (currentUser) {
      // Fetch user data from the server for the logged-in user
      fetch(`/api/user/${currentUser.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          setAboutMeText(data.aboutMe || "");
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [currentUser]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleProfilePictureInput = () => {
    setShowNewProfilePictureInput((prevShow) => !prevShow);
  };

  const handleUpdateProfilePicture = () => {
    // Make a PUT request to update the profile picture
    fetch(`/api/user/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profilePicture: newProfilePicture,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the userData state with the updated profile picture
        setUserData((prevUserData) => ({
          ...prevUserData,
          profilePicture: newProfilePicture,
        }));
        // Clear the input field after successful update
        setNewProfilePicture("");
      })
      .catch((error) =>
        console.error("Error updating profile picture:", error)
      );
  };

  const handleToggleAboutMeInput = () => {
    setShowAboutMeInput((prevShow) => !prevShow);
  };

  const handleSaveAboutMe = () => {
    // Make a PUT request to update the "About Me" text
    fetch(`/api/user/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aboutMe: aboutMeText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the userData state with the updated "About Me" text
        setUserData((prevUserData) => ({
          ...prevUserData,
          aboutMe: aboutMeText,
        }));
        setShowAboutMeInput(false);
      })
      .catch((error) => console.error("Error updating 'About Me':", error));
  };

  const handleCancelAboutMe = () => {
    // Reset the 'About Me' text to the original value from the server
    setAboutMeText(userData.aboutMe || "");
    setShowAboutMeInput(false);
  };

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
                className="rounded-full mr-4 cursor-pointer"
                onClick={handleToggleProfilePictureInput} // Show the input when clicked
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
            {showNewProfilePictureInput && (
              <input
                type="text"
                className="p-3 mt-4 border rounded w-full"
                placeholder="New Profile Picture URL"
                value={newProfilePicture}
                onChange={(e) => setNewProfilePicture(e.target.value)}
              />
            )}
            {showNewProfilePictureInput && (
              <button
                type="button"
                className="bg-blue-500 text-white py-1 px-2 mt-4 rounded hover:bg-blue-600"
                onClick={handleUpdateProfilePicture}
              >
                Update Profile Picture
              </button>
            )}

            <div className="text-[18px] mt-6">
              {showAboutMeInput ? (
                <>
                  <textarea
                    className="p-3 border rounded w-full"
                    value={aboutMeText}
                    onChange={(e) => setAboutMeText(e.target.value)}
                    rows={4}
                  />
                  <div className="flex mt-4">
                    <button
                      type="button"
                      className="bg-blue-500 text-white py-1 px-2 mr-4 rounded hover:bg-blue-600"
                      onClick={handleSaveAboutMe}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                      onClick={handleCancelAboutMe}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>About me:</p>
                  <p>
                    {userData.aboutMe ? userData.aboutMe : "No content yet."}
                  </p>
                  <button
                    type="button"
                    className="mt-4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                    onClick={handleToggleAboutMeInput}
                  >
                    Edit About Me
                  </button>
                </>
              )}
            </div>
          </>
        ) : // If the user is not logged in, then say so.
        !currentUser ? (
          <div className = "text-xl">
            <p>Not Logged In</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
