import { IndianRupee, Star } from "lucide-react";
import React, { useState } from "react";
import { Label } from "@/components/UI/label";
import { Switch } from "@/components/UI/switch";

function TherapistDashboard() {
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
            <h2 className="mb-4 text-2xl font-bold text-red-500">
              Are you available for Sessions ?
            </h2>
            <Switch
              className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-300"
              id="availability"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
          </div>
          <div className="card-item w-full text-center shadow-lg px-4 py-14">
            <h1 className="mb-4 text-2xl font-bold text-red-500">
              Total Earnings from Sessions
            </h1>
            <p className="text-2xl font-bold text-indigo-600 flex items-center justify-center">
              <IndianRupee />
              20
            </p>
          </div>
          <div className="card-item w-full text-center shadow-lg px-4 py-14">
            <h1 className="mb-4 text-2xl font-bold text-red-500">
              Pending Appointements
            </h1>
            <p className="text-2xl font-bold text-indigo-600 flex items-center justify-center">
              02
            </p>
          </div>
          <div className="card-item w-full text-center shadow-lg px-4 py-14">
          <h1 className="mb-4 text-2xl font-bold text-red-500">
              You'r Average rating on MindMendor
            </h1>
            <div className="flex items-center justify-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-6 h-6 ${
                    index < Math.floor(averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-lg font-medium">
              {averageRating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TherapistDashboard;
