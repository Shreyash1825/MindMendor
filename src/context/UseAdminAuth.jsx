"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/Database/Firebase";

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState(null); // Removed <AdminData | null>
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdminSession = () => {
      const adminSession = localStorage.getItem("adminSession");
      if (adminSession) {
        try {
          const sessionData = JSON.parse(adminSession);
          const now = Date.now();
          const sessionAge = now - sessionData.loginTime;
          const maxAge = 8 * 60 * 60 * 1000; // 8 hours

          if (sessionAge < maxAge) {
            setAdmin(sessionData);
            setIsAuthenticated(true);
          } else {
            // Session expired
            localStorage.removeItem("adminSession");
          }
        } catch (error) {
          console.error("Error parsing admin session:", error);
          localStorage.removeItem("adminSession");
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if this user is an admin
        try {
          const adminRef = doc(firestore, "admin", user.uid);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            const adminData = adminSnap.data();
            setAdmin({
              id: user.uid,
              email: user.email || "",
              ...adminData,
            });
            setIsAuthenticated(true);
          } else {
            // User is authenticated but not an admin
            checkAdminSession();
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          checkAdminSession();
        }
      } else {
        checkAdminSession();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    localStorage.removeItem("adminSession");
    setAdmin(null);
    setIsAuthenticated(false);
  };

  return {
    admin,
    loading,
    isAuthenticated,
    logout,
  };
};