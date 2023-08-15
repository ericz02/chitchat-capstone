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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-500");
    } else {
      document.body.classList.remove("bg-gray-500");
    }

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
              <Footer />
            </div>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
