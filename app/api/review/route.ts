import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { threads } from "@/lib/schema"
import { desc, gte, lte, eq, and } from "drizzle-orm"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const now = new Date()
    const monthParam = searchParams.get("month")
    const yearParam = searchParams.get("year")

    const month = monthParam ? parseInt(monthParam) - 1 : now.getMonth()
    const year = yearParam ? parseInt(yearParam) : now.getFullYear()

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999)

    const monthThreads = await db
      .select()
      .from(threads)
      .where(
        and(
          eq(threads.userId, user.id),
          gte(threads.createdAt, startOfMonth),
          lte(threads.createdAt, endOfMonth)
        )
      )
      .orderBy(desc(threads.createdAt))

    const monthName = startOfMonth.toLocaleString("en-US", { month: "long" })

    // Check if previous/next months have data
    const prevStart = new Date(year, month - 1, 1)
    const prevEnd = new Date(year, month, 0, 23, 59, 59, 999)
    const [prevCheck] = await db
      .select()
      .from(threads)
      .where(and(eq(threads.userId, user.id), gte(threads.createdAt, prevStart), lte(threads.createdAt, prevEnd)))
      .limit(1)

    const isCurrentMonth = month === now.getMonth() && year === now.getFullYear()

    if (monthThreads.length === 0) {
      return NextResponse.json({
        month: monthName,
        year,
        title: "Your Month in Reflection",
        totalThreads: 0,
        streakDays: 0,
        topMood: "None yet",
        moodArc: [],
        highlights: [],
        patterns: ["No threads recorded this month. Start recording to see your monthly review."],
        peopleMentioned: [],
        hasPrevious: !!prevCheck,
        hasNext: !isCurrentMonth,
      })
    }

    // Streak
    const dates = new Set(monthThreads.map(t => new Date(t.createdAt).toDateString()))
    let streak = 0
    const refDate = isCurrentMonth ? now : endOfMonth
    for (let i = 0; i < 31; i++) {
      const d = new Date(refDate)
      d.setDate(d.getDate() - i)
      if (d < startOfMonth) break
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

    // Mood arc
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

    // Highlights
    const sorted = [...monthThreads].sort((a, b) => b.moodScore - a.moodScore)
    const highlights = sorted.slice(0, 3).map(t => ({
      date: new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      text: t.polished.length > 200 ? t.polished.substring(0, 197) + "..." : t.polished,
    }))

    // People
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

    return NextResponse.json({
      month: monthName,
      year,
      title: "Your Month in Reflection",
      totalThreads: monthThreads.length,
      streakDays: streak,
      topMood: topMood.charAt(0).toUpperCase() + topMood.slice(1),
      moodArc,
      highlights,
      patterns,
      peopleMentioned: [...people],
      hasPrevious: !!prevCheck,
      hasNext: !isCurrentMonth,
    })
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json({ error: "Failed to generate review" }, { status: 500 })
  }
}
