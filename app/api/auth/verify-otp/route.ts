import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, otpCodes } from "@/lib/schema"
import { eq, and, gte, desc } from "drizzle-orm"
import { createSession } from "@/lib/auth"

const COOKIE_NAME = "echothread-session"

export async function POST(req: NextRequest) {
  try {
    const { email, code } = (await req.json()) as { email: string; code: string }

    if (!email?.trim() || !code?.trim()) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()

    // Find valid OTP
    const [otp] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, emailLower),
          eq(otpCodes.code, code.trim()),
          gte(otpCodes.expiresAt, new Date())
        )
      )
      .orderBy(desc(otpCodes.createdAt))
      .limit(1)

    if (!otp) {
      return NextResponse.json({ error: "Invalid or expired code. Please request a new one." }, { status: 400 })
    }

    // Mark user as verified
    await db.update(users).set({ verified: true }).where(eq(users.email, emailLower))

    // Get user
    const [user] = await db.select().from(users).where(eq(users.email, emailLower)).limit(1)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Clean up OTPs for this email
    await db.delete(otpCodes).where(eq(otpCodes.email, emailLower))

    // Create session
    const token = await createSession(user.id)

    // Set cookie directly on the response object for reliability
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
