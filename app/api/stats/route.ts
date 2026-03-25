import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { threads } from "@/lib/schema"
import { desc, gte } from "drizzle-orm"

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const monthThreads = await db
      .select()
      .from(threads)
      .where(gte(threads.createdAt, startOfMonth))
      .orderBy(desc(threads.createdAt))

    // Calculate streak
    const dates = new Set(monthThreads.map(t => new Date(t.createdAt).toDateString()))
    let streak = 0
    for (let i = 0; i < 31; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      if (dates.has(d.toDateString())) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    // Top mood this month
    const moodCounts: Record<string, number> = {}
    for (const t of monthThreads) {
      moodCounts[t.mood] = (moodCounts[t.mood] || 0) + 1
    }
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "calm"

    // Weekly moods
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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

    const weeklyMoods = dayNames.map((day, i) => {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + i)
      const dayThreads = monthThreads.filter(
        t => new Date(t.createdAt).toDateString() === date.toDateString()
      )
      const mood = dayThreads.length > 0 ? dayThreads[0]!.mood : "neutral"
      return {
        day,
        mood,
        color: moodColorMap[mood] || "#D1D5DB",
        hasEntry: dayThreads.length > 0,
      }
    })

    return NextResponse.json({
      streak,
      monthCount: monthThreads.length,
      topMood: topMood.charAt(0).toUpperCase() + topMood.slice(1),
      weeklyMoods,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
