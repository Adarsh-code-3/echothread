"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, TrendingUp, Users, Sparkles, Calendar } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/Navigation"

interface Review {
  month: string
  year: number
  title: string
  totalThreads: number
  streakDays: number
  topMood: string
  moodArc: { day: number; score: number; mood: string }[]
  highlights: { date: string; text: string }[]
  patterns: string[]
  peopleMentioned: string[]
}

function MoodArcChart({ data }: { data: Review["moodArc"] }) {
  if (data.length === 0) return <p className="text-sm text-muted dark:text-gray-400 text-center py-8">No mood data yet. Record some threads to see your mood arc.</p>

  const maxScore = 1
  const chartHeight = 120
  const chartWidth = 100

  const moodColorMap: Record<string, string> = {
    joyful: "#FBBF24",
    calm: "#60A5FA",
    reflective: "#A78BFA",
    grateful: "#F9A825",
    excited: "#FB923C",
    sad: "#94A3B8",
    anxious: "#F87171",
    neutral: "#D1D5DB",
  }

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-32"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="25%" stopColor="#A78BFA" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="75%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
          <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${chartHeight} ${data
            .map(
              (d, i) =>
                `L ${(i / Math.max(data.length - 1, 1)) * chartWidth} ${chartHeight - (d.score / maxScore) * chartHeight * 0.85}`
            )
            .join(" ")} L ${chartWidth} ${chartHeight} Z`}
          fill="url(#fillGradient)"
        />
        <path
          d={data
            .map(
              (d, i) =>
                `${i === 0 ? "M" : "L"} ${(i / Math.max(data.length - 1, 1)) * chartWidth} ${
                  chartHeight - (d.score / maxScore) * chartHeight * 0.85
                }`
            )
            .join(" ")}
          fill="none"
          stroke="url(#moodGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i / Math.max(data.length - 1, 1)) * chartWidth}
            cy={chartHeight - (d.score / maxScore) * chartHeight * 0.85}
            r="1.2"
            fill={moodColorMap[d.mood] || "#D1D5DB"}
          />
        ))}
      </svg>
      <div className="flex justify-between px-1 mt-1">
        <span className="text-[10px] text-muted dark:text-gray-500">Day {data[0]?.day || 1}</span>
        <span className="text-[10px] text-muted dark:text-gray-500">Day {data[data.length - 1]?.day || 1}</span>
      </div>
    </div>
  )
}

function SkeletonBlock() {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-orange-50 dark:border-white/10 animate-pulse">
      <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export default function ReviewPage() {
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReview() {
      try {
        const res = await fetch("/api/review")
        const data = await res.json()
        setReview(data)
      } catch (err) {
        console.error("Failed to fetch review:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReview()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#0F0F14] pb-24 md:pb-8 transition-colors">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 pt-20 md:pt-24 space-y-6">
          <SkeletonBlock />
          <SkeletonBlock />
        </main>
      </div>
    )
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#0F0F14] flex items-center justify-center transition-colors">
        <p className="text-muted dark:text-gray-400">Failed to load review</p>
      </div>
    )
  }

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
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-ink dark:text-white tracking-tight font-serif">
            {review.month} {review.year}
          </h1>
          <p className="text-muted dark:text-gray-400 mt-1">{review.title}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-orange-50 dark:border-white/10 shadow-sm mb-6"
        >
          <h2 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-4">Mood Arc</h2>
          <MoodArcChart data={review.moodArc} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-orange-50 dark:border-white/10 shadow-sm text-center">
            <Calendar className="w-5 h-5 text-coral-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-ink dark:text-white">{review.totalThreads}</p>
            <p className="text-xs text-muted dark:text-gray-400">Threads</p>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-orange-50 dark:border-white/10 shadow-sm text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-ink dark:text-white">{review.streakDays}</p>
            <p className="text-xs text-muted dark:text-gray-400">Day streak</p>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-orange-50 dark:border-white/10 shadow-sm text-center">
            <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-ink dark:text-white">{review.topMood}</p>
            <p className="text-xs text-muted dark:text-gray-400">Top mood</p>
          </div>
        </motion.div>

        {review.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-4">Highlights</h2>
            <div className="space-y-4">
              {review.highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-orange-50 dark:border-white/10 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl text-coral-500/20 font-serif leading-none select-none">&ldquo;</div>
                    <div>
                      <p className="font-serif text-ink dark:text-gray-200 leading-relaxed text-[15px]">{highlight.text}</p>
                      <p className="text-xs text-muted dark:text-gray-500 mt-3 font-medium">{highlight.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-orange-50 dark:border-white/10 shadow-sm mb-6"
        >
          <h2 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-4">Patterns</h2>
          <div className="space-y-3">
            {review.patterns.map((pattern, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-ink dark:text-gray-200 leading-relaxed">{pattern}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {review.peopleMentioned.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-orange-50 dark:border-white/10 shadow-sm mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-muted dark:text-gray-400" />
              <h2 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider">People in Your Story</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {review.peopleMentioned.map((person) => (
                <span key={person} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {person}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/book">
            <div className="bg-gradient-to-br from-coral-500/10 to-amber-500/10 dark:from-coral-500/20 dark:to-amber-500/20 rounded-2xl p-6 border border-coral-500/10 text-center hover:shadow-md transition-all duration-300 cursor-pointer">
              <BookOpen className="w-8 h-8 text-coral-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-ink dark:text-white mb-1">Generate Your {review.month} Book</h3>
              <p className="text-sm text-muted dark:text-gray-400">Turn this month into a beautifully formatted keepsake</p>
            </div>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
