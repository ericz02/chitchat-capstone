"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const authContext = useContext(AuthContext); //this is to get the current user that is creating the chatroom
  const currentUser = authContext ? authContext.currentUser : null;
  const router = useRouter();
  if (!currentUser) {
    router.push("/login");
  }

  return children;
}
