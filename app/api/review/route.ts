import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { threads } from "@/lib/schema"
import { desc, gte } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const monthThreads = await db
      .select()
      .from(threads)
      .where(gte(threads.createdAt, startOfMonth))
      .orderBy(desc(threads.createdAt))

    if (monthThreads.length === 0) {
      return NextResponse.json({
        month: now.toLocaleString("en-US", { month: "long" }),
        year: now.getFullYear(),
        title: "Your Month in Reflection",
        totalThreads: 0,
        streakDays: 0,
        topMood: "None yet",
        moodArc: [],
        highlights: [],
        patterns: ["No threads recorded this month yet. Start recording to see your monthly review."],
        peopleMentioned: [],
      })
    }

    // Calculate streak
    const dates = new Set(monthThreads.map(t => new Date(t.createdAt).toDateString()))
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 31; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (dates.has(d.toDateString())) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    // Top mood
    const moodCounts: Record<string, number> = {}
    for (const t of monthThreads) {
      moodCounts[t.mood] = (moodCounts[t.mood] || 0) + 1
    }
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral"

    // Mood arc by day
    const dayMap: Record<number, { scores: number[]; moods: string[] }> = {}
    for (const t of monthThreads) {
      const day = new Date(t.createdAt).getDate()
      if (!dayMap[day]) dayMap[day] = { scores: [], moods: [] }
      dayMap[day].scores.push(t.moodScore)
      dayMap[day].moods.push(t.mood)
    }

    const moodArc = Object.entries(dayMap)
      .map(([day, data]) => ({
        day: parseInt(day),
        score: parseFloat((data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(2)),
        mood: data.moods.sort((a, b) =>
          (data.moods.filter(m => m === b).length) - (data.moods.filter(m => m === a).length)
        )[0] || "neutral",
      }))
      .sort((a, b) => a.day - b.day)

    // Highlights (top mood score threads)
    const sorted = [...monthThreads].sort((a, b) => b.moodScore - a.moodScore)
    const highlights = sorted.slice(0, 3).map(t => ({
      date: new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      text: t.polished.length > 200 ? t.polished.substring(0, 197) + "..." : t.polished,
    }))

    // People mentioned
    const people = new Set<string>()
    for (const t of monthThreads) {
      const tags = t.tags as { name: string; category: string }[]
      for (const tag of tags) {
        if (tag.category === "person") people.add(tag.name)
      }
    }

    // Patterns
    const patterns: string[] = []
    patterns.push(`You recorded ${monthThreads.length} threads across ${dates.size} days`)
    patterns.push(`Most common mood: ${topMood.charAt(0).toUpperCase() + topMood.slice(1)}`)
    if (people.size > 0) {
      patterns.push(`People mentioned most: ${[...people].slice(0, 5).join(", ")}`)
    }
    const avgDuration = Math.round(monthThreads.reduce((sum, t) => sum + t.duration, 0) / monthThreads.length)
    patterns.push(`Average recording length: ${avgDuration} seconds`)
    if (streak > 1) {
      patterns.push(`Current streak: ${streak} days in a row`)
    }

    const review = {
      month: now.toLocaleString("en-US", { month: "long" }),
      year: now.getFullYear(),
      title: "Your Month in Reflection",
      totalThreads: monthThreads.length,
      streakDays: streak,
      topMood: topMood.charAt(0).toUpperCase() + topMood.slice(1),
      moodArc,
      highlights,
      patterns,
      peopleMentioned: [...people],
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json({ error: "Failed to generate review" }, { status: 500 })
  }
}
