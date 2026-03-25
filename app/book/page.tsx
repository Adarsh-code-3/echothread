"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Brain, BarChart3, Heart, Download, Share2 } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/Navigation"

interface ThreadData {
  id: string
  polished: string
  summary: string
  mood: string
  moodScore: number
  tags: { name: string; category: string; color: string }[]
  duration: number
  createdAt: string
}

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
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [threads, setThreads] = useState<ThreadData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchThreads() {
      try {
        const res = await fetch("/api/threads")
        const data = await res.json()
        setThreads(data)
      } catch (err) {
        console.error("Failed to fetch threads:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchThreads()
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)

    // Generate a real text-based book as a downloadable file
    try {
      let content = "================================\n"
      content += "        A YEAR OF THREADS\n"
      content += "================================\n\n"
      content += `Generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}\n`
      content += `Total entries: ${threads.length}\n\n`

      // Group by month
      const grouped: Record<string, ThreadData[]> = {}
      for (const t of threads) {
        const month = new Date(t.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" })
        if (!grouped[month]) grouped[month] = []
        grouped[month].push(t)
      }

      for (const [month, entries] of Object.entries(grouped)) {
        content += `\n${"=".repeat(40)}\n`
        content += `  ${month.toUpperCase()}\n`
        content += `${"=".repeat(40)}\n\n`

        for (const entry of entries) {
          const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })
          const time = new Date(entry.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })

          content += `${date} at ${time}\n`
          content += `Mood: ${entry.mood} (${(entry.moodScore * 100).toFixed(0)}%)\n`
          content += `${"-".repeat(30)}\n\n`
          content += `${entry.polished}\n\n`

          if (includeInsights && entry.tags.length > 0) {
            content += `Tags: ${entry.tags.map(t => t.name).join(", ")}\n`
          }

          if (includeCharts) {
            const bar = "=".repeat(Math.round(entry.moodScore * 20))
            content += `Mood: [${bar}${" ".repeat(20 - bar.length)}] ${(entry.moodScore * 100).toFixed(0)}%\n`
          }

          content += "\n\n"
        }
      }

      content += "\n\n================================\n"
      content += "  Thank you for sharing your story.\n"
      content += "  Every moment matters.\n"
      content += "================================\n"

      // Create downloadable file
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "echothread-book.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setGenerated(true)
    } catch (err) {
      console.error("Failed to generate book:", err)
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    handleGenerate()
  }

  const activeCover = coverStyles.find((c) => c.id === selectedCover) || coverStyles[0]!

  const totalThreads = threads.length
  const uniquePeople = new Set(
    threads.flatMap(t => (t.tags as { name: string; category: string }[]).filter(tag => tag.category === "person").map(tag => tag.name))
  ).size
  const months = new Set(threads.map(t => new Date(t.createdAt).toLocaleString("en-US", { month: "long" }))).size

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
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-ink dark:text-white tracking-tight font-serif mb-2">
            Your Story
          </h1>
          <p className="text-muted dark:text-gray-400">Transform your threads into a beautiful keepsake</p>
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
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, rgba(0,0,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.1) 0%, transparent 50%)`
              }} />
              <div className="relative z-10 text-center">
                <p className="text-sm font-medium text-ink/60 mb-2">A Year of Threads</p>
                <h2 className="text-2xl font-bold text-ink/80 font-serif mb-1">My Journal</h2>
                <p className="text-lg text-ink/60 font-serif">{new Date().getFullYear()}</p>
                <div className="w-12 h-[2px] bg-ink/20 mx-auto mt-4 rounded-full" />
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xl" />
            </motion.div>
          </div>
        </motion.div>

        {/* Cover style selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-orange-50 dark:border-white/10 shadow-sm mb-4"
        >
          <h3 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-4">Cover Style</h3>
          <div className="grid grid-cols-4 gap-3">
            {coverStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedCover(style.id)}
                className={`rounded-xl p-1 transition-all duration-200 ${
                  selectedCover === style.id
                    ? "ring-2 ring-coral-500 ring-offset-2 dark:ring-offset-[#0F0F14]"
                    : "hover:ring-2 hover:ring-gray-200 dark:hover:ring-gray-600 hover:ring-offset-1"
                }`}
              >
                <div className={`w-full aspect-[3/4] rounded-lg bg-gradient-to-br ${style.gradient}`} />
                <p className="text-xs text-center mt-1.5 font-medium text-muted dark:text-gray-400">{style.name}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-orange-50 dark:border-white/10 shadow-sm mb-4"
        >
          <h3 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-4">Include in Book</h3>
          <div className="space-y-3">
            {[
              { icon: BarChart3, label: "Mood charts and visualizations", value: includeCharts, setter: setIncludeCharts },
              { icon: Brain, label: "Tags and patterns", value: includeInsights, setter: setIncludeInsights },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => option.setter(!option.value)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-cream/50 dark:hover:bg-white/5 transition-colors"
              >
                <option.icon className="w-5 h-5 text-muted dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm text-ink dark:text-gray-200 flex-1 text-left">{option.label}</span>
                <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${option.value ? "bg-coral-500" : "bg-gray-200 dark:bg-gray-600"}`}>
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
          className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-orange-50 dark:border-white/10 shadow-sm mb-6"
        >
          <h3 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-4">Book Preview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-cream dark:bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-ink dark:text-white">{loading ? "..." : totalThreads}</p>
              <p className="text-xs text-muted dark:text-gray-400">Total threads</p>
            </div>
            <div className="text-center p-3 bg-cream dark:bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-ink dark:text-white">{loading ? "..." : months}</p>
              <p className="text-xs text-muted dark:text-gray-400">Chapters (months)</p>
            </div>
            <div className="text-center p-3 bg-cream dark:bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-ink dark:text-white">{loading ? "..." : uniquePeople}</p>
              <p className="text-xs text-muted dark:text-gray-400">People mentioned</p>
            </div>
            <div className="text-center p-3 bg-cream dark:bg-white/5 rounded-xl">
              <p className="text-2xl font-bold text-ink dark:text-white">{loading ? "..." : `~${Math.max(1, Math.ceil(totalThreads / 2))}`}</p>
              <p className="text-xs text-muted dark:text-gray-400">Estimated pages</p>
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
          {threads.length === 0 && !loading ? (
            <div className="text-center py-4">
              <p className="text-muted dark:text-gray-400 text-sm">Record some threads first to generate your book.</p>
            </div>
          ) : !generated ? (
            <button
              onClick={handleGenerate}
              disabled={generating || loading || threads.length === 0}
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
                  Generate and Download Book
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Again
            </button>
          )}

          <p className="text-center text-xs text-muted dark:text-gray-500 flex items-center justify-center gap-1">
            <Heart className="w-3 h-3" />
            Your book is generated privately and never shared without your permission
          </p>
        </motion.div>
      </main>
    </div>
  )
}
