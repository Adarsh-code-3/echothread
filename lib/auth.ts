import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { db } from "./db"
import { users } from "./schema"
import { eq } from "drizzle-orm"

const COOKIE_NAME = "echothread-session"
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me")

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createSession(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(secret)
  return token
}

export async function verifySession(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return { userId: payload.userId as string }
  } catch {
    return null
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const session = await verifySession(token)
  if (!session) return null

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1)
  return user || null
}

export function getSessionCookieValue(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value
}
