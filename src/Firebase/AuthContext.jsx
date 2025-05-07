/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// Firebase/AuthContext.js

// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "/home/aman-kumar-chhari/Desktop/MERN/projects/Varta_laab-/forum/src/Firebase/Firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // ✅ Auth check done
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading authentication...</div>; // Optional: Replace with a spinner or animation
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
