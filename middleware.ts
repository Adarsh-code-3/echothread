import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me")
const COOKIE_NAME = "echothread-session"

const protectedPages = ["/dashboard", "/ask", "/book", "/review", "/thread", "/settings"]
const protectedApiPrefixes = ["/api/threads", "/api/stats", "/api/review", "/api/chat"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip auth routes and public pages
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  const isProtectedPage = protectedPages.some((p) => pathname.startsWith(p))
  const isProtectedApi = protectedApiPrefixes.some((p) => pathname.startsWith(p))

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next()
  }

  const token = req.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string

    // Pass userId to API routes via header
    const response = NextResponse.next()
    response.headers.set("x-user-id", userId)
    return response
  } catch {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }
    // Clear invalid cookie and redirect
    const response = NextResponse.redirect(new URL("/login", req.url))
    response.cookies.set(COOKIE_NAME, "", { maxAge: 0 })
    return response
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon).*)",
  ],
}
