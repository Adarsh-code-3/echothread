"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Square, Check } from "lucide-react"

type RecordingState = "idle" | "recording" | "processing" | "done"

export default function VoiceButton() {
  const [state, setState] = useState<RecordingState>("idle")
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (state === "recording") {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s >= 30) {
            setState("processing")
            return 0
          }
          return s + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [state])

  useEffect(() => {
    if (state === "processing") {
      const timeout = setTimeout(() => {
        setState("done")
      }, 2000)
      return () => clearTimeout(timeout)
    }
    if (state === "done") {
      const timeout = setTimeout(() => {
        setState("idle")
        setSeconds(0)
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [state])

  const handleClick = () => {
    if (state === "idle") {
      setState("recording")
      setSeconds(0)
    } else if (state === "recording") {
      setState("processing")
      setSeconds(0)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Pulse rings */}
        <AnimatePresence>
          {state === "recording" && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-coral-500/20"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                className="absolute inset-0 rounded-full bg-coral-500/30"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          onClick={handleClick}
          whileTap={{ scale: 0.95 }}
          className={`relative z-10 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full flex items-center justify-center transition-all duration-300 ${
            state === "idle"
              ? "bg-gradient-to-br from-coral-500 to-coral-400 shadow-xl shadow-coral-500/25 hover:shadow-2xl hover:shadow-coral-500/35 animate-pulse-glow"
              : state === "recording"
              ? "bg-gradient-to-br from-red-500 to-red-400 shadow-xl shadow-red-500/30"
              : state === "processing"
              ? "bg-gradient-to-br from-amber-500 to-amber-400 shadow-xl shadow-amber-500/25"
              : "bg-gradient-to-br from-green-500 to-green-400 shadow-xl shadow-green-500/25"
          }`}
        >
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="mic"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </motion.div>
            )}
            {state === "recording" && (
              <motion.div
                key="stop"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center"
              >
                <Square className="w-8 h-8 text-white fill-white" />
                <span className="text-white text-xs font-bold mt-1">{seconds}s</span>
              </motion.div>
            )}
            {state === "processing" && (
              <motion.div
                key="processing"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" }, scale: { type: "spring" } }}
              >
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                </svg>
              </motion.div>
            )}
            {state === "done" && (
              <motion.div
                key="done"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={state}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-sm text-muted text-center"
        >
          {state === "idle" && "Tap to record your moment"}
          {state === "recording" && "Recording... tap to stop"}
          {state === "processing" && "Weaving your thread..."}
          {state === "done" && "Thread saved"}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
