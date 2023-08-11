"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";


export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  if (!currentUser) {
    router.push("/login");
    return;
  }

  return children;
}
