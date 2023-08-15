"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./contexts/AuthContext";
import { useEffect, useState } from "react";
//const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "ChitChat",
  description: "A forum based social media platform.",
};

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false); // Set an initial value

  useEffect(() => {
    // Fetch the darkMode value from localStorage only on client-side
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-500");
    } else {
      document.body.classList.remove("bg-gray-500");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`bg-[#cee2ff] ${darkMode ? "bg-gray-500" : ""}`}
          id="dynamic_page"
        >
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col w-5/6 ml-auto relative">
              <div>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
              </div>
              <div className="flex flex-col flex-1 mt-20 overflow-y-auto pb-16">
                {children}
              </div>
              <div className="">
              <Footer />
              </div>
            </div>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
