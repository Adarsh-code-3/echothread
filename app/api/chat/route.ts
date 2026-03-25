import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { threads } from "@/lib/schema"
import { desc } from "drizzle-orm"
import { searchThreadsForChat } from "@/lib/ai"

export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json()) as { message: string }

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const allThreads = await db.select().from(threads).orderBy(desc(threads.createdAt))

    if (allThreads.length === 0) {
      return NextResponse.json({
        response: "You have not recorded any threads yet. Start by tapping the record button on your dashboard to create your first voice journal entry.",
      })
    }

    const response = searchThreadsForChat(message, allThreads)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
