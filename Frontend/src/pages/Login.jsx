"use client";

import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../app/contexts/AuthContext";

const Login = () => {
  const { currentUser, login, authError } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);
    await login(credentials);
  };

  return (
    <div className="bg-[#cee2ff] p-2 mt-5 flex flex-col justify-center items-center min-h-screen ">
      <Link href="/">
        <Image
          className="m-auto"
          src={chitchatLogo}
          alt="Company Logo"
          height={140}
          width={140}
        />
      </Link>

      <div className="bg-[#DDE6ED] mx-52 mb-52 pb-3 px-40 py-0 rounded-md shadow-md border border-gray-700 border-1">
        <div className="flex flex-col justify-center my-[40px] mx-10 ">
          <h2 className="flex justify-center text-2xl font-bold mx-16">
            Login to your account
          </h2>
          <form onSubmit={handleLogin} method="post">
            <div className="flex">
              <input
                className="w-full h-10 border border-1 border-gray-700 rounded bg-white mt-3 p-2"
                type="email"
                name="email"
                placeholder="Email: "
              />
            </div>
            <div>
              <input
                className="w-full h-10  border border-1 border-gray-700  rounded bg-white mt-3 p-2"
                type="password"
                name="password"
                placeholder="Password: "
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm text-center">{authError}</p>
            )}
            <Link href="/forgot" className="text-blue-600">
              <p className="flex justify-end m-2">Forgot Password?</p>
            </Link>

            <div className="flex flex-col p-4 ">
              <div className="flex justify-center">
                <button className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1">
                  Log in
                </button>
              </div>
            </div>
          </form>
        </div>
        <p className="flex justify-center">Don't have an account?</p>
        <Link href="/signup" className="text-blue-600 flex justify-center">
          Sign Up
        </Link>
      </div>
    </div>
  );
};
export default Login;
