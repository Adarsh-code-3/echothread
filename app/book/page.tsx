"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Image, Brain, BarChart3, Heart, Download, Share2 } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/Navigation"

const coverStyles = [
  { id: "watercolor", name: "Watercolor", gradient: "from-rose-300 via-amber-200 to-purple-300" },
  { id: "geometric", name: "Geometric", gradient: "from-blue-400 via-cyan-300 to-teal-400" },
  { id: "minimal", name: "Minimal", gradient: "from-gray-200 via-cream to-gray-200" },
  { id: "botanical", name: "Botanical", gradient: "from-green-300 via-emerald-200 to-lime-300" },
]

export default function BookPage() {
  const [selectedCover, setSelectedCover] = useState("watercolor")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeInsights, setIncludeInsights] = useState(true)
  const [includePhotos, setIncludePhotos] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 3000)
  }

  const activeCover = coverStyles.find((c) => c.id === selectedCover) || coverStyles[0]!

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
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight font-serif mb-2">
            Your 2025 Story
          </h1>
          <p className="text-muted">Transform your year of threads into a beautiful keepsake</p>
        </motion.div>

        {/* Book preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="relative" style={{ perspective: "1000px" }}>
            <motion.div
              animate={{ rotateY: 5, rotateX: 2 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className={`w-56 h-72 sm:w-64 sm:h-80 rounded-xl bg-gradient-to-br ${activeCover?.gradient} shadow-2xl shadow-coral-500/10 flex flex-col items-center justify-center p-8 relative overflow-hidden`}
            >
              {/* Subtle texture overlay */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, rgba(0,0,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.1) 0%, transparent 50%)`
              }} />
              <div className="relative z-10 text-center">
                <p className="text-sm font-medium text-ink/60 mb-2">A Year of Threads</p>
                <h2 className="text-2xl font-bold text-ink/80 font-serif mb-1">Atharv</h2>
                <p className="text-lg text-ink/60 font-serif">2025</p>
                <div className="w-12 h-[2px] bg-ink/20 mx-auto mt-4 rounded-full" />
              </div>
              {/* Spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xl" />
            </motion.div>

            {/* Floating particles */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-coral-500/10 blur-sm"
            />
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-purple-500/10 blur-sm"
            />
          </div>
        </motion.div>

        {/* Cover style selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-orange-50 shadow-sm mb-4"
        >
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Cover Style</h3>
          <div className="grid grid-cols-4 gap-3">
            {coverStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedCover(style.id)}
                className={`rounded-xl p-1 transition-all duration-200 ${
                  selectedCover === style.id
                    ? "ring-2 ring-coral-500 ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-200 hover:ring-offset-1"
                }`}
              >
                <div className={`w-full aspect-[3/4] rounded-lg bg-gradient-to-br ${style.gradient}`} />
                <p className="text-xs text-center mt-1.5 font-medium text-muted">{style.name}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-6 border border-orange-50 shadow-sm mb-4"
        >
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Include in Book</h3>
          <div className="space-y-3">
            {[
              { icon: BarChart3, label: "Mood charts and visualizations", value: includeCharts, setter: setIncludeCharts },
              { icon: Brain, label: "AI insights and patterns", value: includeInsights, setter: setIncludeInsights },
              { icon: Image, label: "Attached photos", value: includePhotos, setter: setIncludePhotos },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => option.setter(!option.value)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-cream/50 transition-colors"
              >
                <option.icon className="w-5 h-5 text-muted flex-shrink-0" />
                <span className="text-sm text-ink flex-1 text-left">{option.label}</span>
                <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${option.value ? "bg-coral-500" : "bg-gray-200"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 mt-0.5 ${option.value ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-orange-50 shadow-sm mb-6"
        >
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Book Preview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-cream rounded-xl">
              <p className="text-2xl font-bold text-ink">287</p>
              <p className="text-xs text-muted">Total threads</p>
            </div>
            <div className="text-center p-3 bg-cream rounded-xl">
              <p className="text-2xl font-bold text-ink">12</p>
              <p className="text-xs text-muted">Chapters (months)</p>
            </div>
            <div className="text-center p-3 bg-cream rounded-xl">
              <p className="text-2xl font-bold text-ink">42</p>
              <p className="text-xs text-muted">People mentioned</p>
            </div>
            <div className="text-center p-3 bg-cream rounded-xl">
              <p className="text-2xl font-bold text-ink">~180</p>
              <p className="text-xs text-muted">Estimated pages</p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3 mb-8"
        >
          {!generated ? (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-coral-500/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {generating ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  Generating your book...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Generate PDF
                </>
              )}
            </button>
          ) : (
            <>
              <button className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Your Book
              </button>
              <button className="w-full py-4 bg-white text-ink font-semibold rounded-2xl border border-orange-100 hover:border-coral-500/30 hover:shadow-md transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5 text-coral-500" />
                Gift to Family
              </button>
            </>
          )}

          <p className="text-center text-xs text-muted flex items-center justify-center gap-1">
            <Heart className="w-3 h-3" />
            Your book is generated privately and never shared without your permission
          </p>
        </motion.div>
      </main>
    </div>
  )
}
