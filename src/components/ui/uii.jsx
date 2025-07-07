"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, LogOut, ChevronDown, Brain, MessageCircle, Sparkles, Menu, X, Bell } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { auth, firestore } from "../../Database/Firebase"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import EnhancedChatInput from "./ChatInput"

function UI() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showExploreMenu, setShowExploreMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [username, setUsername] = useState("User")
  const [userType, setUserType] = useState("user")
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(3)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        setLoading(true)

        // First try to get user data from Users collection
        try {
          const userRef = doc(firestore, "Users", user.uid)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            const userData = userSnap.data()
            setUsername(userData.name || "User")
            setUserType("user")
            setLoading(false)
            return
          }
        } catch (userError) {
          console.log("User not found in Users collection:", userError.message)
        }

        // If not found in Users, try Therapists collection
        try {
          const therapistRef = doc(firestore, "Therapists", user.uid)
          const therapistSnap = await getDoc(therapistRef)

          if (therapistSnap.exists()) {
            const therapistData = therapistSnap.data()
            setUsername(therapistData.name || "Therapist")
            setUserType("therapist")
            setLoading(false)
            return
          }
        } catch (therapistError) {
          console.log("User not found in Therapists collection:", therapistError.message)
        }

        // If not found in either collection, use Firebase Auth data
        setUsername(user.displayName || user.email?.split("@")[0] || "User")
        setUserType("user")
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUsername(user.displayName || user.email?.split("@")[0] || "User")
        setUserType("user")
      } finally {
        setLoading(false)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user)
      } else {
        setUsername("Guest")
        setLoading(false)
        navigate("/MindMendor/")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/MindMendor/")
    } catch (error) {
      console.error("Logout Error:", error.message)
    }
  }

  const generateAvatar = (name) => {
    return name?.charAt(0)?.toUpperCase() || "U"
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-screen h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-white text-xl font-semibold">Loading MindMendor...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-screen h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-[9998] backdrop-blur-xl bg-slate-900/50 border-b border-cyan-500/20 shadow-2xl"
      >
        <div className="py-4 px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              MindMendor
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <motion.div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowExploreMenu(!showExploreMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-white transition-all duration-200 border border-slate-600/50 hover:border-cyan-400/50"
              >
                <Sparkles className="w-4 h-4" />
                Explore More
                <ChevronDown className={`w-4 h-4 transition-transform ${showExploreMenu ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {showExploreMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full mt-2 right-0 w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl py-2 z-[9999]"
                  >
                    <Link
                      to="/MindMendor/predict"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-white"
                      onClick={() => setShowExploreMenu(false)}
                    >
                      <Brain className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="font-medium">🧠 Sentiment Analysis & Therapists</p>
                        <p className="text-sm text-slate-400">Analyze mood and find therapists</p>
                      </div>
                    </Link>
                    <Link
                      to="/MindMendor/meet"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-white"
                      onClick={() => setShowExploreMenu(false)}
                    >
                      <MessageCircle className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium">💬 Anonymous Conversation</p>
                        <p className="text-sm text-slate-400">Talk to someone anonymously</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <p className="text-white font-medium">
                Welcome, {username}
                {userType === "therapist" && (
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Therapist</span>
                )}
              </p>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-400" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer border-2 border-cyan-400/50 hover:border-cyan-400 transition-all shadow-lg"
                >
                  {generateAvatar(username)}
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full mt-2 right-0 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl py-2 z-[9999]"
                    >
                      <Link
                        to="/MindMendor/account"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-white"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="w-4 h-4" />👤 Profile
                      </Link>
                      {userType === "therapist" && (
                        <Link
                          to="/MindMendor/therapist-dashboard"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-white"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Brain className="w-4 h-4" />🏥 Dashboard
                        </Link>
                      )}
                      <button className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-white w-full text-left">
                        <Settings className="w-4 h-4" />
                        ⚙️ Settings
                      </button>
                      <div className="border-t border-slate-600/50 my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-red-400 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />🚪 Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 bg-slate-800/50 rounded-xl text-white"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-600/50"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {generateAvatar(username)}
                  </div>
                  <div>
                    <p className="font-medium">{username}</p>
                    {userType === "therapist" && <p className="text-xs text-green-400">Therapist</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/MindMendor/predict"
                    className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Brain className="w-5 h-5 text-cyan-400" />🧠 Sentiment Analysis & Therapists
                  </Link>
                  <Link
                    to="/MindMendor/meet"
                    className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <MessageCircle className="w-5 h-5 text-purple-400" />💬 Anonymous Conversation
                  </Link>
                  <Link
                    to="/MindMendor/account"
                    className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="w-5 h-5 text-slate-400" />👤 Profile
                  </Link>
                  {userType === "therapist" && (
                    <Link
                      to="/MindMendor/therapist-dashboard"
                      className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl text-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Brain className="w-5 h-5 text-green-400" />🏥 Dashboard
                    </Link>
                  )}
                  <button className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl text-white w-full text-left">
                    <Settings className="w-5 h-5 text-slate-400" />
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 bg-red-500/20 rounded-xl text-red-400 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />🚪 Log out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
            >
              Your AI Mental Health Companion
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-300 max-w-2xl mx-auto"
            >
              Get instant support, connect with professionals, or chat anonymously. Your mental health journey starts
              here.
            </motion.p>
          </motion.div>

          {/* Chat Interface */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <EnhancedChatInput />
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-slate-400">AI Support</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-slate-400">Anonymous</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-slate-400">Therapists</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default UI
