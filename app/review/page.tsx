"use client"

import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, TrendingUp, Users, Sparkles, Calendar } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { mockReview } from "@/lib/mock-data"

function MoodArcChart() {
  const data = mockReview.moodArc
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
        {/* Fill area */}
        <path
          d={`M 0 ${chartHeight} ${data
            .map(
              (d, i) =>
                `L ${(i / (data.length - 1)) * chartWidth} ${chartHeight - (d.score / maxScore) * chartHeight * 0.85}`
            )
            .join(" ")} L ${chartWidth} ${chartHeight} Z`}
          fill="url(#fillGradient)"
        />
        {/* Line */}
        <path
          d={data
            .map(
              (d, i) =>
                `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * chartWidth} ${
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
        {/* Dots */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * chartWidth}
            cy={chartHeight - (d.score / maxScore) * chartHeight * 0.85}
            r="1.2"
            fill={moodColorMap[d.mood] || "#D1D5DB"}
          />
        ))}
      </svg>
      <div className="flex justify-between px-1 mt-1">
        <span className="text-[10px] text-muted">Feb 1</span>
        <span className="text-[10px] text-muted">Feb 14</span>
        <span className="text-[10px] text-muted">Feb 28</span>
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const review = mockReview

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-8">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 pt-20 md:pt-24">
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
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight font-serif">
            {review.month} {review.year}
          </h1>
          <p className="text-muted mt-1">{review.title}</p>
        </motion.div>

        {/* Mood arc */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-orange-50 shadow-sm mb-6"
        >
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Mood Arc</h2>
          <MoodArcChart />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white rounded-xl p-4 border border-orange-50 shadow-sm text-center">
            <Calendar className="w-5 h-5 text-coral-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-ink">{review.totalThreads}</p>
            <p className="text-xs text-muted">Threads</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-50 shadow-sm text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-ink">{review.streakDays}</p>
            <p className="text-xs text-muted">Day streak</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-50 shadow-sm text-center">
            <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-ink">{review.topMood}</p>
            <p className="text-xs text-muted">Top mood</p>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Highlights</h2>
          <div className="space-y-4">
            {review.highlights.map((highlight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white rounded-2xl p-5 border border-orange-50 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-coral-500/20 font-serif leading-none select-none">&ldquo;</div>
                  <div>
                    <p className="font-serif text-ink leading-relaxed text-[15px]">{highlight.text}</p>
                    <p className="text-xs text-muted mt-3 font-medium">{highlight.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-orange-50 shadow-sm mb-6"
        >
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Patterns</h2>
          <div className="space-y-3">
            {review.patterns.map((pattern, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-ink leading-relaxed">{pattern}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* People */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-6 border border-orange-50 shadow-sm mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-muted" />
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">People in Your Story</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {review.peopleMentioned.map((person) => (
              <span key={person} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {person}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Generate book CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/book">
            <div className="bg-gradient-to-br from-coral-500/10 to-amber-500/10 rounded-2xl p-6 border border-coral-500/10 text-center hover:shadow-md transition-all duration-300 cursor-pointer">
              <BookOpen className="w-8 h-8 text-coral-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-ink mb-1">Generate Your {review.month} Book</h3>
              <p className="text-sm text-muted">Turn this month into a beautifully formatted keepsake</p>
            </div>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
