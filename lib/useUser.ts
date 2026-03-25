"use client"

import { useState, useEffect } from "react"

interface UserData {
  id: string
  name: string
  email: string
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    } catch {}
  }

  return { user, loading, logout, refreshUser }
}
