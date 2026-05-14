import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"
import SectionSelector from "@/components/SectionSelector"

export const metadata = {
  title: "Kuroshi7 | Portfolio",
  description: "Personal portfolio showcasing projects and skills",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.png" type="image/x-icon" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen bg-black text-gray-200">
            <div className="fixed inset-0 bg-[url('/namebackground3v.png?height=500&width=1000')] bg-no-repeat bg-center bg-[length:80%] opacity-15 pointer-events-none z-0"></div>
            <SiteHeader />
            <SectionSelector />
            <main className="relative z-10">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'
