"use client";

import React, { useState, useRef } from "react"; // Removed 'type' from React import
import emailjs from "@emailjs/browser";
import "./css/contact.css";
import { toast } from "react-toastify";

function Contact() {
  const form = useRef(null); // Removed <HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    // Removed type annotation 'React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>'
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendEmail = async (e) => {
    // Removed type annotation 'React.FormEvent<HTMLFormElement>'
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const contactTemplateId = import.meta.env
        .VITE_EMAILJS_CONTACT_TEMPLATE_KEY;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Replace these with your actual EmailJS credentials
      const result = await emailjs.sendForm(
        serviceId, // Replace with your EmailJS service ID
        contactTemplateId, // Replace with your EmailJS template ID
        form.current, // Removed '!' non-null assertion
        publicKey // Replace with your EmailJS public key
      );

      console.log("Email sent successfully:", result.text);
      toast.success("Contact form submitted!", {
        position: "top-center",
      });
      setMessage({
        type: "success",
        text: "Message sent successfully! We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      if (form.current) {
        form.current.reset();
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Something went wrong!", {
        position: "top-center",
      });
      setMessage({
        type: "error",
        text: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#29292c] text-white px-2 md:px-40 py-10 flex flex-col justify-center items-center">
      <p className="font-semibold text-3xl text-center mb-1">
        Contact <span className="text-[#1479EA]">Us</span>
      </p>
      <div className="container text-justify lg:px-40 py-8 w-[100%] md:w-[65%] flex flex-col gap-15 justify-center items-center">
        <form
          ref={form}
          onSubmit={sendEmail}
          className="box form__group field py-10 px-10 w-full flex flex-col gap-12"
        >
          {message.text && (
            <div
              className={`p-4 rounded-md text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
            />
          </div>

          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
            />
          </div>

          <div className="relative">
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="border-b w-full border-gray-300 py-1 focus:border-b-2 focus:border-[#1479EA] transition-colors focus:outline-none peer bg-inherit"
            />
          </div>

          <div className="relative">
            <textarea
              name="message"
              id="message"
              placeholder="Write your message.."
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              className="bg-transparent text-white px-4 py-5 placeholder-white border border-gray-300 rounded-md w-full focus:border-[#1479EA] focus:outline-none resize-vertical"
            />
          </div>

          <button
            className={`submit-btn ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
