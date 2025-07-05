import React from "react";

function Earnings() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-indigo-600">
        <h1>EARNINGS</h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full flex flex-col justify-center gap-6">
        <div className="earning">
          <div className="w-full shadow-md mb-6">
            <div className="heading text-center p-10">
              <h2 className="mb-4 text-2xl font-bold text-red-500">
                You'r Current Total Earning
              </h2>
              <p className="text-3xl font-bold text-indigo-600 flex items-center justify-center">
                &#8377; 40000
              </p>
            </div>
          </div>
          <hr />
          <div className="w-full shadow-md">
            <div className="heading text-center p-10">
              <h2 className="mb-4 text-2xl font-bold text-red-500">
                You'r UPI ID
              </h2>
              <p className="text-xl font-bold text-indigo-600 flex items-center justify-center">
                sahilnarale@oksbi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Earnings;
