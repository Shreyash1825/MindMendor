import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/mm2.png";
import {
  BellRing,
  CircleUserRound,
  Heart,
  HelpCircle,
  History,
  LayoutDashboard,
  Wallet,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL

  const navbarlinks = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/MindMendor/therapist/",
    },
    {
      label: "Account",
      icon: <CircleUserRound />,
      path: "/MindMendor/therapist/account",
    },
    {
      label: "Notifications",
      icon: <BellRing />,
      path: "/MindMendor/therapist/alerts",
    },
    {
      label: "Appointments",
      icon: <Heart />,
      path: "/MindMendor/therapist/appointments",
    },
    {
      label: "Earnings",
      icon: <Wallet />,
      path: "/MindMendor/therapist/earnings",
    },
    {
      label: "Help",
      icon: <HelpCircle />,
      path: "/MindMendor/therapist/help",
    },
    

  ];

  const handleScrollHome = () => {
    navigate("/MindMendor/therapist/Home")
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  // Check if the current path is in navbarlinks
  const isKnownPath = navbarlinks.some(
    (link) => link.path === location.pathname
  );

  return (
    <div className="fixed z-[100] flex h-full w-[90px] md:w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white shadow-lg">
      <div className="gap-x-3 py-3 px-1 md:px-3">
        <div className="logo flex gap-1 items-center justify-center">
          <Link onClick={handleScrollHome}>
            <img src={logo} className="md:h-20 md:w-20 w-10 h-10 rounded-full" alt="Aplango" />
          </Link>
        </div>

        <div className="flex flex-col w-full gap-y-4 overflow-y-auto mt-6 overflow-x-hidden py-5 px-4 md:px-3 [scrollbar-width:_thin]">
          <div className="flex flex-col gap-4">
            {navbarlinks.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`w-full hover:scale-105 transition-all text-md font-semibold rounded-lg flex items-center justify-center md:justify-start gap-0 md:gap-5 text-start px-5 py-4 
                                    ${
                                      (item.path === "/Aplango/dashboard/" &&
                                        isDashboardActive) ||
                                      location.pathname === item.path
                                        ? "bg-indigo-600 text-white"
                                        : "hover:bg-indigo-600 hover:text-white"
                                    }`}
              >
                <h2 className="flex items-center text-start gap-4">
                  {item.icon}
                  <span className="hidden md:block">{item.label}</span>
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
