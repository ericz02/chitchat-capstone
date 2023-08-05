// src/components/ProtectedRoute.jsx
'use client'
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from '../app/contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser, isAuthChecked } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (!isAuthChecked) {
      // You can show a loader or other UI while the authentication status is being checked
      return;
    }

    if (!currentUser) {
      router.push("/login"); // Replace "/login" with your login page URL
    }
  }, [currentUser, isAuthChecked, router]);

  // Render the protected content if the user is authenticated
  return isAuthChecked && currentUser ? children : null;
}



