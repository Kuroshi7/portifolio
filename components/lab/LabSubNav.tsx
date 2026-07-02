"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Scissors, Sparkles, Workflow, Network } from "lucide-react"

const items = [
  { href: "/lab", label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: "/lab/chunking", label: "Chunking", Icon: Scissors },
  { href: "/lab/embeddings", label: "Embeddings", Icon: Sparkles },
  { href: "/lab/rag", label: "RAG", Icon: Workflow },
  { href: "/lab/builder", label: "Agent Builder", Icon: Network },
]

export default function LabSubNav() {
  const pathname = usePathname() ?? "/lab"
  return (
    <div className="border-b border-lime-900/30 bg-gray-950/70 backdrop-blur-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 overflow-x-auto">
        <nav className="flex items-center gap-1 py-2 min-w-max">
          <span className="font-mono-tech text-[10px] tracking-[0.3em] text-lime-500/60 pr-3 mr-1 border-r border-lime-900/40 hidden sm:inline">
            AI://LAB
          </span>
          {items.map(({ href, label, Icon, exact }) => {
            const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-mono-tech rounded-sm transition-all duration-300 whitespace-nowrap ${
                  active
                    ? "bg-lime-900/30 text-lime-300 border border-lime-600/50 shadow-[0_0_12px_-4px_rgba(164,198,57,0.7)]"
                    : "text-gray-400 hover:text-lime-200 hover:bg-lime-900/10 border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
