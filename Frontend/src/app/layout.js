import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./contexts/AuthContext";

//const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "ChitChat",
  description: "A forum based social media platform.",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="h-screen" id="dynamic_page">
          <div className="flex">
            <Sidebar />
            <div className="flex flex-col w-5/6 ml-auto z-20">
              <div>
                <Navbar />
              </div>
              <div className="flex flex-col flex-1 mt-20 min-h-screen pb-20 overflow-y-auto">{children}</div>
            </div>
          </div>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
