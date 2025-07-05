import React from "react"
import logo from "../assets/images/logo1.png"
import { Link } from "react-router-dom"

const Logo = () => {
  return (
    <div className="flex-shrink-0">
      <img className="h-[30px] w-auto" src={logo} alt="Your Company" />
    </div>
  )
}

export default Logo

