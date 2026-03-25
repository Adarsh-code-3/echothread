"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, Mic } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/Navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  text: string
}

const suggestedQuestions = [
  "When was the last time I felt truly peaceful?",
  "What has been worrying me lately?",
  "Who have I mentioned most?",
  "What makes me feel grateful?",
]

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      })

      const data = await res.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.response || "I could not find relevant entries for that question. Try recording more threads first.",
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "Something went wrong while searching your threads. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0F0F14] flex flex-col transition-colors">
      <Navigation />

      <div className="fixed top-0 left-0 right-0 z-40 bg-cream/90 dark:bg-[#0F0F14]/90 backdrop-blur-xl border-b border-orange-100/50 dark:border-white/10 md:top-16">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/dashboard" className="text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-ink dark:text-white font-serif">Talk to Your Story</h1>
            <p className="text-xs text-muted dark:text-gray-400">Ask questions about your life archive</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-28 md:pt-40 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-coral-500/10 flex items-center justify-center mb-4">
              <Mic className="w-8 h-8 text-coral-500" />
            </div>
            <h2 className="text-xl font-bold text-ink dark:text-white mb-2">Your memory awaits</h2>
            <p className="text-muted dark:text-gray-400 text-sm max-w-xs mb-8">
              Ask anything about your recorded threads. Your memory will search your archive and find the answer.
            </p>
            <div className="space-y-2 w-full max-w-sm">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-4 py-3 bg-white dark:bg-white/5 rounded-xl border border-orange-50 dark:border-white/10 text-sm text-ink dark:text-gray-200 hover:border-coral-500/20 hover:shadow-sm transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-500/20 to-purple-500/20 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-coral-500 to-purple-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-coral-500 to-coral-400 text-white rounded-br-md"
                        : "bg-white dark:bg-white/5 border border-orange-50 dark:border-white/10 text-ink dark:text-gray-200 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className={`text-sm leading-relaxed ${msg.role === "assistant" ? "font-serif" : ""}`}>
                      {msg.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-coral-500 to-purple-500" />
                </div>
                <div className="bg-white dark:bg-white/5 border border-orange-50 dark:border-white/10 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-coral-500/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-coral-500/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-coral-500/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-cream/90 dark:bg-[#0F0F14]/90 backdrop-blur-xl border-t border-orange-100/50 dark:border-white/10 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your past self anything..."
            className="flex-1 bg-white dark:bg-white/5 border border-orange-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-ink dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-coral-500/30 focus:ring-2 focus:ring-coral-500/10 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center text-white hover:shadow-lg hover:shadow-coral-500/25 transition-all active:scale-95 disabled:opacity-40 disabled:hover:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
