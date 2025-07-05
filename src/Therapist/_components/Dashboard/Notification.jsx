import React from "react";
import { BellRing } from "lucide-react";

function Notification() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-indigo-600">
        <h1>NOTIFICATIONS & ALERTS</h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full flex flex-col justify-center gap-6">
        <div className="notifications flex flex-col items-start justify-start">
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4">
            <BellRing className="text-indigo-600" /> New Appointment Request – John Doe has requested an appointment for Feb 18, 2025, at 3:00 PM.
          </div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4"><BellRing className="text-indigo-600" /> New Patient Registered – Sarah Miller has signed up and completed her profile.</div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4"><BellRing className="text-indigo-600" /> Pending Forms – 2 patients have pending intake forms that need review.</div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4"><BellRing className="text-indigo-600" /> New Feedback Received – Check the latest feedback from your last session with David Brown.</div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4"><BellRing className="text-indigo-600" /> Session Reminder – Upcoming session with James Wilson in 30 minutes.</div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4"><BellRing className="text-indigo-600" /> New Message – You have received a new message from a patient in your inbox.</div>
          <div className="alert-box shadow-md w-full p-4 flex items-center justify-start gap-4"><BellRing className="text-indigo-600" /> Payment Received – $100 received from Lisa Adams for her last session.</div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
