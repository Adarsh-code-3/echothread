// This file is kept for type reference only. All data now comes from the database.

export interface Thread {
  id: string
  date: string
  time: string
  duration: number
  transcript: string
  polished: string
  summary: string
  mood: string
  moodScore: number
  tags: { name: string; category: string; color: string }[]
  insight: string
}

export interface Review {
  month: string
  year: number
  title: string
  totalThreads: number
  streakDays: number
  topMood: string
  moodArc: { day: number; score: number; mood: string }[]
  highlights: { date: string; text: string }[]
  patterns: string[]
  peopleMentioned: string[]
}
