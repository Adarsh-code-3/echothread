"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Play, Clock } from "lucide-react"
import type { Thread } from "@/lib/mock-data"

const moodColors: Record<string, string> = {
  joyful: "bg-amber-400",
  calm: "bg-blue-400",
  reflective: "bg-purple-400",
  grateful: "bg-amber-500",
  excited: "bg-orange-400",
  sad: "bg-slate-400",
  anxious: "bg-red-400",
  neutral: "bg-gray-400",
}

const moodLabels: Record<string, string> = {
  joyful: "Joyful",
  calm: "Calm",
  reflective: "Reflective",
  grateful: "Grateful",
  excited: "Excited",
  sad: "Sad",
  anxious: "Anxious",
  neutral: "Neutral",
}

const moodBadgeColors: Record<string, string> = {
  joyful: "bg-amber-50 text-amber-700",
  calm: "bg-blue-50 text-blue-700",
  reflective: "bg-purple-50 text-purple-700",
  grateful: "bg-amber-50 text-amber-700",
  excited: "bg-orange-50 text-orange-700",
  sad: "bg-slate-50 text-slate-700",
  anxious: "bg-red-50 text-red-700",
  neutral: "bg-gray-50 text-gray-700",
}

export default function ThreadCard({ thread, index = 0 }: { thread: Thread; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/thread?id=${thread.id}`}>
        <div className="bg-white rounded-2xl p-5 border border-orange-50 shadow-sm hover:shadow-md hover:border-coral-500/20 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-2.5 h-2.5 rounded-full ${moodColors[thread.mood] || "bg-gray-400"}`} />
            <span className="text-sm text-muted">{thread.time}</span>
            <div className="flex items-center gap-1 text-xs text-muted">
              <Clock className="w-3 h-3" />
              {thread.duration}s
            </div>
            <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${moodBadgeColors[thread.mood] || "bg-gray-50 text-gray-700"}`}>
              {moodLabels[thread.mood] || thread.mood}
            </span>
          </div>

          <p className="font-serif text-ink text-[15px] leading-relaxed line-clamp-2 mb-3 group-hover:text-coral-600 transition-colors duration-200">
            {thread.summary}
          </p>

          <div className="flex gap-2 flex-wrap">
            {thread.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.name}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${tag.color}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export { moodColors, moodLabels, moodBadgeColors }
