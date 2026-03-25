import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { threads } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [thread] = await db
      .select()
      .from(threads)
      .where(eq(threads.id, params.id))
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
    const [deleted] = await db
      .delete(threads)
      .where(eq(threads.id, params.id))
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
