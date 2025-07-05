"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import TherapistList from "../components/Therapists/Page"
import CrisisResources from "./CrisisResources"

const PredictorTherapistFlow = () => {
  const [showTherapists, setShowTherapists] = useState(false)
  const [sentimentResult, setSentimentResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCrisisResources, setShowCrisisResources] = useState(false)
  const navigate = useNavigate()

  // Handle prediction submission
  const handlePredictionSubmit = async (text) => {
    setLoading(true)
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", { text })
      const prediction = response.data.prediction
      setSentimentResult(prediction)

      // Check if sentiment is negative to show crisis resources
      const isNegative = prediction.toLowerCase().includes("suicidal")
        // prediction.toLowerCase().includes("negative") ||
        // prediction.toLowerCase().includes("very negative") ||
        // prediction.toLowerCase().includes("extremely negative")

      setShowCrisisResources(isNegative)

      // Show therapist list after prediction
      setShowTherapists(true)

      // Scroll to appropriate section after a short delay
      setTimeout(() => {
        if (isNegative) {
          document.getElementById("crisis-resources")?.scrollIntoView({
            behavior: "smooth",
          })
        } else {
          document.getElementById("therapist-section")?.scrollIntoView({
            behavior: "smooth",
          })
        }
      }, 500)
    } catch (error) {
      console.error("Error:", error)
      setSentimentResult("Error connecting to the server")

      // Still show therapists even if prediction fails
      setShowTherapists(true)
      setTimeout(() => {
        document.getElementById("therapist-section")?.scrollIntoView({
          behavior: "smooth",
        })
      }, 500)
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#212121] min-h-screen">
      {/* Header with back button */}
      <div className="p-4">
        <button
          onClick={() => navigate("/MindMendor/ui")}
          className="text-gray-300 flex items-center gap-2 hover:text-gray-100 cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Go back
        </button>
      </div>

      {/* Predictor Section */}
      <section className="py-8">
        <PredictorWrapper onSubmit={handlePredictionSubmit} loading={loading} result={sentimentResult} />
      </section>

      {/* Crisis Resources Section - Only shown for negative sentiment */}
      <AnimatePresence>
        {showCrisisResources && (
          <motion.section id="crisis-resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CrisisResources visible={showCrisisResources} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Therapist Section - Only shown after prediction */}
      <AnimatePresence>
        {showTherapists && (
          <motion.section
            id="therapist-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-4 pb-16"
          >
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-4">Recommended Therapists</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">{getSentimentMessage(sentimentResult)}</p>
              </motion.div>

              <TherapistList hideBackButton={true} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

// Wrapper component for Predictor to handle the submission
const PredictorWrapper = ({ onSubmit, loading, result }) => {
  const [text, setText] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-900 shadow-xl rounded-xl p-8 max-w-xl w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Sentiment Analyzer 🧠</h2>
        <p className="text-gray-300 text-center mb-6">
          Tell us how you're feeling, and we'll recommend the best therapists for you.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="text"
            placeholder="Type something like: How was your day? I've been feeling anxious lately..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
            className="w-full p-4 border rounded-lg bg-gray-800 text-white shadow-sm focus:ring-2 focus:ring-blue-500 resize-none border-gray-600"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze & Find Therapists"}
          </motion.button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-800 rounded-lg"
          >
            <p className="text-center text-lg font-semibold text-gray-300">
              Sentiment Analysis Result:{" "}
              <span
                className={`${
                  result.toLowerCase().includes("negative")
                    ? "text-red-400"
                    : result.toLowerCase().includes("positive")
                      ? "text-green-400"
                      : "text-yellow-400"
                }`}
              >
                {result}
              </span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Helper function to generate appropriate message based on sentiment
const getSentimentMessage = (sentiment) => {
  if (!sentiment) {
    return "Here are our recommended therapists who can provide support and guidance for your mental health journey."
  }

  if (sentiment.toLowerCase().includes("negative")) {
    return "Based on your sentiment analysis, we've selected therapists who specialize in helping with challenging emotions and difficult situations."
  } else if (sentiment.toLowerCase().includes("positive")) {
    return "Great to see your positive outlook! Here are therapists who can help you maintain and build on your emotional wellbeing."
  } else {
    return "Here are our recommended therapists who can provide support and guidance for your mental health journey."
  }
}

export default PredictorTherapistFlow
