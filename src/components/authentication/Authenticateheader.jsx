import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const Authenticateheader = () => {
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isUserLoginOpen, setIsUserLoginOpen] = useState(false);
  const [isTherapistLoginOpen, setIsTherapistLoginOpen] = useState(false);
  const [isUserRegisterOpen, setIsUserRegisterOpen] = useState(false);
  const [isTherapistRegisterOpen, setIsTherapistRegisterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900 shadow-md" : "bg-transparent"
      } ${isOpen ? "bg-gray-900" : "bg-transparent"}`}
    >
      <div className="px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link onClick={handleScrollHome}>
            <Logo />
          </Link>

          <div className="hidden md:block ml-10">
            <div className="flex items-baseline justify-between gap-5 space-x-4">
              <Link
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
                onClick={handleUserLogin}
                onMouseEnter={() => setIsUserLoginOpen(true)}
                onMouseLeave={() => setIsUserLoginOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                User Login
                <span
                  style={{
                    transform: isUserLoginOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-blue-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                onClick={handleUserRegister}
                onMouseEnter={() => setIsUserRegisterOpen(true)}
                onMouseLeave={() => setIsUserRegisterOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                User Register
                <span
                  style={{
                    transform: isUserRegisterOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-blue-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                onClick={handleTherapistLogin}
                onMouseEnter={() => setIsTherapistLoginOpen(true)}
                onMouseLeave={() => setIsTherapistLoginOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Therapist Login
                <span
                  style={{
                    transform: isTherapistLoginOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-blue-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                onClick={handleTherapistRegister}
                onMouseEnter={() => setIsTherapistRegisterOpen(true)}
                onMouseLeave={() => setIsTherapistRegisterOpen(false)}
                className="text-slate-200 relative  hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Therapist Register
                <span
                  style={{
                    transform: isTherapistRegisterOpen ? "scaleX(1)" : "scaleX(0)",
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

export default Authenticateheader;
