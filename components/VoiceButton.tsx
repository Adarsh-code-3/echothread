"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Square, Check } from "lucide-react"

type RecordingState = "idle" | "recording" | "processing" | "done" | "error"

interface VoiceButtonProps {
  onThreadCreated?: () => void
}

export default function VoiceButton({ onThreadCreated }: VoiceButtonProps) {
  const [state, setState] = useState<RecordingState>("idle")
  const [seconds, setSeconds] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef("")

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (state === "recording") {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s >= 60) {
            stopRecording()
            return 0
          }
          return s + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [state])

  const startRecording = useCallback(async () => {
    try {
      setErrorMsg("")
      transcriptRef.current = ""
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      })

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(100)

      // Start speech recognition if available
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event: any) => {
          let finalTranscript = ""
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " "
            }
          }
          if (finalTranscript) {
            transcriptRef.current = finalTranscript.trim()
          }
        }

        recognition.onerror = () => {}
        recognition.start()
        recognitionRef.current = recognition
      }

      setState("recording")
      setSeconds(0)
    } catch {
      setErrorMsg("Microphone access denied. Please allow microphone access.")
      setState("error")
      setTimeout(() => setState("idle"), 3000)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    setState("processing")
    setSeconds(0)

    // Stop speech recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      recognitionRef.current = null
    }

    // Stop media recorder
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === "inactive") {
      setState("idle")
      return
    }

    await new Promise<void>((resolve) => {
      recorder.onstop = () => {
        recorder.stream.getTracks().forEach((t) => t.stop())
        resolve()
      }
      recorder.stop()
    })

    // Create audio blob
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })

    // Convert to base64
    const reader = new FileReader()
    const audioData = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(audioBlob)
    })

    // Get transcript (use speech recognition result or fallback)
    let transcript = transcriptRef.current
    if (!transcript) {
      transcript = "Voice recording captured. Speech recognition was not available in this browser."
    }

    // Calculate approximate duration from seconds counter
    const duration = seconds || Math.round(audioBlob.size / 4000)

    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, audioData, duration }),
      })

      if (!res.ok) throw new Error("Failed to save")

      setState("done")
      onThreadCreated?.()
      setTimeout(() => {
        setState("idle")
        setSeconds(0)
      }, 2000)
    } catch {
      setErrorMsg("Failed to save thread. Please try again.")
      setState("error")
      setTimeout(() => setState("idle"), 3000)
    }
  }, [seconds, onThreadCreated])

  const handleClick = () => {
    if (state === "idle") {
      startRecording()
    } else if (state === "recording") {
      stopRecording()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
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
              : state === "error"
              ? "bg-gradient-to-br from-red-600 to-red-500 shadow-xl shadow-red-500/25"
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
            {state === "error" && (
              <motion.div
                key="error"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <span className="text-white text-2xl font-bold">!</span>
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
          className="text-sm text-muted dark:text-gray-400 text-center max-w-[250px]"
        >
          {state === "idle" && "Tap to record your moment"}
          {state === "recording" && "Recording... tap to stop"}
          {state === "processing" && "Weaving your thread..."}
          {state === "done" && "Thread saved"}
          {state === "error" && errorMsg}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
