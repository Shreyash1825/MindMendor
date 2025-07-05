"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "@/Database/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify"; // Make sure react-toastify is correctly installed and configured for JS
import { DNA } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateAdminCredentials = async (email, password) => { // Removed type annotations
    try {
      // Query the admin collection to verify credentials
      const adminRef = collection(firestore, "admin");
      const q = query(adminRef, where("email", "==", email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { isValid: false, message: "Admin account not found!" };
      }

      // Get the admin document
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      // Check if password matches (you might want to hash passwords in production)
      // IMPORTANT: In a production environment, you should NEVER compare plain passwords like this.
      // Passwords should be hashed (e.g., using bcrypt) and compared securely.
      if (adminData.password !== password) {
        return { isValid: false, message: "Invalid password!" };
      }

      // Check if admin account is active
      if (adminData.status && adminData.status !== "active") {
        return { isValid: false, message: "Admin account is not active!" };
      }

      return {
        isValid: true,
        adminData: {
          id: adminDoc.id,
          ...adminData,
        },
      };
    } catch (error) { // Removed type annotation
      console.error("Error validating admin credentials:", error);
      return { isValid: false, message: "Error validating credentials. Please try again." };
    }
  };

  const handleAdminLogin = async (e) => { // Removed type annotation 'React.FormEvent'
    e.preventDefault();
    setLoading(true);

    try {
      // First validate admin credentials against Firestore
      const validation = await validateAdminCredentials(email, password);

      if (!validation.isValid) {
        toast.error(validation.message, {
          position: "top-center",
        });
        setLoading(false);
        return;
      }

      // If credentials are valid, proceed with Firebase Auth
      // Note: You might want to use a separate Firebase Auth instance for admin
      // or handle admin authentication differently
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (authError) { // Removed ': any'
        // If Firebase Auth fails but Firestore validation passed,
        // you might want to create the user in Firebase Auth or handle differently
        console.log("Firebase Auth error:", authError.message);

        if (authError.code === "auth/user-not-found") {
          // Admin exists in Firestore but not in Firebase Auth
          // You can either create the user or use a different auth method
          toast.error("Admin authentication setup required. Please contact system administrator.", {
            position: "top-center",
          });
          setLoading(false);
          return;
        }
      }

      // Store admin session data
      localStorage.setItem(
        "adminSession",
        JSON.stringify({
          adminId: validation.adminData?.id,
          email: email,
          loginTime: Date.now(),
          role: "admin",
        }),
      );

      console.log("Admin Login Successful");
      toast.success("Admin Login Successful!", {
        position: "top-center",
      });

      // Redirect to admin dashboard
      navigate("/MindMendor/admin/");
    } catch (error) { // Removed ': any'
      console.error("Login Error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      }

      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 py-2 px-6 rounded-lg flex flex-col items-center z-50">
          <DNA visible={true} height="80" width="80" ariaLabel="dna-loading" />
          <p className="text-white mt-2">Authenticating...</p>
        </div>
      )}

      <div className="bg-[#212121] text-white h-[100vh] px-2 md:px-40 py-10 flex flex-col justify-center items-center">
        <p className="font-semibold text-3xl text-center mb-1">
          Admin <span className="text-[#1479EA]">Login</span>
        </p>
        <div className="container text-justify lg:px-40 py-8 w-full md:w-[60%] flex flex-col gap-15 justify-center items-center">
          <form className="box form__group field py-10 px-10 w-full flex flex-col gap-14" onSubmit={handleAdminLogin}>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Admin Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLogin;