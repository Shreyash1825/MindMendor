"use client"

import { useState, useEffect } from "react"
import { HandCoins, History, Mail, Phone, User, Award, Star, MapPin } from "lucide-react"
import { useUser } from "../../../context/UserContext"
import { auth, firestore } from "../../../Database/Firebase"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

function Account() {
  const { therapistName, email } = useUser()
  const [therapistData, setTherapistData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const fetchTherapistData = async (userId) => {
      try {
        setLoading(true)
        const therapistDoc = await getDoc(doc(firestore, "Therapists", userId))

        if (therapistDoc.exists()) {
          const data = therapistDoc.data()
          setTherapistData({
            id: therapistDoc.id,
            name: data.name || "N/A",
            email: data.email || "N/A",
            phone: data.phone || "N/A",
            gender: data.gender || "N/A",
            bio:
              data.bio ||
              "Compassionate and experienced mental health therapist dedicated to helping individuals navigate life's challenges. Specializing in anxiety, depression, trauma, and personal growth, I provide a safe, supportive space for healing and self-discovery.",
            experience: data.experience || "1.5 hr",
            fees: data.fees || "3000",
            licenseno: data.licenseno || "N/A",
            licenseissueauth: data.licenseissueauth || "N/A",
            specialization: data.specialization || "General Therapy",
            rating: data.rating || 4.8,
            totalSessions: data.totalSessions || 150,
            location: data.location || "Online",
          })
        } else {
          setError("Therapist profile not found")
        }
      } catch (err) {
        console.error("Error fetching therapist data:", err)
        setError("Failed to fetch therapist data")
      } finally {
        setLoading(false)
        setTimeout(() => setIsVisible(true), 100)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTherapistData(user.uid)
      } else {
        setError("User not authenticated")
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 backdrop-blur-sm">
          <div className="text-red-400 text-xl font-medium">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
        >
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Profile Card */}
        <div
          className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/30">
            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-12">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10">{therapistData?.name?.charAt(0)?.toUpperCase() || "T"}</span>
                </div>

                {/* Status indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                <div className="absolute -top-2 -right-6 w-4 h-4 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-bounce animation-delay-200"></div>
              </div>

              {/* Name and Bio Section */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                    {therapistData?.name}
                  </h2>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(therapistData?.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600"
                          } transition-all duration-300 hover:scale-125`}
                        />
                      ))}
                    </div>
                    <span className="text-yellow-400 font-semibold text-lg">{therapistData?.rating}</span>
                    <span className="text-gray-400">({therapistData?.totalSessions} sessions)</span>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6 hover:text-white transition-colors duration-300">
                  {therapistData?.bio}
                </p>

                {/* Specialization Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-3 backdrop-blur-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">{therapistData?.specialization}</span>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Contact Info */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Email</h3>
                    <p className="text-gray-400 text-sm">Contact Information</p>
                  </div>
                </div>
                <p className="text-blue-300 font-medium break-all">{therapistData?.email}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 hover:from-green-500/20 hover:to-emerald-500/20 hover:border-green-400/40 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Phone</h3>
                    <p className="text-gray-400 text-sm">Direct Contact</p>
                  </div>
                </div>
                <p className="text-green-300 font-medium">{therapistData?.phone}</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-6 hover:from-pink-500/20 hover:to-rose-500/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center group-hover:bg-pink-500/30 transition-colors duration-300">
                    <User className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Gender</h3>
                    <p className="text-gray-400 text-sm">Identity</p>
                  </div>
                </div>
                <p className="text-pink-300 font-medium">{therapistData?.gender}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-6 hover:from-orange-500/20 hover:to-yellow-500/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors duration-300">
                    <History className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Experience</h3>
                    <p className="text-gray-400 text-sm">Daily Practice</p>
                  </div>
                </div>
                <p className="text-orange-300 font-medium">
                  {therapistData?.experience}/<span className="text-gray-400">day</span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 hover:from-emerald-500/20 hover:to-teal-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors duration-300">
                    <HandCoins className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Consultation Fee</h3>
                    <p className="text-gray-400 text-sm">Per Session</p>
                  </div>
                </div>
                <p className="text-emerald-300 font-medium text-xl">₹{therapistData?.fees}</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-2xl p-6 hover:from-indigo-500/20 hover:to-blue-500/20 hover:border-indigo-400/40 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Location</h3>
                    <p className="text-gray-400 text-sm">Service Area</p>
                  </div>
                </div>
                <p className="text-indigo-300 font-medium">{therapistData?.location}</p>
              </div>
            </div>

            {/* License Information */}
            {therapistData?.licenseno && therapistData?.licenseno !== "N/A" && (
              <div className="mt-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 transition-all duration-300">
                <h3 className="text-white font-semibold text-xl mb-4 flex items-center gap-3">
                  <Award className="w-6 h-6 text-purple-400" />
                  Professional License
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">License Number</p>
                    <p className="text-purple-300 font-mono text-lg">{therapistData?.licenseno}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Issuing Authority</p>
                    <p className="text-purple-300 font-medium">{therapistData?.licenseissueauth}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
