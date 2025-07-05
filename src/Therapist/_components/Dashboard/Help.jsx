import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import team from "../../../assets/images/team.jpg";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

function Help() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading font-bold text-center text-2xl md:text-4xl text-indigo-600">
        <h1>HELP & SUPPORT</h1>
      </div>
      <div className="content shadow-lg mt-10 px-2 md:px-5 py-10 w-full">
        <div className="faq px-2 md:px-6 py-2 ">
          <div className="heading">
            <h1 className="text-2xl font-semibold text-indigo-600">FAQ</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is MindMendor?</AccordionTrigger>
                <AccordionContent>
                  MindMendor is an AI and ML-integrated mental health support
                  platform where users can chat with an AI mental health
                  assistant for guidance and support. Additionally, users can
                  connect with professional therapists for personalized therapy
                  sessions and anonymous conversations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How do I manage my earnings?
                </AccordionTrigger>
                <AccordionContent>
                  You can view your earnings from the Earnings section in your
                  therapist dashboard. Payments are processed through secure
                  payment gateways.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How do I set up my therapist profile?
                </AccordionTrigger>
                <AccordionContent>
                  Once you sign up as a therapist, you can complete your profile
                  by adding your qualifications, experience, availability, and
                  pricing details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How do I receive session bookings?
                </AccordionTrigger>
                <AccordionContent>
                  Users can book sessions based on your availability. You will
                  receive notifications and can confirm or reschedule as needed.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  What if I need to reschedule a session?
                </AccordionTrigger>
                <AccordionContent>
                  You can reschedule or cancel a session through your dashboard.
                  Users will be notified accordingly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  How do I update my account details?
                </AccordionTrigger>
                <AccordionContent>
                  You can update your personal details, payment information, and
                  preferences in the Account Settings section.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>
                  How do I contact customer support?
                </AccordionTrigger>
                <AccordionContent>
                  You can reach out to our support team via the Help & Support
                  section, where you can submit a ticket or use live chat for
                  assistance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="image w-[100%] md:w-[60%]">
              <img
                src={team}
                className="w-full h-96 object-cover rounded-md"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="contact mt-5 px-2 md:px-6 py-2 ">
          <div className="heading">
            <h1 className="text-2xl font-semibold text-indigo-600">
              Contact Us
            </h1>
          </div>
          <div className="form-contact px-2 md:px-10 py-10 flex items-center justify-center w-full">
            <div className="contact-info bg-slate-900 text-white px-4 py-4 w-[100%] md:w-[50%] h-[500px]">
              <div className="heading text-2xl font-bold mb-4">
                <h1>Contact Us</h1>
              </div>
              <div className="desc pt-6 pl-10 flex flex-col gap-10 overflow-hidden">
                <div className="field flex items-center gap-3" id="email-field">
                  <Mail />
                  <p className="text-lg">mindmendor@gmail.com</p>
                </div>
                <div className="field flex items-center gap-3" id="phone-field">
                  <Phone />
                  <p className="text-lg">+91 8421674081</p>
                </div>
                <div
                  className="field flex items-center gap-3"
                  id="facebook-field"
                >
                  <Facebook />
                  <p className="text-lg">@mindmendor4444</p>
                </div>
                <div className="field flex items-center gap-3" id="insta-field">
                  <Instagram />
                  <p className="text-lg">@mindmendor4444</p>
                </div>
                <div
                  className="field flex items-center gap-3"
                  id="twitter-field"
                >
                  <Twitter />
                  <p className="text-lg">@mindmendor4444</p>
                </div>
                <div className="field flex items-center gap-3" id="addr-field">
                  <MapPin />
                  <p className="text-lg">Pune, Maharashtra 411048</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
