import React from "react";
import "./css/about.css";
import linkedin from "../assets/images/svgs/linkedin.svg";
import { Linkedin, Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  const teamMembers = [
    {
      name: "Shubham Upadhyay",
      role: "Team Leader & Backend Engineer",
      description:
        "Shubham is a skilled backend developer with expertise in API integration and system architecture. At MindMender, he plays a crucial role in developing the platform's backend infrastructure, ensuring that the AI-driven chatbot and therapy modules run smoothly and efficiently. Shubham's work on API manipulation allows the bot to provide real-time, intelligent responses, making conversations feel natural & responsive. His ability to seamlessly connect various systems ensures a secure & fast platform for users.",
      quote:
        "A solid foundation in the backend makes everything work like magic on the front.",
      linkedin: "https://www.linkedin.com/in/shubham-upadhyay0/",
      github: "",
      email: "",
    },
    {
      name: "Sahil Narale",
      role: "Lead Developer & AI Integration Specialist",
      description:
        "Sahil is a talented full stack developer who leads the development efforts at MindMender, focusing on both front-end AI integration and backend functionality. His expertise bridges the gap between user experience and AI technology, ensuring the platform is intuitive, responsive, and efficient. Sahil's work ensures that the AI chatbot is seamlessly integrated with a smooth and engaging interface, while also contributing to the backend infrastructure.",
      quote:
        "The magic of technology lies in connecting complex systems to create simple, human-centered experiences.",
      linkedin: "https://www.linkedin.com/in/shubham-upadhyay0/",
      github: "",
      email: "",
    },
    {
      name: "Snehal Abnave",
      role: "Backend Engineer & AI Integration Specialist",
      description:
        "Snehal is a talented backend developer with a passion for artificial intelligence. At MindMender, she focuses on integrating AI functionality into the platform and ensuring the backend systems are robust, secure, and scalable. Her work allows the AI to function smoothly, providing users with insightful, real-time responses while maintaining the platform's reliability. Snehal's expertise in backend development and AI integration ensures that MindMender's features are both powerful and user-friendly, enhancing the overall experience for those seeking support.",
      quote:
        "Building systems that think and grow with users is the future of meaningful technology.",
      linkedin: "https://www.linkedin.com/in/snehal-abnave-62391b249/",
      github: "",
      email: "",
    },
    {
      name: "Shreyash Chalke",
      role: "Frontend Developer & AI Integration Specialist",
      description:
        "Shreyash is a creative and detail-oriented UI developer with a focus on seamlessly integrating AI into user interfaces. At MindMender, he ensures that the platform not only looks great but also provides an intuitive, user-friendly experience. By bridging the gap between design and AI, Shreyash makes sure that users can easily interact with the chatbot and therapy modules, making the entire experience engaging and smooth. His expertise in combining aesthetics with advanced AI functionality ensures that MindMender remains both visually appealing and highly effective.",
      quote:
        "Great design isn't just about how it looks—it's about how it works, especially when AI is involved.",
      linkedin: "https://www.linkedin.com/in/shreyashchalke/",
      github: "",
      email: "",
    },
  ];
  return (
    <div className="about text-white px-2 md:px-40 py-10 bg-[#212121]">
      <p className="font-semibold text-3xl text-center mb-9">
        Who WE <span className="text-[#1479EA]">Are</span>
      </p>
      <div className="intro text-justify lg:px-40">
        <p className="text-xl mb-3">
          Welcome to <span className="text-[#1479EA]">MindMendor</span>,
        </p>
        <p className="text-justify">
          Behind MindMender is a dedicated team of innovators, united by a
          shared vision to transform how people approach emotional well-being.
          We combine expertise in technology, psychology, and design to create a
          virtual companion that listens, supports, and empowers individuals
          facing life’s challenges.
        </p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-slate-900 rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <span className="inline-block bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded-full mt-2">
                  {member.role}
                </span>
              </div>
              <div className="bg-white w-full h-px mb-4"></div>
              <p className="text-sm mb-4 text-justify">{member.description}</p>
              <p className="text-sm italic text-blue-800 mb-4">
                "{member.quote}"
              </p>
              <ul className="wrapper">
              <Link
                to={member.linkedin}
                target="_blank"
                className="text-black"
              >
                <li className="icon linkedin">
                  <span className="tooltip">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    x="0px"
                    y="0px"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                  >
                    <path d="M9,25H4V10h5V25z M6.501,8C5.118,8,4,6.879,4,5.499S5.12,3,6.501,3C7.879,3,9,4.121,9,5.499C9,6.879,7.879,8,6.501,8z M27,25h-4.807v-7.3c0-1.741-0.033-3.98-2.499-3.98c-2.503,0-2.888,1.896-2.888,3.854V25H12V9.989h4.614v2.051h0.065 c0.642-1.18,2.211-2.424,4.551-2.424c4.87,0,5.77,3.109,5.77,7.151C27,16.767,27,25,27,25z"></path>
                  </svg>
                </li>
              </Link>
              <Link to="" className="text-black">
                <li className="icon github">
                  <span className="tooltip">GitHub</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    x="0px"
                    y="0px"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                  >
                    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                  </svg>
                </li>
              </Link>
              <Link className="text-black">
                <li className="icon gmail">
                  <span className="tooltip">Gmail</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 43.753906 6.4023438 C 42.53621 6.3489969 41.294792 6.712898 40.271484 7.46875 L 37.525391 9.4960938 L 25 18.755859 L 12.591797 9.5839844 A 1.0001 1.0001 0 0 0 11.949219 9.3007812 L 12.199219 9.3007812 L 9.734375 7.4765625 C 8.7104042 6.7188363 7.4671493 6.3528895 6.2480469 6.40625 C 5.0289444 6.4596105 3.8349462 6.9314667 2.9082031 7.8457031 C 1.7309454 9.0063798 1 10.629831 1 12.410156 L 1 15.84375 A 1.0001 1.0001 0 0 0 1 16.138672 L 1 39.5 C 1 41.421188 2.5788117 43 4.5 43 L 12 43 A 1.0001 1.0001 0 0 0 13 42 L 13 25.373047 L 24.40625 33.804688 A 1.0001 1.0001 0 0 0 25.59375 33.804688 L 37 25.373047 L 37 42 A 1.0001 1.0001 0 0 0 38 43 L 45.5 43 C 47.421188 43 49 41.421188 49 39.5 L 49 16.119141 A 1.0001 1.0001 0 0 0 49 15.859375 L 49 12.410156 C 49 10.6517 48.290455 9.0357821 47.128906 7.8730469 C 47.095336 7.8394769 47.084086 7.83018 47.097656 7.84375 A 1.0001 1.0001 0 0 0 47.091797 7.8378906 C 46.165242 6.9256756 44.971603 6.4556905 43.753906 6.4023438 z M 43.644531 8.4003906 C 44.400835 8.4300436 45.134049 8.7168876 45.689453 9.2636719 C 45.708363 9.2823439 45.722171 9.2964424 45.712891 9.2871094 C 46.50934 10.084374 47 11.188613 47 12.410156 L 47 15.496094 L 39 21.408203 L 39 11 A 1.0001 1.0001 0 0 0 38.996094 10.898438 L 41.458984 9.078125 A 1.0001 1.0001 0 0 0 41.460938 9.078125 C 42.109578 8.598977 42.888228 8.3707375 43.644531 8.4003906 z M 6.3574219 8.40625 C 7.1145694 8.37661 7.8958927 8.6037105 8.5449219 9.0839844 L 11.003906 10.902344 A 1.0001 1.0001 0 0 0 11 11 L 11 21.408203 L 3 15.496094 L 3 12.410156 C 3 11.174482 3.5017577 10.068855 4.3125 9.2695312 C 4.8677569 8.7217677 5.6002743 8.4358895 6.3574219 8.40625 z M 37 12.371094 L 37 22.886719 L 25 31.755859 L 13 22.886719 L 13 12.373047 L 24.40625 20.804688 A 1.0001 1.0001 0 0 0 25.59375 20.804688 L 37 12.371094 z M 3 17.982422 L 11 23.896484 L 11 41 L 4.5 41 C 3.6591883 41 3 40.340812 3 39.5 L 3 17.982422 z M 47 17.982422 L 47 39.5 C 47 40.340812 46.340812 41 45.5 41 L 39 41 L 39 23.896484 L 47 17.982422 z"></path>
                  </svg>
                </li>
              </Link>
            </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
