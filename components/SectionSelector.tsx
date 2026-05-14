"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FolderGit2, FlaskConical } from "lucide-react"

const sections = [
  { href: "/", label: "Portfolio", Icon: FolderGit2, matcher: (p: string) => p === "/" },
  { href: "/lab", label: "AI Lab", Icon: FlaskConical, matcher: (p: string) => p === "/lab" || p.startsWith("/lab/") },
]

export default function SectionSelector() {
  const pathname = usePathname() ?? "/"
  return (
    <div className="w-full bg-black/80 backdrop-blur-sm border-b border-lime-900/30 relative z-20">
      <div className="container mx-auto px-4 py-3 flex justify-center">
        <div className="inline-flex items-center bg-gray-900 border border-lime-900/50 rounded-md p-1">
          {sections.map(({ href, label, Icon, matcher }) => {
            const active = matcher(pathname)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-300 ${
                  active
                    ? "bg-lime-900/30 text-lime-300"
                    : "text-gray-400 hover:text-lime-200 hover:bg-lime-900/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
