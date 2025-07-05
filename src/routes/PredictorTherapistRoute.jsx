"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../Database/Firebase"
import PredictorTherapistFlow from "../components/PredictorTherapistFlow"

const PredictorTherapistRoute = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      if (!currentUser) {
        // Redirect to login if not authenticated
        navigate("/MindMendor/login", {
          replace: true,
          state: { from: location.pathname },
        })
      }
    })

    return () => unsubscribe()
  }, [navigate, location])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return <PredictorTherapistFlow />
}

export default PredictorTherapistRoute
