import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "@/Database/Firebase";

const UserContext = createContext(null); // ✅ Set default value to null

export const UserProvider = ({ children }) => {
  const [therapistName, setTherapistName] = useState("Therapist");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userRef = doc(firestore, "Therapists", uid); // ✅ Reference to therapist doc
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setTherapistName(userData.name);
          setEmail(userData.email); // ✅ Store therapist email
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setTherapistName("Therapist");
        setEmail(""); // Reset on logout
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ therapistName, email }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Ensure useUser() is only used inside UserProvider
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
