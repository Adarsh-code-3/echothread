"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import {
  Mic,
  BookOpen,
  Brain,
  Shield,
  Heart,
  Clock,
  Sparkles,
  ChevronRight,
  Play,
  Users,
  Database,
  Zap,
  MessageCircle,
  Moon,
} from "lucide-react"

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function WaveformVisualizer() {
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar w-[3px] rounded-full bg-gradient-to-t from-coral-500 to-coral-400"
          style={{ height: "8px" }}
        />
      ))}
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType
  title: string
  description: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-orange-50 dark:border-white/10 hover:shadow-md hover:border-coral-500/20 transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-500/10 to-coral-400/10 flex items-center justify-center mb-4 group-hover:from-coral-500/20 group-hover:to-coral-400/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-coral-500" />
      </div>
      <h3 className="text-lg font-semibold text-ink dark:text-white mb-2">{title}</h3>
      <p className="text-muted dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

function StatCounter({ value, label, suffix = "" }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-ink dark:text-white">
        {value}<span className="text-coral-500">{suffix}</span>
      </div>
      <div className="text-muted dark:text-gray-400 text-sm mt-1">{label}</div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream dark:bg-[#0F0F14] transition-colors">
      {/* Decorative blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-coral-500/5 blur-[100px] animate-morph" />
        <div className="absolute top-[30%] right-[-15%] w-[400px] h-[400px] rounded-full bg-amber-300/8 blur-[100px] animate-morph" style={{ animationDelay: "3s" }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-purple-300/5 blur-[100px] animate-morph" style={{ animationDelay: "6s" }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-cream/80 dark:bg-[#0F0F14]/80 border-b border-orange-100/50 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-ink dark:text-white text-lg">EchoThread</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#how-it-works" className="text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors text-sm font-medium">How It Works</a>
            <a href="#privacy" className="text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors text-sm font-medium">Privacy</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium text-ink dark:text-white hover:text-coral-500 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-coral-500 to-coral-400 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-coral-500/25 transition-all duration-300 active:scale-[0.97]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-coral-500/10 rounded-full text-coral-500 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Your life, beautifully remembered
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-extrabold tracking-tight text-ink dark:text-white leading-[1.1] mb-6"
          >
            Talk for 30 seconds.{" "}
            <span className="bg-gradient-to-r from-coral-500 to-coral-400 bg-clip-text text-transparent">
              Remember forever.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg sm:text-xl text-muted dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            EchoThread turns your daily voice notes into a beautifully written journal,
            discovers patterns in your life, and builds your personal biography, one moment at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-coral-500/25 transition-all duration-300 active:scale-[0.97] text-lg min-h-[52px] flex items-center gap-2"
            >
              Start Your Journal
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white dark:bg-white/5 text-ink dark:text-white font-semibold rounded-2xl border border-orange-100 dark:border-white/10 hover:border-coral-500/30 hover:shadow-md transition-all duration-300 active:scale-[0.97] text-lg min-h-[52px] flex items-center gap-2"
            >
              <Play className="w-5 h-5 text-coral-500" />
              See How It Works
            </a>
          </motion.div>

          {/* Hero demo card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 shadow-xl shadow-coral-500/5 border border-orange-50 dark:border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-coral-500 to-coral-400" />
                <span className="text-sm text-muted dark:text-gray-400">Just now</span>
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">Grateful</span>
              </div>
              <p className="font-serif text-ink dark:text-gray-200 leading-relaxed text-left text-[15px] mb-4">
                &quot;There is something about a quiet Tuesday evening that makes you stop and notice things. I spent the afternoon in the garden with Mom, neither of us saying much...&quot;
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium">Mom</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 font-medium">Garden</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-medium">Peaceful</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <RevealSection>
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StatCounter value="30" suffix="s" label="Daily commitment" />
            <StatCounter value="Real" suffix="" label="Voice recording" />
            <StatCounter value="Live" suffix="" label="Database storage" />
            <StatCounter value="365" suffix="" label="Days of memories per year" />
          </div>
        </section>
      </RevealSection>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-[clamp(1.75rem,3vw+0.75rem,2.75rem)] font-bold text-ink dark:text-white tracking-tight mb-4">
                Three steps. Thirty seconds. A lifetime of stories.
              </h2>
              <p className="text-muted dark:text-gray-400 text-lg max-w-xl mx-auto">
                No typing. No organizing. Just talk, and let your words be woven into something beautiful.
              </p>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Mic,
                title: "Record your moment",
                description: "Tap the button and talk for up to 60 seconds about your day, a thought, a feeling. Real microphone recording captures your voice.",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "Your thread is woven",
                description: "Browser speech recognition transcribes your words. Smart processing detects mood, extracts tags, and polishes your entry into a journal piece.",
              },
              {
                step: "03",
                icon: BookOpen,
                title: "Your story grows",
                description: "Over time, EchoThread discovers patterns, resurfaces memories, and can generate the book of your life from your real entries.",
              },
            ].map((item) => (
              <RevealSection key={item.step}>
                <div className="relative bg-white dark:bg-white/5 rounded-2xl p-8 border border-orange-50 dark:border-white/10 shadow-sm">
                  <span className="text-5xl font-extrabold text-coral-500/10 absolute top-4 right-6">
                    {item.step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center mb-5 shadow-lg shadow-coral-500/20">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-ink dark:text-white mb-3">{item.title}</h3>
                  <p className="text-muted dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-[clamp(1.75rem,3vw+0.75rem,2.75rem)] font-bold text-ink dark:text-white tracking-tight mb-4">
                Every feature serves one purpose: remembering your life
              </h2>
            </div>
          </RevealSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Mic}
              title="Real Voice Recording"
              description="Captures actual audio through your microphone using the MediaRecorder API. Your real voice, stored with every entry."
              delay={0}
            />
            <FeatureCard
              icon={Brain}
              title="Smart Pattern Detection"
              description="Automatic mood analysis, entity extraction, and tag generation. Discover what makes you happy and who matters most."
              delay={0.08}
            />
            <FeatureCard
              icon={BookOpen}
              title="Generate Your Book"
              description="Export your threads as a formatted book, organized by month with mood visualizations and patterns included."
              delay={0.16}
            />
            <FeatureCard
              icon={MessageCircle}
              title="Ask Your Past Self"
              description="Search through your recorded threads by asking natural questions. Find patterns and revisit moments that matter."
              delay={0.24}
            />
            <FeatureCard
              icon={Clock}
              title="Monthly Reviews"
              description="See your mood arc, top highlights, patterns, and people mentioned. All computed from your real journal data."
              delay={0.32}
            />
            <FeatureCard
              icon={Database}
              title="Persistent Storage"
              description="Every thread is stored in a real PostgreSQL database. Your entries are safe and always available when you return."
              delay={0.4}
            />
            <FeatureCard
              icon={Moon}
              title="Dark Mode"
              description="Full dark mode support with a toggle. Easy on the eyes for late night journaling sessions."
              delay={0.48}
            />
            <FeatureCard
              icon={Shield}
              title="Your Data, Your Control"
              description="Your journal entries live in your own database. No data is sold or shared. Your memories belong to you."
              delay={0.56}
            />
            <FeatureCard
              icon={Zap}
              title="Instant Processing"
              description="Speech recognition runs in your browser while you speak. Thread processing happens in seconds after recording."
              delay={0.64}
            />
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 sm:p-12 border border-orange-50 dark:border-white/10 shadow-lg shadow-coral-500/5">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-coral-500/10 to-purple-500/10 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-coral-500" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-ink dark:text-white mb-4">
                    Your memories are yours alone
                  </h2>
                  <p className="text-muted dark:text-gray-400 leading-relaxed mb-4">
                    EchoThread stores your entries in a secure PostgreSQL database. Your voice recordings and journal entries are never sold, shared, or used for any purpose other than serving you. Your life story belongs to one person: you.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">Secure database</span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">No data selling</span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">Your data, your control</span>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Emotional CTA */}
      <section className="py-16 sm:py-24 px-4">
        <RevealSection>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[clamp(1.75rem,3vw+0.75rem,2.75rem)] font-bold text-ink dark:text-white tracking-tight mb-6">
              A year from now, you will wish you had started today
            </h2>
            <p className="text-muted dark:text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Every day that passes is a story untold. Start capturing yours in 30 seconds.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-coral-500/25 transition-all duration-300 active:scale-[0.97] text-lg"
            >
              <Mic className="w-5 h-5" />
              Record Your First Thread
            </Link>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-orange-100/50 dark:border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center">
              <Mic className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-ink dark:text-white">EchoThread</span>
          </div>
          <p className="text-muted dark:text-gray-400 text-sm">Your voice. Your story. Beautifully remembered.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white text-sm transition-colors">Privacy</a>
            <a href="#features" className="text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white text-sm transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
