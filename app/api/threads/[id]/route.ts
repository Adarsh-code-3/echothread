import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { threads } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import { getCurrentUser } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const [thread] = await db
      .select()
      .from(threads)
      .where(and(eq(threads.id, params.id), eq(threads.userId, user.id)))
      .limit(1)

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    return NextResponse.json(thread)
  } catch (error) {
    console.error("Failed to fetch thread:", error)
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const [deleted] = await db
      .delete(threads)
      .where(and(eq(threads.id, params.id), eq(threads.userId, user.id)))
      .returning()

    if (!deleted) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete thread:", error)
    return NextResponse.json({ error: "Failed to delete thread" }, { status: 500 })
  }
}
