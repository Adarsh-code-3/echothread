import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, otpCodes } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import { generateOtp } from "@/lib/auth"
import { sendOtpEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email: string }

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()

    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, emailLower), eq(users.verified, true)))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: "No account found with this email. Please sign up first." }, { status: 404 })
    }

    const code = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await db.insert(otpCodes).values({ email: emailLower, code, expiresAt })

    await sendOtpEmail(emailLower, code, user.name)

    return NextResponse.json({ success: true, message: "Verification code sent to your email." })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
