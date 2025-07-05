import React from "react";

function Patients() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-indigo-600">
        <h1>HISTORY</h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full flex flex-col justify-center gap-6"></div>
    </div>
  );
}

export default Patients;
