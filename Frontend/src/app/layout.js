import "./globals.css";
//import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

//const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChitChat",
  description: "A forum based social media platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='h-screen' id='dynamic_page'>
        <div className="flex">
          <Sidebar />
          <div className="flex flex-col w-5/6 ml-auto">
            <div>
              <Navbar />
            </div>
            <div className="flex flex-col flex-1 mt-20">{children}</div>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}