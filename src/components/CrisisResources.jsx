"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Heart, Copy, ExternalLink, AlertTriangle, X } from "lucide-react"

export default function CrisisResources({ visible = true }) {
  const [expanded, setExpanded] = useState(true)
  const [copiedNumber, setCopiedNumber] = useState(null)

  const helplines = [
    { name: "National Suicide Prevention", number: "9152987821" },
    { name: "AASRA (24/7)", number: "9820466726" },
    { name: "Vandrevala Foundation (24/7)", number: "9999666555" },
    { name: "iCall Helpline", number: "9152987821" },
    { name: "Sneha India", number: "044-24640050" },
    { name: "Emergency Services", number: "112" },
    { name: "Police", number: "100" },
  ]

  const copyToClipboard = (number) => {
    navigator.clipboard.writeText(number)
    setCopiedNumber(number)
    setTimeout(() => setCopiedNumber(null), 2000)
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-4xl mx-auto my-8"
        >
          <motion.div
            className="bg-gradient-to-r from-red-500/10 via-red-500/20 to-red-500/10 backdrop-blur-lg rounded-2xl border border-red-500/30 overflow-hidden shadow-xl"
            initial={{ height: "auto" }}
            animate={{ height: expanded ? "auto" : "120px" }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600/80 to-red-700/80 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <AlertTriangle className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-white">Crisis Resources - Immediate Help Available</h2>
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                {expanded ? <X className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-center mb-6"
              >
                If you're experiencing a mental health crisis or having thoughts of suicide, please reach out for help
                immediately. You are not alone.
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helplines.map((helpline, index) => (
                  <motion.div
                    key={helpline.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between group hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/30 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{helpline.name}</p>
                        <p className="text-red-200">{helpline.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(helpline.number)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative"
                      >
                        <Copy className="w-4 h-4 text-white" />
                        <AnimatePresence>
                          {copiedNumber === helpline.number && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-red-600 px-2 py-1 rounded text-xs whitespace-nowrap"
                            >
                              Copied!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        href={`tel:${helpline.number}`}
                        className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-full transition-colors"
                      >
                        <Phone className="w-4 h-4 text-white" />
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex justify-center"
              >
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Heart className="w-4 h-4 text-red-400" />
                  <p>Remember, seeking help is a sign of strength, not weakness.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
