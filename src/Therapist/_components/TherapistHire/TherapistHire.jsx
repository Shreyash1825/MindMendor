import React from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Header";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

function TherapistHire() {
  const location = useLocation();
  const therapist = location.state?.therapist;

  if (!therapist) {
    return <div>No therapist information available.</div>;
  }
  return (
    <>
      <Navbar />
      <div className="max-w-screen bg-zinc-950 flex items-center justify-center py-20">
        <div className="w-[70%] text-white p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
          <div className="heading text-center mb-10">
            <h1 className="text-3xl text-[#1479ea] font-bold">Hire</h1>
          </div>
          <div className="profile px-24 py-3 mb-10">
            <div className="profile-photo w-full flex items-center justify-center">
              <img
                src={therapist.image || "/placeholder.svg"}
                className="w-40 h-40 rounded-full object-cover"
                alt={therapist.name}
              />
            </div>
            <div className="title text-center">
              <h1 className="text-2xl font-bold text-[#1479ea]">
                {therapist.name}
              </h1>
              <p>{therapist.proff}</p>
            </div>
          </div>
          <div className="hire-form">
            <div className="heading text-center mb-10">
              <h1 className="text-3xl font-bold">Form</h1>
            </div>

            <form action="">
              {/* Selecte you time slot */}
              <div className="flex flex-col gap-6 items-center justify-center">

                <div className="flex flex-col w-56 gap-2 justify-center">
                  <label for="session_date" className="text-sm text-start">
                    Session Date & Time:
                  </label>
                  <Input
                    id="session_date"
                    type="datetime-local"
                    name="session_date"
                    required
                  />
                </div>

                <div className="flex flex-col w-56 gap-2 justify-center">
                  <label for="session_duration" className="text-sm text-start">
                    Session Duration:
                  </label>
                  <DropdownMenu
                    id="session_duration"
                    name="session_duration"
                    required
                  >
                    <DropdownMenuTrigger asChild>
                      <button className="bg-transparent border rounded py-1 text-sm border-gray-500">
                        <p className="flex justify-between items-center px-2">
                          Select Duration <ChevronDown />
                        </p>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-zinc-900 text-white">
                      <DropdownMenuLabel>Session Duration</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem value="60">
                          1 hr
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem value="90">
                          1.5 hr
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem value="120">
                          2 hr
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem value="150">
                          2.5 hr
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-col w-56 gap-2 justify-center">
                  <label for="concern_category" className="text-sm text-start">
                    Concern Category:
                  </label>
                  <DropdownMenu
                    id="concern_category"
                    name="concern_category"
                    required
                  >
                    <DropdownMenuTrigger asChild>
                      <button className="bg-transparent border rounded py-1 text-sm border-gray-500">
                        <p className="flex justify-between items-center px-2">
                          Select Duration <ChevronDown />
                        </p>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-zinc-900 text-white">
                      <DropdownMenuLabel>Concern Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem value="Anxiety">
                          Anxiety
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem value="Depression">
                          Depression
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem value="Stress">
                          Stress
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem value="Relationship Issues">
                          Relationship Issues
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem value="Career Counseling">
                          Career Counseling
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem value="Career Counseling">
                          Other
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="submit-button">
                    <Button className='bg-slate-300 text-black hover:bg-white'>Submit</Button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TherapistHire;
