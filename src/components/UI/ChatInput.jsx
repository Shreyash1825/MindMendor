"use client"

import { Mic, Search, Send, Bot, User, Sparkles, Volume2, Copy } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { motion, AnimatePresence } from "framer-motion"

export default function ChatInput() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [typingText, setTypingText] = useState("")
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)

  const API_KEY = "AIzaSyDuMA5yLmMpISvrPWfZ3puzc-yxJAmVqAQ"
  const genAI = new GoogleGenerativeAI(API_KEY)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const typeWriter = (text, callback) => {
    let i = 0
    setTypingText("")
    const timer = setInterval(() => {
      if (i < text.length) {
        setTypingText((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
        callback()
      }
    }, 30)
  }

  const sendMessage = async (text = input) => {
    if (!text.trim()) return

    const userMessage = { sender: "user", text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const result = await model.generateContent(text)
      const response = await result.response
      const botText = response.text()

      // Add typing effect
      typeWriter(botText, () => {
        setMessages((prev) => [...prev, { sender: "bot", text: botText, timestamp: new Date() }])
        setTypingText("")
        setLoading(false)
      })
    } catch (err) {
      console.error("Error calling Gemini API:", err)
      const errorMessage = "Sorry, I'm having trouble connecting right now. Please try again."
      setMessages((prev) => [...prev, { sender: "bot", text: errorMessage, timestamp: new Date() }])
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    setIsListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
      setInput(transcript)

      if (event.results[event.results.length - 1].isFinal) {
        sendMessage(transcript)
        setIsListening(false)
      }
    }

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Chat Messages Container */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <div className="space-y-4 max-h-[500px] overflow-y-auto bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/20 shadow-2xl">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Assistant Ready</h3>
                <p className="text-slate-400">Ask me anything or use voice input to get started!</p>
              </motion.div>
            )}

            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className={`flex items-start gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </motion.div>

                <div className={`group relative max-w-[75%] ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-2xl shadow-lg ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-gradient-to-r from-slate-700 to-slate-600 text-gray-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      <span>{msg.timestamp?.toLocaleTimeString()}</span>
                      {msg.sender === "bot" && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(msg.text)}
                            className="hover:text-cyan-300 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button onClick={() => speakText(msg.text)} className="hover:text-cyan-300 transition-colors">
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-4 rounded-2xl">
                  {typingText ? (
                    <p className="text-gray-100 text-sm">{typingText}</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                        />
                      </div>
                      <span className="text-cyan-300 text-sm">AI is thinking...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      {/* Input Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="relative flex items-center group">
          <motion.div whileHover={{ scale: 1.05 }} className="absolute left-4 text-cyan-400/60 z-10">
            <Search className="w-5 h-5" />
          </motion.div>

          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            rows={1}
            placeholder="Type your message here... (Press Enter to send)"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              // Auto-resize textarea
              e.target.style.height = "auto"
              e.target.style.height = e.target.scrollHeight + "px"
            }}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-24 py-4 bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl
                       border border-cyan-500/20 focus:outline-none focus:border-cyan-400/50
                       focus:ring-2 focus:ring-cyan-400/20 placeholder:text-slate-400
                       resize-none min-h-[56px] max-h-32 transition-all duration-300
                       shadow-lg hover:shadow-xl"
            style={{ height: "auto" }}
          />

          <div className="absolute right-4 flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={startVoice}
              disabled={loading}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "hover:bg-slate-800/80 text-slate-400 hover:text-cyan-400"
              }`}
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600
                         hover:from-cyan-600 hover:to-blue-700 transition-all duration-200
                         shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Voice Recognition Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="w-2 h-2 bg-white rounded-full"
                />
                Listening...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {["Tell me a joke", "Explain quantum physics", "Write a poem", "Help with coding", "Mental health tips"].map(
          (suggestion, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(suggestion)}
              className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white
                       rounded-full text-sm border border-slate-600/50 hover:border-cyan-400/50
                       transition-all duration-200 backdrop-blur-sm"
            >
              {suggestion}
            </motion.button>
          ),
        )}
      </motion.div>
    </div>
  )
}
