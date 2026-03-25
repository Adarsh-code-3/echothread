"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Play, Pause, Clock, Lightbulb } from "lucide-react"
import { useState } from "react"
import Navigation from "@/components/Navigation"
import { moodBadgeColors, moodLabels } from "@/components/ThreadCard"
import { mockThreads } from "@/lib/mock-data"

function ThreadContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id") || "1"
  const thread = mockThreads.find((t) => t.id === id) || mockThreads[0]!
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-8">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 pt-20 md:pt-24">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to timeline
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-coral-500/5 to-amber-500/5 rounded-2xl p-6 border border-orange-50">
            <p className="text-sm text-muted mb-1">{thread.date}</p>
            <p className="text-2xl font-bold text-ink">{thread.time}</p>
          </div>
        </motion.div>

        {/* Audio player */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-orange-50 shadow-sm mb-6"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center flex-shrink-0 hover:shadow-lg hover:shadow-coral-500/25 transition-all active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-[2px] h-8">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-coral-500/20"
                    style={{
                      height: `${Math.random() * 100}%`,
                      minHeight: "4px",
                      backgroundColor: i < 15 && isPlaying ? "rgb(255, 107, 107)" : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              0:{thread.duration.toString().padStart(2, "0")}
            </div>
          </div>
        </motion.div>

        {/* Polished text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-orange-50 shadow-sm mb-6"
        >
          <p className="font-serif text-ink text-lg leading-[1.8] whitespace-pre-line">
            {thread.polished}
          </p>
        </motion.div>

        {/* Mood */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 border border-orange-50 shadow-sm mb-4"
        >
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Mood</h3>
          <div className="flex items-center gap-3">
            <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${moodBadgeColors[thread.mood] || "bg-gray-50 text-gray-700"}`}>
              {moodLabels[thread.mood] || thread.mood}
            </span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${thread.moodScore * 100}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-coral-500 to-amber-400"
              />
            </div>
            <span className="text-sm text-muted font-mono">{thread.moodScore.toFixed(2)}</span>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl p-5 border border-orange-50 shadow-sm mb-4"
        >
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Threads</h3>
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
          className="bg-gradient-to-br from-coral-500/5 to-purple-500/5 rounded-2xl p-5 border border-coral-500/10 mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-coral-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-coral-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink mb-2">AI Insight</h3>
              <p className="text-sm text-muted leading-relaxed">{thread.insight}</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function ThreadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><div className="animate-pulse text-muted">Loading thread...</div></div>}>
      <ThreadContent />
    </Suspense>
  )
}
