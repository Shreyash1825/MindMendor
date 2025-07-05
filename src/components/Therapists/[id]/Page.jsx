"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../Database/Firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  FileText,
  Shield,
  Clock,
  Star,
  MessageCircle,
  Video,
  Heart,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function TherapistProfile() {
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id: therapistId } = useParams();

  useEffect(() => {
    console.log("Therapist ID from URL:", therapistId); // Debug log

    const fetchTherapist = async () => {
      try {
        const docRef = doc(firestore, "Therapists", therapistId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTherapist({
            id: docSnap.id,
            name: data.name || "N/A",
            email: data.email || "N/A",
            phone: data.phone || "N/A",
            gender: data.gender || "N/A",
            licenseno: data.licenseno || "N/A",
            licenseissueauth: data.licenseissueauth || "N/A",
            specialization: data.specialization || "General Therapy",
            experience: data.experience || "5+ years",
            education: data.education || "Masters in Psychology",
            bio:
              data.bio ||
              "Experienced therapist dedicated to helping clients achieve mental wellness.",
            location: data.location || "Online Sessions Available",
            availability: data.availability || "Mon-Fri, 9 AM - 6 PM",
            rating: data.rating || 4.5,
            totalSessions: data.totalSessions || 150,
            languages: data.languages || ["English"],
            certifications: data.certifications || [
              "Licensed Clinical Therapist",
            ],
            approach: data.approach || "Cognitive Behavioral Therapy (CBT)",
            fees: data.fees || "$80-120 per session",
          });
        } else {
          setError("Therapist not found");
        }
      } catch (err) {
        setError("Failed to fetch therapist details");
        console.error("Error fetching therapist:", err);
      } finally {
        setLoading(false);
      }
    };

    if (therapistId) {
      fetchTherapist();
    }
  }, [therapistId]);

  const handleBookSession = () => {
    console.log("Book session with:", therapist?.name);
    navigate(`/MindMendor/therapists/booksession/${therapist?.id}`)
  };

  const handleSendMessage = () => {
    console.log("Send message to:", therapist?.name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <div className="text-white text-xl">Loading therapist profile...</div>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center flex-col space-y-4">
        <div className="text-red-400 text-xl">
          {error || "Therapist not found"}
        </div>
        <Button
          onClick={() => navigate("/MindMendor/therapists")}
          className="bg-[#1479EA] hover:bg-blue-600 text-white"
        >
          Back to Therapists
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#212121] py-8 px-4 md:px-8">
      {/* Header with Back Button */}
      <div className="container mx-auto mb-6">
        <Button
          onClick={() => navigate("/MindMendor/therapists")}
          variant="outline"
          className="flex items-center gap-2 bg-transparent border-[#1479EA] text-[#1479EA] hover:bg-[#1479EA] hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Therapists
        </Button>
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm sticky top-8">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#1479EA] to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg animate-pulse">
                      {therapist.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-[#212121] flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">
                      {therapist.name}
                    </h1>
                    <Badge
                      variant="secondary"
                      className="bg-[#1479EA]/20 text-[#1479EA] border-[#1479EA]/30"
                    >
                      {therapist.specialization}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(therapist.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white text-sm">
                      {therapist.rating} ({therapist.totalSessions} sessions)
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full space-y-3 pt-4">
                    <Button
                      onClick={handleBookSession}
                      className="w-full bg-[#1479EA] hover:bg-blue-600 text-white transition-all duration-300"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                    {/* <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={handleSendMessage}
                        className="border-[#1479EA] text-[#1479EA] hover:bg-[#1479EA] hover:text-white transition-all duration-300"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Video Call
                      </Button>
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#1479EA]" />
                  About {therapist.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">{therapist.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <Award className="w-4 h-4 mr-2 text-[#1479EA]" />
                      <span className="text-sm">
                        Experience: {therapist.experience}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FileText className="w-4 h-4 mr-2 text-[#1479EA]" />
                      <span className="text-sm">
                        Education: {therapist.education}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-4 h-4 mr-2 text-[#1479EA]" />
                      <span className="text-sm">{therapist.location}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2 text-[#1479EA]" />
                      <span className="text-sm">{therapist.availability}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-[#1479EA]" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Mail className="w-4 h-4 mr-3 text-[#1479EA]" />
                      <span className="text-sm">{therapist.email}</span>
                    </div>
                    {therapist.phone && therapist.phone !== "N/A" && (
                      <div className="flex items-center text-gray-300">
                        <Phone className="w-4 h-4 mr-3 text-[#1479EA]" />
                        <span className="text-sm">{therapist.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <User className="w-4 h-4 mr-3 text-[#1479EA]" />
                      <span className="text-sm">
                        Gender: {therapist.gender}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Heart className="w-4 h-4 mr-3 text-[#1479EA]" />
                      <span className="text-sm">Fees: {therapist.fees}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#1479EA]" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        License Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">License No:</span>
                          <span className="text-white font-mono">
                            {therapist.licenseno}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Authority:</span>
                          <span className="text-white">
                            {therapist.licenseissueauth}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Approach
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {therapist.approach}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {therapist.languages?.map((language, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[#1479EA]/20 text-[#1479EA]"
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {therapist.certifications?.map((cert, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
