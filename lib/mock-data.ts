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

export const mockThreads: Thread[] = [
  {
    id: "1",
    date: "March 25, 2026",
    time: "8:42 PM",
    duration: 28,
    transcript: "Today was one of those quiet days where everything just felt right...",
    polished: "There is something about a quiet Tuesday evening that makes you stop and notice things. I spent the afternoon in the garden with Mom, neither of us saying much, just pulling weeds and checking on the tomatoes she planted last month. The soil was still warm from the sun. She hummed something I did not recognize, maybe a song from her childhood. I found myself thinking about how these small moments are the ones I will remember most. Not the big events or the milestones, but the sound of her humming while the light turned golden around us.",
    summary: "A peaceful evening gardening with Mom, reflecting on quiet moments",
    mood: "grateful",
    moodScore: 0.85,
    tags: [
      { name: "Mom", category: "person", color: "bg-blue-100 text-blue-700" },
      { name: "Garden", category: "place", color: "bg-green-100 text-green-700" },
      { name: "Evening", category: "time", color: "bg-amber-100 text-amber-700" },
      { name: "Peaceful", category: "emotion", color: "bg-purple-100 text-purple-700" },
    ],
    insight: "You mention your mom and gardening together frequently. These moments consistently bring your calmest, most grateful states. Over the last month, every thread involving nature has scored above 0.7 in mood positivity.",
  },
  {
    id: "2",
    date: "March 25, 2026",
    time: "12:15 PM",
    duration: 22,
    transcript: "Had that meeting with the team and I think we finally cracked it...",
    polished: "The product meeting today felt different. After three weeks of going back and forth on the architecture, Sarah suggested we flip the whole approach and start from the user journey instead of the technical constraints. The room went quiet for a second, and then everyone started building on it. Within an hour we had a whiteboard full of ideas that actually made sense. I left feeling lighter than I have in weeks. Sometimes the answer is not pushing harder, it is stepping back and looking at the problem from a completely different angle.",
    summary: "Breakthrough in team meeting when Sarah shifted the approach",
    mood: "excited",
    moodScore: 0.78,
    tags: [
      { name: "Sarah", category: "person", color: "bg-blue-100 text-blue-700" },
      { name: "Work", category: "activity", color: "bg-orange-100 text-orange-700" },
      { name: "Team", category: "person", color: "bg-blue-100 text-blue-700" },
      { name: "Inspired", category: "emotion", color: "bg-purple-100 text-purple-700" },
    ],
    insight: "Your work threads show a pattern: breakthroughs often follow periods of frustration. You mentioned feeling stuck for three weeks, similar to January when the design sprint stalled before a resolution.",
  },
  {
    id: "3",
    date: "March 24, 2026",
    time: "10:30 PM",
    duration: 31,
    transcript: "I could not sleep so I went for a walk around the block...",
    polished: "Insomnia has its gifts. When sleep would not come tonight, I put on my coat and stepped outside. The neighborhood is different at this hour, quieter but not silent. Someone was practicing piano two houses down, the notes drifting through their open window. The air smelled like rain even though the sky was clear. I walked three blocks and back, no destination, no podcast, no phone. Just walking and listening. By the time I got home, whatever was keeping me awake had dissolved. I did not solve anything. I just let the night air do its work.",
    summary: "A late night walk to cure insomnia, finding peace in the quiet neighborhood",
    mood: "reflective",
    moodScore: 0.62,
    tags: [
      { name: "Night walk", category: "activity", color: "bg-orange-100 text-orange-700" },
      { name: "Home", category: "place", color: "bg-green-100 text-green-700" },
      { name: "Solitude", category: "emotion", color: "bg-purple-100 text-purple-700" },
    ],
    insight: "You have recorded three late-night threads this month. Each one follows a similar arc: restlessness that transforms into calm through simple, unstructured activity. Walking seems to be your natural reset.",
  },
  {
    id: "4",
    date: "March 24, 2026",
    time: "7:00 AM",
    duration: 19,
    transcript: "Morning coffee ritual, thinking about what Dad said yesterday...",
    polished: "Dad called yesterday and said something that stuck with me. He said he spent his thirties worrying about things that never happened, and his forties realizing that the best moments were the ones he almost missed because he was worrying. I am sitting here with my morning coffee, watching the light come through the kitchen window, and I think I understand what he meant. This moment, right now, is not remarkable. But it is mine, and I am here for it.",
    summary: "Morning reflection on Dad's advice about being present",
    mood: "calm",
    moodScore: 0.72,
    tags: [
      { name: "Dad", category: "person", color: "bg-blue-100 text-blue-700" },
      { name: "Morning", category: "time", color: "bg-amber-100 text-amber-700" },
      { name: "Coffee", category: "activity", color: "bg-orange-100 text-orange-700" },
      { name: "Mindful", category: "emotion", color: "bg-purple-100 text-purple-700" },
    ],
    insight: "Family conversations, especially with your Dad, often spark your most reflective threads. You process their words the morning after, suggesting you are a deep thinker who needs time to absorb wisdom.",
  },
  {
    id: "5",
    date: "March 23, 2026",
    time: "3:45 PM",
    duration: 25,
    transcript: "Just finished reading that book Alex recommended...",
    polished: "Finished 'Four Thousand Weeks' today, the one Alex kept insisting I read. He was right. There is a chapter about how we treat time as a resource to optimize instead of an experience to inhabit. It hit differently after last week, when I spent an entire Saturday trying to be productive and ended up feeling worse than if I had done nothing. The book's central argument is that accepting our limitations is not giving up. It is the first step toward actually living. I want to sit with that idea for a while before I decide if I agree.",
    summary: "Finishing a recommended book about time and finding its ideas resonant",
    mood: "reflective",
    moodScore: 0.65,
    tags: [
      { name: "Alex", category: "person", color: "bg-blue-100 text-blue-700" },
      { name: "Reading", category: "activity", color: "bg-orange-100 text-orange-700" },
      { name: "Books", category: "topic", color: "bg-teal-100 text-teal-700" },
      { name: "Thoughtful", category: "emotion", color: "bg-purple-100 text-purple-700" },
    ],
    insight: "You have mentioned Alex three times this month, always in the context of recommendations or shared interests. Books and reading appear in your threads roughly twice a week, making it one of your most consistent themes.",
  },
]

export const mockReview: Review = {
  month: "February",
  year: 2026,
  title: "Your Month in Reflection",
  totalThreads: 24,
  streakDays: 21,
  topMood: "Reflective",
  moodArc: [
    { day: 1, score: 0.6, mood: "calm" },
    { day: 2, score: 0.7, mood: "grateful" },
    { day: 3, score: 0.5, mood: "neutral" },
    { day: 4, score: 0.8, mood: "excited" },
    { day: 5, score: 0.75, mood: "joyful" },
    { day: 6, score: 0.4, mood: "anxious" },
    { day: 7, score: 0.55, mood: "reflective" },
    { day: 8, score: 0.65, mood: "calm" },
    { day: 9, score: 0.7, mood: "grateful" },
    { day: 10, score: 0.6, mood: "reflective" },
    { day: 11, score: 0.85, mood: "joyful" },
    { day: 12, score: 0.9, mood: "grateful" },
    { day: 13, score: 0.5, mood: "neutral" },
    { day: 14, score: 0.45, mood: "sad" },
    { day: 15, score: 0.55, mood: "reflective" },
    { day: 16, score: 0.7, mood: "calm" },
    { day: 17, score: 0.75, mood: "excited" },
    { day: 18, score: 0.8, mood: "grateful" },
    { day: 19, score: 0.65, mood: "reflective" },
    { day: 20, score: 0.7, mood: "calm" },
    { day: 21, score: 0.85, mood: "joyful" },
    { day: 22, score: 0.6, mood: "reflective" },
    { day: 23, score: 0.75, mood: "grateful" },
    { day: 24, score: 0.8, mood: "excited" },
    { day: 25, score: 0.7, mood: "calm" },
    { day: 26, score: 0.65, mood: "reflective" },
    { day: 27, score: 0.9, mood: "joyful" },
    { day: 28, score: 0.85, mood: "grateful" },
  ],
  highlights: [
    {
      date: "Feb 12",
      text: "I sat in the garden after rain, watching the light change through the wet leaves. It felt like time stopped, just for a moment. I could hear every drop still falling from the eaves.",
    },
    {
      date: "Feb 21",
      text: "The kids put on a play in the living room tonight. Terrible acting, brilliant writing. I laughed until my sides hurt. These are the evenings I never want to forget.",
    },
    {
      date: "Feb 27",
      text: "Walked to the old bridge at sunset with no particular reason. The river was high, and the light was doing that thing where everything looks like a painting. Sometimes beauty just ambushes you.",
    },
  ],
  patterns: [
    "You recorded 24 out of 28 days",
    "Most common mood: Reflective",
    "People mentioned most: Sarah, Dad, Alex",
    "New topic this month: Meditation",
    "Peak mood days: weekends, especially Sunday mornings",
    "Your threads are getting longer, averaging 27 seconds (up from 22)",
  ],
  peopleMentioned: ["Sarah", "Dad", "Alex", "Mom", "Jamie"],
}

export const mockChatMessages = [
  {
    id: "1",
    role: "user" as const,
    text: "When was the last time I felt truly peaceful?",
  },
  {
    id: "2",
    role: "assistant" as const,
    text: 'On February 12th, you described sitting in the garden after rain, watching the light change through the wet leaves. You said it felt like time stopped. Before that, on January 28th, after finishing a long book on a Sunday afternoon, you recorded: "There is a specific kind of peace that comes from reaching the last page of something you loved." Both moments share a pattern: you find deep peace in stillness after completion, whether it is rain finishing or a story ending.',
  },
  {
    id: "3",
    role: "user" as const,
    text: "What has been worrying me lately?",
  },
  {
    id: "4",
    role: "assistant" as const,
    text: "Over the past two weeks, three threads mention the upcoming project deadline at work. On March 18th, you said you felt the weight of it even during dinner. On March 20th, you recorded a thread at 2 AM about not being able to sleep. But there is a hopeful note: your March 22nd thread after the team meeting showed genuine relief and excitement about the new direction Sarah proposed. The worry seems to be transforming into momentum.",
  },
  {
    id: "5",
    role: "user" as const,
    text: "What would past me from January say to me now?",
  },
  {
    id: "6",
    role: "assistant" as const,
    text: "In January, you were in a reflective, almost philosophical mood. On January 15th you said: \"I think this year I want to stop measuring days by what I accomplished and start measuring them by what I noticed.\" January-you would probably look at your March threads and smile. You have been noticing a lot: the garden light, late-night piano music, your Dad's wisdom about worry. January-you set an intention, and March-you has been living it without even realizing it.",
  },
]

export const weeklyMoods = [
  { day: "Mon", mood: "calm", color: "#60A5FA" },
  { day: "Tue", mood: "grateful", color: "#F9A825" },
  { day: "Wed", mood: "reflective", color: "#A78BFA" },
  { day: "Thu", mood: "excited", color: "#FB923C" },
  { day: "Fri", mood: "joyful", color: "#FBBF24" },
  { day: "Sat", mood: "calm", color: "#60A5FA" },
  { day: "Sun", mood: "grateful", color: "#F9A825" },
]
