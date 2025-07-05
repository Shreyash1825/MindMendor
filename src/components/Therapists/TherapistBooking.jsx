"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc, addDoc, collection, setDoc } from "firebase/firestore"
import { auth, firestore } from "../../Database/Firebase"
import { onAuthStateChanged } from "firebase/auth"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, User, Mail, FileText, Shield, Calendar, Heart, CheckCircle, Star, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const concernCategories = [
  "Anxiety & Stress",
  "Depression",
  "Relationship Issues",
  "Trauma & PTSD",
  "Grief & Loss",
  "Work-Life Balance",
  "Self-Esteem",
  "Addiction",
  "Family Issues",
  "Other",
]

const sessionDurations = [
  { value: "30", label: "30 minutes - $75" },
  { value: "45", label: "45 minutes - $100" },
  { value: "60", label: "60 minutes - $120" },
  { value: "90", label: "90 minutes - $160" },
]

export default function TherapistBooking() {
  const params = useParams()
  const therapistId = params.therapistId || params.id

  console.log("All URL params:", params)
  console.log("Therapist ID:", therapistId)

  const [therapistData, setTherapistData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    sessionDate: "",
    sessionTime: "",
    duration: "",
    concernCategory: "",
    additionalNotes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching therapist with ID:", therapistId)

      if (!therapistId) {
        setError(`No therapist ID provided. Available params: ${JSON.stringify(params)}`)
        setLoading(false)
        return
      }

      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user)
          try {
            // Fetch user data from Users collection
            const userRef = doc(firestore, "Users", user.uid)
            const userSnap = await getDoc(userRef)

            if (userSnap.exists()) {
              const userDataFromFirestore = userSnap.data()
              setUserData({
                id: user.uid,
                name: userDataFromFirestore.name || user.displayName || "User",
                email: userDataFromFirestore.email || user.email,
                phone: userDataFromFirestore.phone || "N/A",
              })
            } else {
              // Fallback to auth data if no Firestore document
              setUserData({
                id: user.uid,
                name: user.displayName || user.email?.split("@")[0] || "User",
                email: user.email,
                phone: "N/A",
              })
            }

            // Fetch therapist data
            console.log("Attempting to fetch therapist from Firestore...")
            const therapistRef = doc(firestore, "Therapists", therapistId)
            const therapistSnap = await getDoc(therapistRef)

            if (therapistSnap.exists()) {
              const data = therapistSnap.data()
              console.log("Therapist data found:", data)
              setTherapistData({
                id: therapistSnap.id,
                name: data.name || "N/A",
                email: data.email || "N/A",
                phone: data.phone || "N/A",
                gender: data.gender || "N/A",
                licenseno: data.licenseno || "N/A",
                licenseissueauth: data.licenseissueauth || "N/A",
                specializations: data.specializations || ["General Therapy"],
                experience: data.experience || "Professional",
                rating: data.rating || 4.5,
                sessionsCompleted: data.sessionsCompleted || 0,
                bio:
                  data.bio ||
                  `${
                    data.name || "This therapist"
                  } is a licensed professional dedicated to helping clients achieve their mental health goals through evidence-based therapeutic approaches.`,
              })
            } else {
              console.log("No therapist document found with ID:", therapistId)
              setError(`Therapist not found with ID: ${therapistId}`)
            }
          } catch (err) {
            console.error("Error fetching data:", err)
            setError(`Failed to fetch data: ${err.message}`)
          } finally {
            setLoading(false)
          }
        } else {
          setError("User not authenticated. Please log in to book a session.")
          setLoading(false)
        }
      })

      return () => unsubscribe()
    }

    fetchData()
  }, [therapistId, params])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!currentUser || !userData || !therapistData) {
        throw new Error("Missing user or therapist data")
      }

      // Calculate session fee based on duration
      const sessionFees = {
        30: 75,
        45: 100,
        60: 120,
        90: 160,
      }

      // Create appointment data
      const appointmentData = {
        // User Information
        userId: userData.id,
        userName: userData.name,
        userEmail: userData.email,
        userPhone: userData.phone,

        // Therapist Information
        therapistId: therapistData.id,
        therapistName: therapistData.name,
        therapistEmail: therapistData.email,
        therapistPhone: therapistData.phone,

        // Session Details
        sessionDate: formData.sessionDate,
        sessionTime: formData.sessionTime,
        duration: Number.parseInt(formData.duration),
        durationLabel: sessionDurations.find((d) => d.value === formData.duration)?.label || "",
        concernCategory: formData.concernCategory,
        additionalNotes: formData.additionalNotes,

        // Booking Details
        sessionFee: sessionFees[formData.duration] || 0,
        currency: "USD",
        status: "pending", // pending, confirmed, completed, cancelled
        paymentStatus: "pending", // pending, paid, refunded

        // Timestamps
        bookingDate: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),

        // Additional metadata
        bookingId: `APPT-${Date.now()}`, // Generate unique booking ID
      }

      console.log("Saving appointment data:", appointmentData)

      // Save to Firestore (this will create the collection if it doesn't exist)
      const appointmentsRef = collection(firestore, "appointments")
      const docRef = await addDoc(appointmentsRef, appointmentData)

      console.log("Appointment saved with ID:", docRef.id)

      // Update the appointment with the Firestore document ID
      await setDoc(doc(firestore, "appointments", docRef.id), {
        ...appointmentData,
        appointmentId: docRef.id,
      })

      setIsSubmitted(true)
    } catch (err) {
      console.error("Error booking session:", err)
      setError(`Failed to book session: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return formData.sessionDate && formData.sessionTime && formData.duration && formData.concernCategory
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1479EA] animate-spin mx-auto mb-4" />
          <div className="text-white text-xl">Loading therapist details...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-xl mb-4">Error Loading Data</div>
          <div className="text-gray-300 text-sm mb-4 bg-gray-800 p-4 rounded-lg">
            <div className="mb-2">
              <strong>Error:</strong> {error}
            </div>
            <div className="mb-2">
              <strong>Current URL:</strong> {window.location.pathname}
            </div>
            <div>
              <strong>Available Params:</strong> {JSON.stringify(params)}
            </div>
          </div>
          <Button onClick={() => window.history.back()} className="bg-[#1479EA] hover:bg-blue-600 text-white">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h1>
          <p className="text-gray-300 mb-4 max-w-lg">
            Your session with {therapistData.name} has been scheduled for {formData.sessionDate} at{" "}
            {formData.sessionTime}.
          </p>
          <p className="text-gray-400 mb-8 text-sm">You'll receive a google meet link on {userData.email} shortly.</p>
          <div className="space-y-3">
            <Button onClick={() => window.history.back()} className="bg-[#1479EA] hover:bg-blue-600 text-white w-full">
              Back to Therapists
            </Button>
            {/* <Button
              onClick={() => (window.location.href = "/MindMendor/appointments")}
              variant="outline"
              className="border-[#1479EA] text-[#1479EA] hover:bg-[#1479EA] hover:text-white w-full"
            >
              View My Appointments
            </Button> */}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#212121] py-8 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2 bg-transparent border-[#1479EA] text-[#1479EA] hover:bg-[#1479EA] hover:text-white transition-all duration-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Therapists
          </Button>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Your Session</h1>
            <p className="text-gray-300 text-lg">Schedule your appointment with {therapistData?.name}</p>
            {userData && (
              <p className="text-gray-400 text-sm mt-2">
                Booking as: {userData.name} ({userData.email})
              </p>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Therapist Details */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Therapist Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1479EA] to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {therapistData?.name?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#212121]"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{therapistData?.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(therapistData?.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-300 text-sm">
                        {therapistData?.rating} ({therapistData?.sessionsCompleted} sessions)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">About</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{therapistData?.bio}</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {therapistData?.specializations?.map((spec, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[#1479EA]/20 text-[#1479EA] border-[#1479EA]/30"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Mail className="w-4 h-4 text-[#1479EA]" />
                    <span className="text-sm">{therapistData?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User className="w-4 h-4 text-[#1479EA]" />
                    <span className="text-sm">
                      {therapistData?.gender} • {therapistData?.experience} experience
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FileText className="w-4 h-4 text-[#1479EA]" />
                    <span className="text-sm">License: {therapistData?.licenseno}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Shield className="w-4 h-4 text-[#1479EA]" />
                    <span className="text-sm">{therapistData?.licenseissueauth}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[#1479EA]" />
                  Schedule Your Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionDate" className="text-white">
                      Session Date *
                    </Label>
                    <Input
                      id="sessionDate"
                      type="date"
                      value={formData.sessionDate}
                      onChange={(e) => handleInputChange("sessionDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="bg-gray-700/50 border-gray-600 text-white focus:border-[#1479EA] focus:ring-[#1479EA]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTime" className="text-white">
                      Session Time *
                    </Label>
                    <Input
                      id="sessionTime"
                      type="time"
                      value={formData.sessionTime}
                      onChange={(e) => handleInputChange("sessionTime", e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white focus:border-[#1479EA] focus:ring-[#1479EA]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Duration of Session *</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-[#1479EA] focus:ring-[#1479EA]">
                        <SelectValue placeholder="Select session duration" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {sessionDurations.map((duration) => (
                          <SelectItem
                            key={duration.value}
                            value={duration.value}
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Concern Category *</Label>
                    <Select
                      value={formData.concernCategory}
                      onValueChange={(value) => handleInputChange("concernCategory", value)}
                    >
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-[#1479EA] focus:ring-[#1479EA]">
                        <SelectValue placeholder="Select your primary concern" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {concernCategories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes" className="text-white">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Share any additional information that might help your therapist prepare for the session..."
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#1479EA] focus:ring-[#1479EA] min-h-[100px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className="w-full bg-[#1479EA] hover:bg-blue-600 text-white py-3 text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Booking Session...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Book Session
                      </div>
                    )}
                  </Button>

                  <p className="text-gray-400 text-sm text-center">
                    By booking this session, you agree to our terms of service and privacy policy.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
