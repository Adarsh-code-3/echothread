"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Mic, ArrowRight, Mail, User, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [step, setStep] = useState<"info" | "otp">("info")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }
      setStep("otp")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((d) => d !== "") && value) {
      verifyOtp(newOtp.join(""))
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 0) return
    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || ""
    }
    setOtp(newOtp)
    const focusIdx = Math.min(pasted.length, 5)
    otpRefs.current[focusIdx]?.focus()
    if (pasted.length === 6) {
      verifyOtp(pasted)
    }
  }

  const verifyOtp = async (code: string) => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Invalid code")
        setOtp(["", "", "", "", "", ""])
        otpRefs.current[0]?.focus()
        return
      }
      setSuccess(true)
      // Full page reload to ensure cookie is picked up by middleware
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 500)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    setResending(true)
    setError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to resend code")
        return
      }
      setOtp(["", "", "", "", "", ""])
      otpRefs.current[0]?.focus()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0F0F14] flex items-center justify-center px-4 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-ink dark:text-white">Create your journal</h1>
          <p className="text-muted dark:text-gray-400 text-sm mt-1">Start capturing your story today</p>
        </div>

        {step === "info" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink dark:text-gray-200 block mb-1.5">Your name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-orange-100 dark:border-white/10 rounded-xl text-sm text-ink dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-coral-500/30 focus:ring-2 focus:ring-coral-500/10 transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink dark:text-gray-200 block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-orange-100 dark:border-white/10 rounded-xl text-sm text-ink dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-coral-500/30 focus:ring-2 focus:ring-coral-500/10 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim()}
              className="w-full py-3 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-coral-500/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-center text-sm text-muted dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-coral-500 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-ink dark:text-white font-semibold">Account created! Redirecting...</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted dark:text-gray-400 text-center">
                  We sent a 6 digit code to <span className="font-medium text-ink dark:text-white">{email}</span>
                </p>
                <p className="text-xs text-muted dark:text-gray-500 text-center">Check your spam folder if you do not see it.</p>

                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 text-center text-xl font-bold bg-white dark:bg-white/5 border border-orange-100 dark:border-white/10 rounded-xl text-ink dark:text-white focus:outline-none focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 transition-all"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>
                )}

                {loading && (
                  <p className="text-sm text-coral-500 text-center font-medium">Verifying...</p>
                )}

                <div className="flex flex-col items-center gap-2 pt-2">
                  <button
                    onClick={resendCode}
                    disabled={resending}
                    className="text-sm text-coral-500 font-medium hover:underline transition-colors disabled:opacity-50"
                  >
                    {resending ? "Resending..." : "Resend code"}
                  </button>
                  <button
                    onClick={() => { setStep("info"); setOtp(["", "", "", "", "", ""]); setError("") }}
                    className="text-sm text-muted dark:text-gray-400 hover:text-coral-500 transition-colors"
                  >
                    Go back
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
