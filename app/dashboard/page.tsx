"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Flame, TrendingUp, Calendar } from "lucide-react"
import Navigation from "@/components/Navigation"
import VoiceButton from "@/components/VoiceButton"
import ThreadCard from "@/components/ThreadCard"

interface ThreadData {
  id: string
  transcript: string
  polished: string
  summary: string
  mood: string
  moodScore: number
  tags: { name: string; category: string; color: string }[]
  insight: string
  duration: number
  createdAt: string
}

interface Stats {
  streak: number
  monthCount: number
  topMood: string
  weeklyMoods: { day: string; mood: string; color: string; hasEntry: boolean }[]
}

function MoodRibbon({ moods }: { moods: Stats["weeklyMoods"] }) {
  return (
    <div className="flex items-center justify-between gap-2 px-2">
      {moods.map((item, i) => (
        <div key={item.day} className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] text-muted dark:text-gray-500 font-medium">{item.day}</span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 15 }}
            className={`w-3 h-3 rounded-full ${!item.hasEntry ? "opacity-30" : ""}`}
            style={{ backgroundColor: item.color }}
          />
        </div>
      ))}
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-orange-50 dark:border-white/10 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="ml-auto w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="flex gap-2">
        <div className="w-12 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [threads, setThreads] = useState<ThreadData[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [threadsRes, statsRes] = await Promise.all([
        fetch("/api/threads"),
        fetch("/api/stats"),
      ])
      const threadsData = await threadsRes.json()
      const statsData = await statsRes.json()
      setThreads(threadsData)
      setStats(statsData)
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const today = new Date().toDateString()
  const todayThreads = threads.filter(
    (t) => new Date(t.createdAt).toDateString() === today
  )
  const olderThreads = threads.filter(
    (t) => new Date(t.createdAt).toDateString() !== today
  )

  const formatThreadForCard = (t: ThreadData) => ({
    id: t.id,
    date: new Date(t.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: new Date(t.createdAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    duration: t.duration,
    transcript: t.transcript,
    polished: t.polished,
    summary: t.summary,
    mood: t.mood,
    moodScore: t.moodScore,
    tags: t.tags,
    insight: t.insight,
  })

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0F0F14] pb-24 md:pb-8 transition-colors duration-300">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-ink dark:text-white tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-muted dark:text-gray-400 text-sm mt-1">{formatDate()}</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white dark:bg-white/5 rounded-xl p-3 border border-orange-50 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-coral-500" />
              <span className="text-xs text-muted dark:text-gray-400 font-medium">Streak</span>
            </div>
            <p className="text-xl font-bold text-ink dark:text-white">
              {loading ? "..." : `${stats?.streak || 0} days`}
            </p>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-xl p-3 border border-orange-50 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted dark:text-gray-400 font-medium">This month</span>
            </div>
            <p className="text-xl font-bold text-ink dark:text-white">
              {loading ? "..." : stats?.monthCount || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-xl p-3 border border-orange-50 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted dark:text-gray-400 font-medium">Top mood</span>
            </div>
            <p className="text-xl font-bold text-ink dark:text-white">
              {loading ? "..." : stats?.topMood || "None"}
            </p>
          </div>
        </motion.div>

        {/* Weekly mood ribbon */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white dark:bg-white/5 rounded-xl p-4 border border-orange-50 dark:border-white/10 shadow-sm mb-8"
          >
            <p className="text-xs text-muted dark:text-gray-400 font-medium mb-3">This week&apos;s mood</p>
            <MoodRibbon moods={stats.weeklyMoods} />
          </motion.div>
        )}

        {/* Voice button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="flex justify-center mb-10"
        >
          <VoiceButton onThreadCreated={fetchData} />
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-3 mb-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Empty state */}
        {!loading && threads.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted dark:text-gray-400 text-lg mb-2">No threads yet</p>
            <p className="text-muted dark:text-gray-500 text-sm">
              Tap the record button above to create your first voice journal entry.
            </p>
          </motion.div>
        )}

        {/* Today's threads */}
        {todayThreads.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-4">Today</h2>
            <div className="space-y-3">
              {todayThreads.map((thread, i) => (
                <ThreadCard key={thread.id} thread={formatThreadForCard(thread)} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Earlier threads */}
        {olderThreads.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-4">Earlier</h2>
            <div className="space-y-3">
              {olderThreads.map((thread, i) => (
                <ThreadCard key={thread.id} thread={formatThreadForCard(thread)} index={i + todayThreads.length} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
