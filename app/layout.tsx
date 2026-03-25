import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "EchoThread | Your Voice, Your Story, Beautifully Remembered",
  description: "Turn 30-second voice notes into a beautifully written life journal. AI-powered personal biography that grows wiser with every recording.",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream antialiased">
        {children}
      </body>
    </html>
  )
}
