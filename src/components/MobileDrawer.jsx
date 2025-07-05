import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const MobileDrawer = ({ isOpen, setIsOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollContact = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/MindMendor/") {
      setIsOpen(false);
      window.scroll({
        top: 5200, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 5200, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleScrollHome = (event) => {
    event.preventDefault();
    setIsOpen(false);
    navigate("/MindMendor/");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  const handleResearchClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/MindMendor/") {
      setIsOpen(false);
      window.scroll({
        top: 1500, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 1500, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleLoginClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    if (location.pathname === "/MindMendor/") {
      setIsOpen(false);
      window.scroll({
        top: 700, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 700, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleAboutClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/MindMendor/") {
      setIsOpen(false);
      window.scroll({
        top: 2600, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 2600, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleUiClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/MindMendor/ui") {
      setIsOpen(false);
      window.scroll({
        top: 0, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/ui"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`md:hidden ${isOpen ? "block bg-gray-900 shadow-md" : "hidden"}  w-full h-full`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link
          onClick={handleScrollHome}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Home
        </Link>
        <Link
          onClick={handleUiClick}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Ui
        </Link>
        <Link
          onClick={handleResearchClick}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Research Paper
        </Link>
        <Link
          onClick={handleLoginClick}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Login / Register
        </Link>
        <Link
          onClick={handleAboutClick}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          About Us
        </Link>
        <Link
          onClick={handleScrollContact}
          className="text-white hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default MobileDrawer;
