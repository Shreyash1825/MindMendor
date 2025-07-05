import React from "react";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import "./css/hero.css";
import { Link } from "react-router-dom";
function Hero() {
  const handleScrollLogin = () => {
    window.scroll({
      top: 540, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };
  return (
    <div className="bg-[#0c0f0a] text-center flex justify-evenly flex-col items-center h-screen overflow-x-hidden">
      <div>
        <p className="text-white font-bold text-3xl my-6">Welcome to</p>
        <p id="title" className="text-white font-bold text-6xl md:text-8xl ">
          MindMendor
        </p>
      </div>

      <div className="text-center flex flex-col justify-center items-center">
        <span className="text-slate-400 font-bold mb-4">
          Scroll down to login or register
        </span>
        <MdKeyboardDoubleArrowDown
          className="text-white text-3xl animate-bounce"
          cursor="pointer"
          onClick={handleScrollLogin}
        />
      </div>
    </div>
  );
}

export default Hero;
