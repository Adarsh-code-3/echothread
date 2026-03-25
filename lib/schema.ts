import { pgTable, uuid, text, real, integer, timestamp, jsonb } from "drizzle-orm/pg-core"

export const threads = pgTable("threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  transcript: text("transcript").notNull(),
  polished: text("polished").notNull(),
  summary: text("summary").notNull(),
  mood: text("mood").notNull(),
  moodScore: real("mood_score").notNull(),
  tags: jsonb("tags").notNull().default([]),
  insight: text("insight").notNull(),
  audioData: text("audio_data"),
  duration: integer("duration").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Thread = typeof threads.$inferSelect
export type NewThread = typeof threads.$inferInsert
