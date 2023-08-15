import React from "react";
import chitchatlogo from '../public/images/chitchat.png'
import Image from "next/image";
export default function Loading() {
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-950">
      <div className="text-center">
        <Image src={chitchatlogo} alt="Floating Image" className="animate-float w-32 h-32 mx-auto" />
        <p className="mt-4">Loading...</p>
        <div className="mt-2">
          <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-gray-500 mx-1"></div>
        </div>
      </div>
    </div>
  );
}
