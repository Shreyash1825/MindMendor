"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../Database/Firebase";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, FileText, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TherapistList() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "Therapists")
        );
        const therapistData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          therapistData.push({
            id: doc.id,
            name: data.name || "N/A",
            email: data.email || "N/A",
            gender: data.gender || "N/A",
            licenseno: data.licenseno || "N/A",
            licenseissueauth: data.licenseissueauth || "N/A",
          });
        });

        setTherapists(therapistData);
      } catch (err) {
        setError("Failed to fetch therapists");
        console.error("Error fetching therapists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  const handleViewProfile = (therapist) => {
    console.log("Navigating to therapist:", therapist.id); // Debug log
    navigate(`/MindMendor/therapists/${therapist.id}`);
  };

  const handleHireTherapist = (therapist) => {
    navigate(`/MindMendor/therapists/booksession/${therapist.id}`, {
      state: { therapist: therapist },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <div className="text-white text-xl">Loading therapists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#212121] py-8 px-4 md:px-8">
      <div className="container mx-auto mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2 bg-transparent border-[#1479EA] text-[#1479EA] hover:bg-[#1479EA] hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>

      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Therapists
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Connect with licensed professionals who are here to support your
            mental health journey
          </p>
        </div>

        <div className="max-w-7xl mx-auto flex justify-center">
          <Carousel
            opts={{
              align: "center",
              loop: true,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4 flex items-center">
              {therapists.map((therapist) => (
                <CarouselItem
                  key={therapist.id}
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-[#1479EA] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#1479EA] to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                              {therapist.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#212121] flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          </div>

                          {/* Name and Gender */}
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white">
                              {therapist.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="bg-[#1479EA]/20 text-[#1479EA] border-[#1479EA]/30"
                            >
                              <User className="w-3 h-3 mr-1" />
                              {therapist.gender}
                            </Badge>
                          </div>

                          {/* Contact Info */}
                          <div className="w-full space-y-3">
                            <div className="flex items-center justify-center space-x-2 text-gray-300">
                              <Mail className="w-4 h-4 text-[#1479EA]" />
                              <span className="text-sm truncate max-w-[200px]">
                                {therapist.email}
                              </span>
                            </div>
                          </div>

                          {/* License Info */}
                          <div className="w-full bg-gray-800/50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                License No:
                              </span>
                              <span className="text-white text-sm font-mono">
                                {therapist.licenseno}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm flex items-center">
                                <Shield className="w-3 h-3 mr-1" />
                                Authority:
                              </span>
                              <span className="text-white text-sm">
                                {therapist.licenseissueauth}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-3 w-full pt-4">
                            <Button
                              variant="outline"
                              onClick={() => handleViewProfile(therapist)}
                              className="flex-1 border-[#1479EA] text-[#1479EA] hover:bg-[#1479EA] hover:text-white transition-all duration-300"
                            >
                              View Profile
                            </Button>
                            <Button
                              onClick={() => handleHireTherapist(therapist)}
                              className="flex-1 bg-[#1479EA] hover:bg-blue-600 text-white transition-all duration-300"
                            >
                              Hire Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-[#1479EA] hover:bg-blue-600 text-white border-[#1479EA]" />
            <CarouselNext className="hidden md:flex -right-12 bg-[#1479EA] hover:bg-blue-600 text-white border-[#1479EA]" />
          </Carousel>
        </div>

        {therapists.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No therapists found</div>
          </div>
        )}
      </div>
    </div>
  );
}
