"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Flame, TrendingUp, Calendar } from "lucide-react"
import Navigation from "@/components/Navigation"
import VoiceButton from "@/components/VoiceButton"
import ThreadCard from "@/components/ThreadCard"
import { mockThreads, weeklyMoods } from "@/lib/mock-data"

function MoodRibbon() {
  return (
    <div className="flex items-center justify-between gap-2 px-2">
      {weeklyMoods.map((item, i) => (
        <div key={item.day} className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] text-muted font-medium">{item.day}</span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 15 }}
            className="w-3 h-3 rounded-full"
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

export default function DashboardPage() {
  const todayThreads = mockThreads.filter((t) => t.date === "March 25, 2026")
  const olderThreads = mockThreads.filter((t) => t.date !== "March 25, 2026")

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-8">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 pt-20 md:pt-24">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {getGreeting()}, Atharv
          </h1>
          <p className="text-muted text-sm mt-1">{formatDate()}</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white rounded-xl p-3 border border-orange-50 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-coral-500" />
              <span className="text-xs text-muted font-medium">Streak</span>
            </div>
            <p className="text-xl font-bold text-ink">21 days</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-orange-50 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted font-medium">This month</span>
            </div>
            <p className="text-xl font-bold text-ink">47</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-orange-50 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted font-medium">Top mood</span>
            </div>
            <p className="text-xl font-bold text-ink">Calm</p>
          </div>
        </motion.div>

        {/* Weekly mood ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-xl p-4 border border-orange-50 shadow-sm mb-8"
        >
          <p className="text-xs text-muted font-medium mb-3">This week&apos;s mood</p>
          <MoodRibbon />
        </motion.div>

        {/* Voice button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="flex justify-center mb-10"
        >
          <VoiceButton />
        </motion.div>

        {/* Today's threads */}
        {todayThreads.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Today</h2>
            <div className="space-y-3">
              {todayThreads.map((thread, i) => (
                <ThreadCard key={thread.id} thread={thread} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Earlier threads */}
        {olderThreads.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Earlier</h2>
            <div className="space-y-3">
              {olderThreads.map((thread, i) => (
                <ThreadCard key={thread.id} thread={thread} index={i + todayThreads.length} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
