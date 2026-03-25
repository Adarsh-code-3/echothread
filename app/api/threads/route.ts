import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { threads } from "@/lib/schema"
import { desc, eq, and } from "drizzle-orm"
import { detectMood, extractTags, polishText, generateSummary, generateInsight } from "@/lib/ai"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const allThreads = await db
      .select()
      .from(threads)
      .where(eq(threads.userId, user.id))
      .orderBy(desc(threads.createdAt))

    return NextResponse.json(allThreads)
  } catch (error) {
    console.error("Failed to fetch threads:", error)
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await req.json()
    const { transcript, audioData, duration } = body as {
      transcript: string
      audioData?: string
      duration: number
    }

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 })
    }

    const polished = polishText(transcript)
    const summary = generateSummary(polished)
    const { mood, score } = detectMood(transcript)
    const tags = extractTags(transcript)
    const insight = generateInsight(transcript, mood, tags)

    const [newThread] = await db.insert(threads).values({
      userId: user.id,
      transcript: transcript.trim(),
      polished,
      summary,
      mood,
      moodScore: score,
      tags,
      insight,
      audioData: audioData || null,
      duration: duration || 0,
    }).returning()

    return NextResponse.json(newThread, { status: 201 })
  } catch (error) {
    console.error("Failed to create thread:", error)
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 })
  }
}
