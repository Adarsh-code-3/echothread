"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Play, Pause, Clock, Lightbulb } from "lucide-react"
import Navigation from "@/components/Navigation"
import { moodBadgeColors, moodLabels } from "@/components/ThreadCard"

interface ThreadData {
  id: string
  transcript: string
  polished: string
  summary: string
  mood: string
  moodScore: number
  tags: { name: string; category: string; color: string }[]
  insight: string
  audioData: string | null
  duration: number
  createdAt: string
}

function ThreadContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [thread, setThread] = useState<ThreadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    async function fetchThread() {
      try {
        const res = await fetch("/api/threads")
        const threads: ThreadData[] = await res.json()
        const found = threads.find((t) => t.id === id)
        if (found) setThread(found)
      } catch (err) {
        console.error("Failed to fetch thread:", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchThread()
  }, [id])

  useEffect(() => {
    if (thread?.audioData && !audioRef.current) {
      const audio = new Audio(thread.audioData)
      audio.onended = () => {
        setIsPlaying(false)
        setProgress(0)
      }
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100)
        }
      }
      audioRef.current = audio
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [thread?.audioData])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#0F0F14] flex items-center justify-center transition-colors">
        <div className="animate-pulse text-muted dark:text-gray-400">Loading thread...</div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#0F0F14] flex items-center justify-center transition-colors">
        <div className="text-center">
          <p className="text-muted dark:text-gray-400 mb-4">Thread not found</p>
          <Link href="/dashboard" className="text-coral-500 hover:underline">Back to dashboard</Link>
        </div>
      </div>
    )
  }

  const date = new Date(thread.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const time = new Date(thread.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0F0F14] pb-24 md:pb-8 transition-colors">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 pt-20 md:pt-24">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to timeline
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-coral-500/5 to-amber-500/5 dark:from-coral-500/10 dark:to-amber-500/10 rounded-2xl p-6 border border-orange-50 dark:border-white/10">
            <p className="text-sm text-muted dark:text-gray-400 mb-1">{date}</p>
            <p className="text-2xl font-bold text-ink dark:text-white">{time}</p>
          </div>
        </motion.div>

        {/* Audio player */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-white/5 rounded-xl p-4 border border-orange-50 dark:border-white/10 shadow-sm mb-6"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              disabled={!thread.audioData}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center flex-shrink-0 hover:shadow-lg hover:shadow-coral-500/25 transition-all active:scale-95 disabled:opacity-40"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              {thread.audioData ? (
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-coral-500 to-coral-400 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : (
                <p className="text-xs text-muted dark:text-gray-500">No audio available for this thread</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted dark:text-gray-400 flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              0:{thread.duration.toString().padStart(2, "0")}
            </div>
          </div>
        </motion.div>

        {/* Transcript */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-orange-50 dark:border-white/10 shadow-sm mb-4"
        >
          <h3 className="text-xs font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-3">Original transcript</h3>
          <p className="text-sm text-muted dark:text-gray-400 leading-relaxed italic">
            &ldquo;{thread.transcript}&rdquo;
          </p>
        </motion.div>

        {/* Polished text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-white/5 rounded-2xl p-6 sm:p-8 border border-orange-50 dark:border-white/10 shadow-sm mb-6"
        >
          <h3 className="text-xs font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-3">Polished entry</h3>
          <p className="font-serif text-ink dark:text-gray-200 text-lg leading-[1.8] whitespace-pre-line">
            {thread.polished}
          </p>
        </motion.div>

        {/* Mood */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-white/5 rounded-xl p-5 border border-orange-50 dark:border-white/10 shadow-sm mb-4"
        >
          <h3 className="text-xs font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-3">Mood</h3>
          <div className="flex items-center gap-3">
            <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${moodBadgeColors[thread.mood] || "bg-gray-50 text-gray-700"}`}>
              {moodLabels[thread.mood] || thread.mood}
            </span>
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${thread.moodScore * 100}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-coral-500 to-amber-400"
              />
            </div>
            <span className="text-sm text-muted dark:text-gray-400 font-mono">{thread.moodScore.toFixed(2)}</span>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-white/5 rounded-xl p-5 border border-orange-50 dark:border-white/10 shadow-sm mb-4"
        >
          <h3 className="text-xs font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {thread.tags.map((tag) => (
              <span
                key={tag.name}
                className={`text-sm px-3 py-1.5 rounded-full font-medium ${tag.color}`}
              >
                {tag.name}
                <span className="text-xs opacity-60 ml-1">({tag.category})</span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-coral-500/5 to-purple-500/5 dark:from-coral-500/10 dark:to-purple-500/10 rounded-2xl p-5 border border-coral-500/10 mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-coral-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-coral-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink dark:text-white mb-2">Insight</h3>
              <p className="text-sm text-muted dark:text-gray-400 leading-relaxed">{thread.insight}</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function ThreadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream dark:bg-[#0F0F14] flex items-center justify-center"><div className="animate-pulse text-muted dark:text-gray-400">Loading thread...</div></div>}>
      <ThreadContent />
    </Suspense>
  )
}
