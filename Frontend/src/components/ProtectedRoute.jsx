"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    router.push("/login");
    return;
  }

  return children;
}
