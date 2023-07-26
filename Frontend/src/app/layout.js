import "./globals.css";
import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChitChat",
  description: "A forum based social media platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex">
          <div className="flex-col h-screen bg-[#27374D] w-1/6 p-4 z-10">
            <Sidebar />
          </div>

          <div className="flex flex-col w-full">
            <div className="flex items-center justify-end justify-center bg-[#526D82]">
              <Navbar />
            </div>

            <div className="">{children}</div>

            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
