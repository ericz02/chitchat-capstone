"use client";

import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../app/contexts/AuthContext";


const SignUp = () => {
  const router = useRouter();
  const{signup,currentUser,authError} = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the user data to send to the server
    const userData = {
      firstName,
      lastName,
      userName,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Redirect to the login page after successful signup
        router.push("/");
      } else {
        // Handle signup error
        console.error("Signup failed.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="bg-[#cee2ff] p-10">
      <Link href="/">
        <Image
          className="m-auto"
          src={chitchatLogo}
          alt="Company Logo"
          height={200}
          width={200}
        />
      </Link>

      <div className="bg-white mx-56 mb-20 px-24 py-10 ">
        <div>
          <h2 className="flex justify-center text-2xl font-bold mb-4 mt-3">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <input
                className="w-64 h-10 bg-[#E6E6E6] boarder rounded p-2"
                type="text"
                placeholder="First Name:"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="w-64 h-10 bg-[#E6E6E6] boarder rounded p-2"
                type="text"
                placeholder="Last Name:"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <input
                className="w-full h-10 border rounded bg-[#E6E6E6] mt-3 p-2"
                type="text"
                placeholder="Username: "
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <input
                className="w-full h-10 border rounded bg-[#E6E6E6] mt-3 p-2"
                type="email"
                placeholder="Email: "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                className="w-full h-10 border rounded bg-[#E6E6E6] mt-3 p-2"
                type="password"
                placeholder="Password: "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col p-4">
              <div className="flex justify-center">
                <button className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1">
                  Sign Up
                </button>
              </div>
              <Link href="/login" className="flex justify-center">
                <button className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1">
                  Log In
                </button>
              </Link>
            </div>
          </form>

          <p className="flex justify-center">Already have an account?</p>
          <Link href="/login" className="text-blue-600 flex justify-center">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
