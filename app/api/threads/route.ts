import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { threads } from "@/lib/schema"
import { desc } from "drizzle-orm"
import { detectMood, extractTags, polishText, generateSummary, generateInsight } from "@/lib/ai"

export async function GET() {
  try {
    const allThreads = await db.select().from(threads).orderBy(desc(threads.createdAt))
    return NextResponse.json(allThreads)
  } catch (error) {
    console.error("Failed to fetch threads:", error)
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { transcript, audioData, duration } = body as {
      transcript: string
      audioData?: string
      duration: number
    }

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 })
    }

    // AI processing
    const polished = polishText(transcript)
    const summary = generateSummary(polished)
    const { mood, score } = detectMood(transcript)
    const tags = extractTags(transcript)
    const insight = generateInsight(transcript, mood, tags)

    const [newThread] = await db.insert(threads).values({
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
