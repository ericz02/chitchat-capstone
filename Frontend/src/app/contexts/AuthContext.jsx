"use client";
import { useState, createContext, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsAuthChecked(false);

      try {
        const response = await fetch("/api/auth/current_user");
        const { user } = await response.json();

        setCurrentUser(user);
      } catch (error) {
        console.error(error);
        setCurrentUser(null);
      }
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, []);

  const signup = async (credentials) => {
    setIsAuthChecked(false);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        //const { user } = await response.json();
        router.push("/login");
        setAuthError(null);
      } else if (response.status === 422) {
        const errorData = await response.json();
        const errorMessage = errorData.errors.join(", "); // Join the errors into a single string
        setCurrentUser(null);
        setAuthError(errorMessage);
      } else {
        const errorData = await response.json();
        setAuthError(errorData.message);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error(error);
      setCurrentUser(null);
      setAuthError(error.message);
    }

    setIsAuthChecked(true);
  };

  const login = async (credentials) => {
    setIsAuthChecked(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const { user } = await response.json();
        setCurrentUser(user);
        setAuthError(null);
      } else {
        setCurrentUser(null);
        const errorData = await response.json();
        setAuthError(errorData.message);
      }

      setIsAuthChecked(true);
    } catch (err) {
      setCurrentUser(null);
      setAuthError(err.message);
    }

    setIsAuthChecked(true);
  };

  const logout = async () => {
    setIsAuthChecked(false);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "DELETE",
      });

      if (response.ok) {
        setCurrentUser(null);
        setAuthError(null);
      } else {
        const errorData = await response.json();
        setAuthError(errorData.message);
      }
    } catch (err) {
      setAuthError(err.message);
    }

    setIsAuthChecked(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthChecked,
        authError,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
