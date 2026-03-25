import { pgTable, uuid, text, real, integer, timestamp, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex("users_email_idx").on(table.email),
}))

export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("otp_email_idx").on(table.email),
}))

export const threads = pgTable("threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
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
}, (table) => ({
  userCreatedIdx: index("threads_user_created_idx").on(table.userId, table.createdAt),
  createdAtIdx: index("threads_created_at_idx").on(table.createdAt),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Thread = typeof threads.$inferSelect
export type NewThread = typeof threads.$inferInsert
