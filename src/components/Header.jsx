import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isUiOpen, setIsUiOpen] = useState(false);
  const [isResearchOpen, setIsReasearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleAboutClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
    if (location.pathname === "/MindMendor") {
      window.scroll({
        top: 1950, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 1950, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleResearchClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
    if (location.pathname === "/MindMendor") {
      window.scroll({
        top: 1100, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 1100, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleUiClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
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

  const handleScrollContact = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
    if (location.pathname === "/MindMendor") {
      window.scroll({
        top: 3240, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 3240, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleLoginContact = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
    if (location.pathname === "/MindMendor") {
      window.scroll({
        top: 500, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/MindMendor/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 500, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleScrollHome = () => {
    setIsOpen(false);
    navigate("/MindMendor/");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isOpen ? "bg-gray-900 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link onClick={handleScrollHome}>
            <Logo />
          </Link>

          <div className="hidden md:block ml-10">
            <div className="flex items-baseline justify-between gap-5 space-x-4">
              <Link
                to="/MindMendor/"
                onClick={handleScrollHome}
                onMouseEnter={() => setIsHomeOpen(true)}
                onMouseLeave={() => setIsHomeOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Home
                <span
                  style={{ transform: isHomeOpen ? "scaleX(1)" : "scaleX(0)" }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-blue-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                onClick={handleUiClick}
                onMouseEnter={() => setIsUiOpen(true)}
                onMouseLeave={() => setIsUiOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Ui
                <span
                  style={{
                    transform: isUiOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-blue-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                onClick={handleResearchClick}
                onMouseEnter={() => setIsReasearchOpen(true)}
                onMouseLeave={() => setIsReasearchOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Research Paper
                <span
                  style={{
                    transform: isResearchOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-blue-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                onClick={handleLoginContact}
                onMouseEnter={() => setIsLoginOpen(true)}
                onMouseLeave={() => setIsLoginOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Login / Register
                <span
                  style={{
                    transform: isLoginOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-blue-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                onClick={handleAboutClick}
                onMouseEnter={() => setIsAboutOpen(true)}
                onMouseLeave={() => setIsAboutOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                About Us
                <span
                  style={{
                    transform: isAboutOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-blue-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                onClick={handleScrollContact}
                onMouseEnter={() => setIsContactOpen(true)}
                onMouseLeave={() => setIsContactOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Contact Us
                <span
                  style={{
                    transform: isContactOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-blue-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-black hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
      <MobileDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </nav>
  );
};

export default Navbar;
