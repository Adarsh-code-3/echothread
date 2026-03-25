import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, otpCodes } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { generateOtp } from "@/lib/auth"
import { sendOtpEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { name, email } = (await req.json()) as { name: string; email: string }

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()
    const nameTrimmed = name.trim()

    // Check existing user
    const [existing] = await db.select().from(users).where(eq(users.email, emailLower)).limit(1)

    if (existing?.verified) {
      return NextResponse.json({ error: "Account already exists. Please log in instead." }, { status: 409 })
    }

    if (existing && !existing.verified) {
      // Update name for unverified user
      await db.update(users).set({ name: nameTrimmed }).where(eq(users.id, existing.id))
    } else {
      // Create new user
      await db.insert(users).values({ name: nameTrimmed, email: emailLower, verified: false })
    }

    // Generate and store OTP
    const code = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await db.insert(otpCodes).values({ email: emailLower, code, expiresAt })

    // Send email
    await sendOtpEmail(emailLower, code, nameTrimmed)

    return NextResponse.json({ success: true, message: "Verification code sent to your email." })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
