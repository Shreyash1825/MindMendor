import React from "react";
import research from "../assets/research.pdf";
function Research() {
  return (
    <div className="researchpapr text-white px-10 md:px-40 py-10 bg-[#29292c]">
      <p className="font-semibold text-3xl text-center mb-9">
        Research <span className="text-[#1479EA]">Paper</span>
      </p>
      <div className="intro text-justify lg:px-40">
        <p className="text-xl mb-3">
          Welcome to <span className="text-[#1479EA]">MindMendor</span>,
        </p>
        <p className="text-justify">
          We are thrilled to share the publication of our survey report:
          "MindMendor: An AI-Driven Approach for Mental Health Support through
          NLP and ML". This report delves into how Artificial Intelligence,
          specifically Natural Language Processing (NLP) and Machine Learning
          (ML), can revolutionize mental health support. By harnessing AI's
          potential, we aim to create more personalized, accessible, and
          effective mental health solutions. This was a collaborative effort,
          and I couldn't have done it without my amazing teammates. We are
          incredibly proud of what we’ve accomplished, and we are excited to see
          how this work will contribute to the mental health space. Let's
          continue pushing boundaries and using AI to make a real difference!
        </p>
        <div className="flex justify-center mt-12 mb-9">
        <iframe className="h-[400px] border-none" src={research}></iframe>
        </div>
      </div>
    </div>
  );
}

export default Research;
