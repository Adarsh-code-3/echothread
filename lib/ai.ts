const moodKeywords: Record<string, string[]> = {
  joyful: ["happy", "joy", "laugh", "fun", "amazing", "wonderful", "fantastic", "love", "delight", "elated", "thrilled", "ecstatic", "celebrate", "play", "smile", "grin"],
  grateful: ["grateful", "thankful", "appreciate", "blessed", "lucky", "gift", "gratitude", "fortune", "kind", "generous", "thank"],
  calm: ["calm", "peace", "quiet", "serene", "still", "gentle", "relaxed", "steady", "soothing", "tranquil", "rest", "easy", "comfortable", "soft"],
  reflective: ["think", "wonder", "remember", "realize", "reflect", "ponder", "consider", "notice", "observe", "understand", "learn", "meaning", "thought", "perspective"],
  excited: ["excited", "exciting", "energy", "breakthrough", "finally", "incredible", "awesome", "pumped", "stoked", "eager", "fired up", "motivated", "progress", "momentum"],
  anxious: ["worry", "anxious", "stress", "nervous", "fear", "overwhelm", "pressure", "tension", "panic", "dread", "uncertain", "restless", "uneasy"],
  sad: ["sad", "miss", "lost", "lonely", "hurt", "cry", "grief", "heavy", "down", "empty", "numb", "struggle", "pain", "difficult", "hard time"],
  neutral: ["okay", "fine", "normal", "usual", "routine", "regular", "ordinary", "standard", "typical"],
}

const moodScoreMap: Record<string, number> = {
  joyful: 0.9,
  grateful: 0.85,
  excited: 0.8,
  calm: 0.7,
  reflective: 0.6,
  neutral: 0.5,
  anxious: 0.35,
  sad: 0.25,
}

export function detectMood(text: string): { mood: string; score: number } {
  const lower = text.toLowerCase()
  const scores: Record<string, number> = {}

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    let count = 0
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "gi")
      const matches = lower.match(regex)
      if (matches) count += matches.length
    }
    if (count > 0) scores[mood] = count
  }

  const entries = Object.entries(scores)
  if (entries.length === 0) {
    return { mood: "reflective", score: 0.6 }
  }

  entries.sort((a, b) => b[1] - a[1])
  const topMood = entries[0]![0]
  const baseScore = moodScoreMap[topMood] ?? 0.5
  const variation = (Math.random() * 0.1) - 0.05
  const score = Math.max(0.1, Math.min(1.0, baseScore + variation))

  return { mood: topMood, score: parseFloat(score.toFixed(2)) }
}

const tagCategories = {
  person: /\b(mom|dad|mother|father|brother|sister|friend|wife|husband|partner|boss|colleague|teacher|grandma|grandpa|uncle|aunt|cousin)\b/gi,
  emotion: /\b(happy|sad|angry|anxious|peaceful|grateful|excited|nervous|calm|reflective|joyful|hopeful|frustrated|proud|lonely|content|overwhelmed)\b/gi,
  activity: /\b(walk|run|read|cook|garden|work|meeting|exercise|meditate|write|paint|drive|travel|shop|clean|study|play|swim|hike|bike|yoga|coffee|tea|dinner|lunch|breakfast)\b/gi,
  place: /\b(home|office|garden|park|beach|mountain|city|school|hospital|restaurant|cafe|library|gym|church|store|market|kitchen|bedroom|living room)\b/gi,
  time: /\b(morning|afternoon|evening|night|midnight|dawn|sunset|sunrise|weekend|weekday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
  topic: /\b(book|music|movie|art|nature|technology|health|family|career|dream|goal|memory|childhood|future|past|change|growth)\b/gi,
}

const tagColors: Record<string, string> = {
  person: "bg-blue-100 text-blue-700",
  emotion: "bg-purple-100 text-purple-700",
  activity: "bg-orange-100 text-orange-700",
  place: "bg-green-100 text-green-700",
  time: "bg-amber-100 text-amber-700",
  topic: "bg-teal-100 text-teal-700",
}

export function extractTags(text: string): { name: string; category: string; color: string }[] {
  const tags: { name: string; category: string; color: string }[] = []
  const seen = new Set<string>()

  // Extract capitalized proper names (likely people)
  const nameRegex = /\b([A-Z][a-z]{2,})\b/g
  let match
  while ((match = nameRegex.exec(text)) !== null) {
    const name = match[1]!
    const lower = name.toLowerCase()
    const skipWords = new Set(["the", "this", "that", "there", "they", "today", "tomorrow", "yesterday", "sometimes", "everything", "nothing", "something", "someone", "anyone", "everyone", "after", "before", "when", "where", "while", "because", "although", "however", "maybe", "perhaps", "just", "really", "actually", "probably", "always", "never", "often", "usually", "suddenly", "finally", "instead", "within", "without", "between", "during", "through", "about", "around"])
    if (!skipWords.has(lower) && !seen.has(lower)) {
      seen.add(lower)
      tags.push({ name, category: "person", color: tagColors.person! })
    }
  }

  // Extract category-based tags
  for (const [category, regex] of Object.entries(tagCategories)) {
    if (category === "person") continue // already handled above
    const newRegex = new RegExp(regex.source, regex.flags)
    while ((match = newRegex.exec(text)) !== null) {
      const name = match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase()
      const lower = name.toLowerCase()
      if (!seen.has(lower)) {
        seen.add(lower)
        tags.push({ name, category, color: tagColors[category]! })
      }
    }
  }

  return tags.slice(0, 6)
}

export function polishText(transcript: string): string {
  let text = transcript.trim()

  // Capitalize first letter
  text = text.charAt(0).toUpperCase() + text.slice(1)

  // Fix common speech patterns
  text = text.replace(/\b(um|uh|like,|you know,|basically,|so basically)\b/gi, "")
  text = text.replace(/\s{2,}/g, " ")

  // Ensure sentences end with periods
  const sentences = text.split(/(?<=[.!?])\s+/)
  const polished = sentences.map(s => {
    s = s.trim()
    if (!s) return ""
    s = s.charAt(0).toUpperCase() + s.slice(1)
    if (!/[.!?]$/.test(s)) s += "."
    return s
  }).filter(Boolean).join(" ")

  return polished || text
}

export function generateSummary(text: string): string {
  // Take first meaningful sentence or first 100 chars
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
  if (sentences.length > 0) {
    const first = sentences[0]!.trim()
    if (first.length > 120) {
      return first.substring(0, 117) + "..."
    }
    return first
  }
  if (text.length > 120) {
    return text.substring(0, 117) + "..."
  }
  return text
}

export function generateInsight(text: string, mood: string, tags: { name: string; category: string }[]): string {
  const people = tags.filter(t => t.category === "person").map(t => t.name)
  const activities = tags.filter(t => t.category === "activity").map(t => t.name)
  const places = tags.filter(t => t.category === "place").map(t => t.name)

  const parts: string[] = []

  if (people.length > 0) {
    parts.push(`You mentioned ${people.join(" and ")} in this thread.`)
  }

  if (activities.length > 0) {
    parts.push(`Activities like ${activities.join(", ")} appear in your reflection.`)
  }

  if (places.length > 0) {
    parts.push(`This moment took place around ${places.join(", ")}.`)
  }

  const moodInsights: Record<string, string> = {
    joyful: "This is one of your happiest entries. These moments of joy often come from simple, unplanned experiences.",
    grateful: "Gratitude threads like this one tend to appear when you slow down and notice the small things around you.",
    calm: "Your calmest entries often share a common thread: presence without pressure, just being in the moment.",
    reflective: "Reflective threads show your depth of thought. You process experiences thoughtfully, finding meaning in everyday moments.",
    excited: "This energy is contagious. Your excitement entries often follow breakthroughs or moments of connection.",
    anxious: "Acknowledging anxiety is an important step. Your past threads show that these feelings often resolve through simple activities like walking or talking.",
    sad: "It takes courage to sit with sadness. Your previous threads show that these moments often lead to deeper understanding.",
    neutral: "Even quiet, ordinary days are worth recording. They form the backdrop against which meaningful moments stand out.",
  }

  parts.push(moodInsights[mood] || moodInsights.reflective!)

  return parts.join(" ")
}

export function searchThreadsForChat(
  query: string,
  threads: { transcript: string; polished: string; summary: string; mood: string; createdAt: Date; tags: unknown }[]
): string {
  const lower = query.toLowerCase()
  const keywords = lower.split(/\s+/).filter(w => w.length > 2)

  // Score each thread by relevance
  const scored = threads.map(thread => {
    let score = 0
    const searchText = `${thread.transcript} ${thread.polished} ${thread.summary} ${thread.mood}`.toLowerCase()

    for (const kw of keywords) {
      if (searchText.includes(kw)) score += 1
    }

    return { thread, score }
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score)

  if (scored.length === 0) {
    return "I looked through all your threads but could not find entries closely matching that question. Try asking about specific people, places, moods, or activities you have recorded."
  }

  const top = scored.slice(0, 3)
  const parts: string[] = []

  for (const { thread } of top) {
    const date = new Date(thread.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    const snippet = thread.polished.length > 150
      ? thread.polished.substring(0, 147) + "..."
      : thread.polished
    parts.push(`On ${date}, you wrote: "${snippet}"`)
  }

  if (scored.length > 3) {
    parts.push(`I found ${scored.length} related entries in total. The ones above were the closest matches.`)
  }

  // Add a connecting thought based on query type
  if (lower.includes("feel") || lower.includes("felt") || lower.includes("mood")) {
    const moods = top.map(t => t.thread.mood)
    const unique = [...new Set(moods)]
    parts.push(`Across these entries, your moods were: ${unique.join(", ")}.`)
  }

  if (lower.includes("who") || lower.includes("person") || lower.includes("people")) {
    const allTags = top.flatMap(t => {
      const tags = t.thread.tags as { name: string; category: string }[]
      return tags.filter(tag => tag.category === "person").map(tag => tag.name)
    })
    const unique = [...new Set(allTags)]
    if (unique.length > 0) {
      parts.push(`People mentioned: ${unique.join(", ")}.`)
    }
  }

  return parts.join(" ")
}
