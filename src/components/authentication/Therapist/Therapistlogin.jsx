import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Authenticateheader from "../Authenticateheader";
import Footer from "../../Footer";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Database/Firebase";
import { toast } from "react-toastify";
import { DNA } from "react-loader-spinner";

function Therapistlogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTherapistLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Therapist Login Successful");
        toast.success("Login Successfully!", {
          position: "top-center",
        });
  
        // ✅ Redirect to /MindMendor/ui after successful login
        navigate("/MindMendor/therapist/");
      } catch (error) {
        console.log("Error:", error.message);
        toast.error(error.message, {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };
  

  return (
    <div>
      <Authenticateheader />
      {loading && (
              <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 py-2 px-6 rounded-lg flex flex-col items-center z-50">
                <DNA visible={true} height="80" width="80" ariaLabel="dna-loading" />
                <p className="text-white mt-2">Processing...</p>
              </div>
            )}
      <div className="bg-[#212121] text-white h-screen px-2 md:px-40 py-10 flex flex-col justify-center items-center">
        <p className="font-semibold text-3xl text-center mb-1">
          Therapist <span className="text-[#1479EA]">Login</span>
        </p>
        <div className="container text-justify lg:px-40 py-8 w-[100%] md:w-[60%] flex flex-col gap-15 justify-center items-center">
          <form
            className="box form__group field py-10 px-10 w-full flex flex-col gap-14"
            onSubmit={handleTherapistLogin}
            method="POST"
          >
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

export default Therapistlogin;
