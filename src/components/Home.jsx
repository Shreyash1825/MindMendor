import React from "react";
import Hero from "./Hero";
import Header from "./Header";
import Logincontainers from "./Logincontainers";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import Research from "./Research";
import Therapistlist from "./Therapistlist";

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Logincontainers />
      <div className="h-[1.5px] w-full bg-slate-500"></div>
      <Research />
      <div className="h-[1.5px] w-full bg-slate-500"></div>
      <About />
      <div className="h-[1.5px] w-full bg-slate-500"></div>
      <Contact />
      <div className="h-[1.5px] w-full bg-slate-500"></div>
      {/* <Therapistlist /> */}
      <Footer />
    </>
  );
}

export default Home;
