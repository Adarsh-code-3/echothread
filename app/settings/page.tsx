"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save, LogOut, User, Mail } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { useUser } from "@/lib/useUser"

export default function SettingsPage() {
  const { user, loading, logout, refreshUser } = useUser()
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) setName(user.name)
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || saving) return
    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (res.ok) {
        setSaved(true)
        await refreshUser()
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {
      // Error
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#0F0F14] flex items-center justify-center transition-colors">
        <div className="animate-pulse text-muted dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0F0F14] pb-24 md:pb-8 transition-colors">
      <Navigation />

      <main className="max-w-lg mx-auto px-4 pt-20 md:pt-24">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-ink dark:text-white">Settings</h1>
          <p className="text-muted dark:text-gray-400 text-sm mt-1">Manage your profile</p>
        </motion.div>

        {/* Profile */}
        <motion.form
          onSubmit={handleSave}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-orange-50 dark:border-white/10 shadow-sm mb-6"
        >
          <h2 className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-4">Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink dark:text-gray-200 block mb-1.5">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cream dark:bg-white/5 border border-orange-100 dark:border-white/10 rounded-xl text-sm text-ink dark:text-white focus:outline-none focus:border-coral-500/30 focus:ring-2 focus:ring-coral-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink dark:text-gray-200 block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-gray-500" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/[0.02] border border-orange-100 dark:border-white/10 rounded-xl text-sm text-muted dark:text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || name === user?.name}
              className="w-full py-3 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-coral-500/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
              {!saving && !saved && <Save className="w-4 h-4" />}
            </button>
          </div>
        </motion.form>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={logout}
            className="w-full py-3 bg-white dark:bg-white/5 border border-red-200 dark:border-red-500/20 text-red-500 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </motion.div>
      </main>
    </div>
  )
}
