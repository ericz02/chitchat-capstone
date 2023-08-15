"use client";

import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../app/contexts/AuthContext";

const SignUp = () => {
  //get the signup funciton, the current user and the error {if any occur during fetch}
  const authContext = useContext(AuthContext); //this is to get the current user that is creating the chatroom
  const currentUser = authContext ? authContext.currentUser : null;
  const signup = authContext ? authContext.signup : null;
  const authError = authContext ? authContext.authError : null;
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/login");
    }
  }, []);
  /*   if (currentUser) {
    router.push("/login");
  } */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);
    await signup(credentials);
  };

  return (
    <div className="bg-[#cee2ff] flex flex-col justify-center items-center min-h-screen p-2 mt-5 ">
      <Link href="/">
        <Image
          className="m-auto mt-20"
          src={chitchatLogo}
          alt="Company Logo"
          height={200}
          width={200}
        />
      </Link>

      <div className="bg-[#DDE6ED] rounded-md shadow-md border-gray-700 border-1 border mx-52 mb-52 px-40 pt-6 pb-5 ">
        <div className="flex flex-col justify-center ">
          <h2 className=" text-2xl font-bold justify-center mx-40  ">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} method="post">
            <div>
              <input
                className="w-full h-10 border rounded bg-white mt-3 p-2"
                type="text"
                placeholder="First Name:"
                name="firstName"
              />
            </div>
            <div>
              <input
                className="w-full h-10 border rounded bg-white mt-3 p-2"
                type="text"
                placeholder="Last Name:"
                name="lastName"
              />
            </div>
            <div>
              <input
                className="w-full h-10 border rounded bg-white mt-3 p-2"
                type="text"
                placeholder="Username: "
                name="userName"
              />
            </div>
            <div>
              <input
                className="w-full h-10 border rounded bg-white mt-3 p-2"
                type="email"
                placeholder="Email: "
                name="email"
              />
            </div>
            <div>
              <input
                className="w-full h-10 border rounded bg-white mt-3 p-2"
                type="password"
                placeholder="Password: "
                name="password"
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm text-center">{authError} </p>
            )}
            <div className="flex flex-col p-4">
              <div className="flex justify-center">
                <button className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1">
                  Sign Up
                </button>
              </div>
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
