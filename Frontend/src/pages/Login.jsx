"use client";

import chitchatLogo from "../public/images/chitchat.png";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Send the login credentials to the server
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // To include the session cookie
      });

      if (response.ok) {
        // Redirect to the login page after successful signup
        router.push("/");
      } else {
        // Handle signup error
        console.error("Signup failed.");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    // Check if the user is authenticated
    fetch("http://localhost:4000/auth/check-auth", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          // If user is already authenticated, navigate to the homepage
          router.nav("/");
        }
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, []);
  return (
    <div className="bg-[#cee2ff] p-2 ">
      <Link href="/">
        <Image
          className="m-auto"
          src={chitchatLogo}
          alt="Company Logo"
          height={140}
          width={140}
        />
      </Link>

      <div className="bg-white mx-52 mb-20 px-24 py-10 ">
        <div>
          <h2 className="flex justify-center text-2xl font-bold mb-4 mt-3">
            Login to your account
          </h2>
          <form onSubmit={handleLogin}>
            <div className="flex justify-between">
              <input
                className="w-full h-10  border rounded bg-[#E6E6E6] mt-3 p-2"
                type="email"
                placeholder="Email: "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                className="w-full h-10  border rounded bg-[#E6E6E6] mt-3 p-2"
                type="password"
                placeholder="Password: "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <Link href="/forgot" className="text-blue-600">
              <p className="flex justify-end m-2">Forgot Password?</p>
            </Link>

            <div className="flex flex-col p-4 ">
              <div className="flex justify-center">
                <button
                  className="bg-[#14AE5C] hover:bg-[#0F8B49] text-white font-bold py-2 px-4 rounded mx-3 w-1/2 my-1"
                  onClick={handleLogin}
                >
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
