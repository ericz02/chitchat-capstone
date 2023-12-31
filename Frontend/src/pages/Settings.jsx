"use client";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Settings = () => {
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewProfilePictureInput, setShowNewProfilePictureInput] =
    useState(false);
  const [showAboutMeInput, setShowAboutMeInput] = useState(false);
  const [aboutMeText, setAboutMeText] = useState("");
  const [chatrooms, setChatrooms] = useState([]);
  const authContext = useContext(AuthContext); //this is to get the current user that is creating the chatroom
  const currentUser = authContext ? authContext.currentUser : null;
  const router = useRouter();
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, []);

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

  useEffect(() => {
    //get all of the chatrooms this user is a member of.
    const getChatrooms = async () => {
      try {
        const response = await fetch(`/api/user/${currentUser.id}/chatrooms`, {
          method: "GET",
        });
        const parsedChatrooms = await response.json();
        if (response.ok) {
          const chatroomsWithData = await Promise.all(
            parsedChatrooms.map(async (chatroom) => {
              const chatroomResponse = await fetch(
                `/api/chatrooms/${chatroom.ChatroomId}`,
                { method: "GET" }
              );
              const chatroomData = await chatroomResponse.json();
              return { ...chatroom, chatroomData: chatroomData };
            })
          );
          setChatrooms(chatroomsWithData);
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };
    if (currentUser) {
      getChatrooms();
    }
  }, [currentUser]);

  console.log("my chatrooms: ", chatrooms);

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
    <div className=" p-4 flex justify-center  ">
      <div className="bg-stone-100	p-8 rounded-md shadow-md w-2/3 my-6 h-fit">
        {userData ? (
          <div>
            <div className="flex flex-row items-center mb-6">
              <img
                src={userData.profilePicture} // Replace with the actual image path
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full mr-4 cursor-pointer hover:scale-110"
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
                className="p-3 mt-4 border border-gray-800  border-2 rounded w-full"
                placeholder="New Profile Picture URL"
                value={newProfilePicture}
                onChange={(e) => setNewProfilePicture(e.target.value)}
              />
            )}
            {showNewProfilePictureInput && (
              <button
                type="button"
                className="bg-blue-500 text-[13px] text-white py-1 px-2 mt-4 rounded hover:bg-blue-600"
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
                <div className="border-black border-2 rounded-md p-4 m-2 ">
                  <p>About me:</p>
                  <p className="text-[15px] text-gray-500">
                    {userData.aboutMe ? userData.aboutMe : "No content yet."}
                  </p>
                  <button
                    type="button"
                    className="mt-4 bg-blue-500 text-white py-1 px-2 text-[15px] rounded hover:bg-blue-600"
                    onClick={handleToggleAboutMeInput}
                  >
                    Edit About Me
                  </button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-center m-4 font-bold text-xl">
                My Chatrooms
              </h3>
              {chatrooms.map((chatroom) => (
                <Link href={`/chatroom/${chatroom.ChatroomId}`}>
                  <div className="border-gray-400 border-2 m-6 p-2 rounded-md shadow-lg shadow-slate-300 hover:scale-105  ">
                    <div className="flex text-indigo-700 justify-center text-xl underline font-semibold">
                      {chatroom.chatroomData.chatroomName}
                    </div>
                    <div className="flex justify-center text-sm">
                      <p className="mr-1 text-blue-400">role:</p>
                      <p>{chatroom.role}</p>
                      {/* role: {chatroom.role} */}
                    </div>
                    <div className="flex justify-center text-sm">
                      <p className="mr-1 text-blue-400">description:</p>
                      <p>{chatroom.chatroomData.chatroomDescription}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : // If the user is not logged in, then say so.
        !currentUser ? (
          <div className="text-xl text-red-700">
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
