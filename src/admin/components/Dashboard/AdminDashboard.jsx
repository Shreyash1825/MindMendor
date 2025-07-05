import { IndianRupee, Star } from "lucide-react";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function AdminDashboard() {
  const [isAvailable, setIsAvailable] = useState(false);
  const averageRating = 4.5 
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-indigo-600">
        <h1>DASHBOARD</h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full">
        {/* Responsive Grid Layout */}
        <div className="offer-cards-list w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="card-item w-full text-center shadow-lg px-4 py-14">
            <h1 className="mb-4 text-2xl font-bold text-red-500">
              Total Number of Users
            </h1>
            <p className="text-2xl font-bold text-indigo-600 flex items-center justify-center">
              20
            </p>
          </div>
          <div className="card-item w-full text-center shadow-lg px-4 py-14">
            <h1 className="mb-4 text-2xl font-bold text-red-500">
              Total Number of Therapists
            </h1>
            <p className="text-2xl font-bold text-indigo-600 flex items-center justify-center">
              10
            </p>
          </div>
          <div className="card-item w-full text-center shadow-lg px-4 py-14">
            <h1 className="mb-4 text-2xl font-bold text-red-500">
              Total Number of appointments
            </h1>
            <p className="text-2xl font-bold text-indigo-600 flex items-center justify-center">
              02
            </p>
          </div>
          <div className="card-item w-full text-center shadow-lg px-4 py-14">
            <h1 className="mb-4 text-2xl font-bold text-red-500">
              Total Number of Admins
            </h1>
            <p className="text-2xl font-bold text-indigo-600 flex items-center justify-center">
              01
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
