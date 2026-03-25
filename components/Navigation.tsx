"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Clock, BookOpen, Mic, Sun, Moon, Settings, LogOut, User } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { useUser } from "@/lib/useUser"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/review", icon: Clock, label: "Review" },
  { href: "/ask", icon: Search, label: "Ask" },
  { href: "/book", icon: BookOpen, label: "Book" },
]

export default function Navigation() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const { user, logout } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?"

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-cream/80 dark:bg-[#0F0F14]/80 border-b border-orange-100/50 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-ink dark:text-white text-lg">EchoThread</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-coral-500/10 text-coral-500"
                      : "text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
            <button
              onClick={toggle}
              className="ml-2 p-2 rounded-xl text-muted dark:text-gray-400 hover:text-ink dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User menu */}
            <div className="relative ml-2" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center text-white text-sm font-bold hover:shadow-lg hover:shadow-coral-500/25 transition-all duration-200"
              >
                {userInitial}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white dark:bg-[#1A1A24] rounded-xl border border-orange-100 dark:border-white/10 shadow-xl py-2 z-50">
                  {user && (
                    <div className="px-4 py-2 border-b border-orange-50 dark:border-white/10 mb-1">
                      <p className="text-sm font-semibold text-ink dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-muted dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-muted dark:text-gray-400" />
                    Settings
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4 text-muted dark:text-gray-400" />
                    Profile
                  </Link>
                  <div className="border-t border-orange-50 dark:border-white/10 mt-1 pt-1">
                    <button
                      onClick={() => { setMenuOpen(false); logout() }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-[#0F0F14]/90 border-t border-orange-100/50 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[44px] transition-colors duration-200 ${
                  isActive ? "text-coral-500" : "text-muted dark:text-gray-500"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={toggle}
            className="flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[44px] text-muted dark:text-gray-500"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-[10px] font-medium">Theme</span>
          </button>
          <Link
            href="/settings"
            className={`flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[44px] transition-colors duration-200 ${
              pathname === "/settings" ? "text-coral-500" : "text-muted dark:text-gray-500"
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center text-white text-[10px] font-bold">
              {userInitial}
            </div>
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
