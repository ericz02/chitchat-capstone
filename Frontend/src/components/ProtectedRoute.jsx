"use client";
import { useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return (window.location.href = "/login");
  }

  return children;
}
