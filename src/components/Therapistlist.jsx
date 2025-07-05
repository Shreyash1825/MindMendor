"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../Database/Firebase";
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
import { useNavigate, useLocation } from "react-router-dom";

export default function TherapistList() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Therapists"));
        const data = [];
        querySnapshot.forEach((doc) => {
          const t = doc.data();
          data.push({
            id: doc.id,
            name: t.name || "N/A",
            email: t.email || "N/A",
            gender: t.gender || "N/A",
            licenseno: t.licenseno || "N/A",
            licenseissueauth: t.licenseissueauth || "N/A",
          });
        });
        setTherapists(data);
      } catch (err) {
        console.error("Error fetching therapists:", err);
        setError("Failed to fetch therapists");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  const handleViewProfile = (therapist) => {
    console.log("View profile:", therapist);
  };

  const handleHireTherapist = (therapist) => {
    console.log("Hire therapist:", therapist);
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
      <p className="text-gray-300 flex gap-2 hover:text-gray-100 cursor-pointer" onClick={()=>navigate('/MindMendor/ui')}><ArrowLeft /> Go back</p>
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

        <div className="max-w-7xl mx-auto">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
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
                              <div className="w-3 h-3 bg-white rounded-full" />
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

                          {/* Email */}
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
                          

                          {/* Buttons */}
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

// Comment
// import "./css/therapistlist.css"
// import avatar1 from "../assets/images/avatars/a1.jpg"
// import avatar2 from "../assets/images/avatars/a2.jpg"
// import avatar3 from "../assets/images/avatars/a3.jpg"
// import avatar4 from "../assets/images/avatars/a4.jpg"
// import avatar5 from "../assets/images/avatars/a5.jpg"
// import avatar6 from "../assets/images/avatars/a6.jpg"
// import avatar7 from "../assets/images/avatars/a7.jpg"

// import { useNavigate } from "react-router-dom"

// // Import Swiper React components
// import { Swiper, SwiperSlide } from "swiper/react"

// // Import Swiper styles
// import "swiper/css"
// import "swiper/css/scrollbar"
// import "swiper/css/navigation"
// import "swiper/css/pagination"

// import { Keyboard, Scrollbar, Navigation, Pagination } from "swiper/modules"
// import Header from "./Header"
// import Footer from "./Footer"

// function Therapistlist() {
//   const navigate = useNavigate()

//   const handleTherapistAboutClick = (therapist) => {
//     navigate("/MindMendor/Therapist/about", { state: { therapist } })
//   }

//   const therapistItems = [
//     {
//       image: avatar1,
//       name: "Dr. Shreya Pandit",
//       proff: "Psychologist",
//       bio: "Dr. Shreya Pandit is a licensed psychologist with a passion for helping individuals navigate life's challenges with clarity and resilience. Her approach is evidence-based and tailored to each client's unique needs, drawing from cognitive-behavioral therapy (CBT), mindfulness, and trauma-informed care. With 10 years of experience, she specializes in anxiety, depression, relationships, and trauma, providing a supportive and collaborative space for growth and healing.",
//     },
//     {
//       image: avatar2,
//       name: "Dr. Emily Carter",
//       proff: "Clinical Psychologist",
//       bio: "Dr. Emily Carter is a clinical psychologist with extensive experience in treating mood disorders and anxiety. She employs a combination of psychodynamic therapy and cognitive-behavioral techniques to help her clients achieve lasting change and improved mental health.",
//     },
//     {
//       image: avatar4,
//       name: "Michael Rivera",
//       proff: "LCSW",
//       bio: "Michael Rivera is a Licensed Clinical Social Worker specializing in family therapy and child development. With a compassionate approach, he helps families navigate complex dynamics and fosters healthy communication patterns.",
//     },
//     {
//       image: avatar3,
//       name: "Dr. Priya Sharma",
//       proff: "Psychiatrist",
//       bio: "Dr. Priya Sharma is a board-certified psychiatrist with expertise in mood disorders and psychopharmacology. She combines medication management with therapeutic approaches to provide comprehensive mental health care.",
//     },
//     {
//       image: avatar1,
//       name: "Jessica Nguyen",
//       proff: "MFT",
//       bio: "Jessica Nguyen is a Marriage and Family Therapist specializing in couples counseling and relationship issues. She helps partners improve communication, resolve conflicts, and strengthen their emotional bonds.",
//     },
//     {
//       image: avatar5,
//       name: "David Thompson",
//       proff: "Psychologist",
//       bio: "David Thompson is a psychologist focusing on cognitive-behavioral therapy for anxiety and stress management. He empowers clients with practical tools to overcome challenges and achieve personal growth.",
//     },
//     {
//       image: avatar3,
//       name: "Dr. Sofia Alvarez",
//       proff: "Behavioral Therapist",
//       bio: "Dr. Sofia Alvarez is a behavioral therapist specializing in habit formation and lifestyle changes. She helps clients develop positive behaviors and overcome obstacles to achieve their personal and professional goals.",
//     },
//     {
//       image: avatar6,
//       name: "Alex Chen",
//       proff: "LGBTQ+ Affirmative Therapist",
//       bio: "Alex Chen is an LGBTQ+ affirmative therapist dedicated to providing a safe and supportive space for individuals exploring gender identity and sexuality. They offer guidance on coming out, transitioning, and building resilience in the face of discrimination.",
//     },
//     {
//       image: avatar7,
//       name: "Dr. Maria DeLuca",
//       proff: "Substance Abuse Counselor",
//       bio: "Dr. Maria DeLuca is a substance abuse counselor with extensive experience in addiction recovery. She employs a holistic approach to help clients overcome dependencies and build a foundation for lasting sobriety.",
//     },
//   ]

//   return (
//     <>
//       <Header />
//       <div className="therapistlist py-4 sm:py-8 px-4 sm:px-8 mb-10 bg-[#212121] min-h-screen w-full">
//         <Swiper
//           slidesPerView={1}
//           spaceBetween={20}
//           centeredSlides={false}
//           grabCursor={true}
//           keyboard={{
//             enabled: true,
//           }}
//           breakpoints={{
//             640: {
//               slidesPerView: 2,
//               slidesPerGroup: 2,
//             },
//             1024: {
//               slidesPerView: 3,
//               slidesPerGroup: 3,
//             },
//           }}
//           scrollbar={false}
//           navigation={true}
//           pagination={{
//             clickable: true,
//           }}
//           modules={[Keyboard, Scrollbar, Navigation, Pagination]}
//           className="mySwiper container mx-auto"
//         >
//           {therapistItems.map((item, index) => (
//             <SwiperSlide key={index} className="py-4">
//               <div className="content flex flex-wrap justify-center items-center">
//                 <div className="card w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
//                   <div className="card-content flex flex-col items-center p-6">
//                     <div className="image w-32 h-32 rounded-full overflow-hidden mb-4">
//                       <img
//                         src={item.image || "/placeholder.svg"}
//                         alt={item.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="media-icons flex gap-4 mb-4">
//                       <i className="fa-brands fa-facebook text-xl text-gray-300 hover:text-blue-500 transition-colors"></i>
//                       <i className="fa-brands fa-twitter text-xl text-gray-300 hover:text-blue-400 transition-colors"></i>
//                       <i className="fa-brands fa-instagram text-xl text-gray-300 hover:text-pink-500 transition-colors"></i>
//                     </div>
//                     <div className="name-desc text-center mb-4">
//                       <h3 className="name text-xl font-semibold text-white mb-1">{item.name}</h3>
//                       <p className="profession text-sm text-gray-300">{item.proff}</p>
//                     </div>
//                     <div className="ratings flex gap-1 mb-4">
//                       {[...Array(5)].map((_, i) => (
//                         <i
//                           key={i}
//                           className={`fa-star ${i < 3 ? "fa-solid text-yellow-400" : "fa-regular text-gray-400"}`}
//                         ></i>
//                       ))}
//                     </div>
//                     <div className="buttons flex gap-4">
//                       <button
//                         onClick={() => handleTherapistAboutClick(item)}
//                         className="about-me px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                       >
//                         About Me
//                       </button>
//                       <button className="hire-me px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
//                         Hire Me
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//       <Footer />
//     </>
//   )
// }

// export default Therapistlist