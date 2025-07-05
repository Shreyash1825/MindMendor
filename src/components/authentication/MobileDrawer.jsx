import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const MobileDrawer = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollHome = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/MindMendor/") {
      setIsOpen(false);
      window.scroll({
        top: 0, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleUserLogin = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
    navigate("/MindMendor/userlogin"); // Redirect to home
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
    }, 100); // Normal About Us navigation
  };

  const handleUserRegister = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
    navigate("/MindMendor/userregister"); // Redirect to home
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
    }, 100); // Normal About Us navigation
  };

  const handleTherapistLogin = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
    navigate("/MindMendor/therapistlogin"); // Redirect to home
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
    }, 100); // Normal About Us navigation
  };

  const handleTherapistRegister = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
    navigate("/MindMendor/therapistregister"); // Redirect to home
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
    }, 100); // Normal About Us navigation
  };

  return (
    <div
      className={`md:hidden ${
        isOpen ? "block" : "hidden"
      } bg-gray-900 w-full h-full`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link
          onClick={handleScrollHome}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Home
        </Link>
        <Link
          onClick={handleUserLogin}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          User Login
        </Link>
        <Link
          onClick={handleUserRegister}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          User Register
        </Link>
        <Link
          onClick={handleTherapistLogin}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Therapist Login
        </Link>
        <Link
          onClick={handleTherapistRegister}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Therapist Register
        </Link>
      </div>
    </div>
  );
};

export default MobileDrawer;
