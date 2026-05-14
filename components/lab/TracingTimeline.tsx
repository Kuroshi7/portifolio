"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLabStore } from "@/stores/labStore"
import type { EventSeverity, NodeType } from "@/core/engine/types"

const nodeColor: Record<NodeType, string> = {
  input: "text-gray-300",
  chunker: "text-cyan-300",
  embedder: "text-fuchsia-300",
  retriever: "text-lime-300",
  ranker: "text-yellow-300",
  prompt: "text-orange-300",
  llm: "text-emerald-300",
  tool: "text-blue-300",
  memory: "text-pink-300",
  router: "text-violet-300",
  conditional: "text-amber-300",
  reflection: "text-rose-300",
  output: "text-gray-200",
}

const severityDot: Record<EventSeverity, string> = {
  info: "bg-gray-500",
  success: "bg-lime-400",
  warn: "bg-yellow-400",
  error: "bg-red-500",
}

export default function TracingTimeline() {
  const events = useLabStore((s) => s.events)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [events.length])

  return (
    <div className="border border-lime-900/40 rounded-sm bg-black/70 backdrop-blur-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-lime-900/40 bg-gray-950/80 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-lime-300">Tracing</span>
        <span className="text-xs text-gray-500">{events.length} event(s)</span>
      </div>
      <div ref={scrollRef} className="h-64 overflow-y-auto font-mono text-xs">
        {events.length === 0 ? (
          <div className="p-4 text-gray-600 italic">No events yet. Run the pipeline.</div>
        ) : (
          <ul className="divide-y divide-gray-900/60">
            <AnimatePresence initial={false}>
              {events.map((e) => (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className="px-3 py-1.5 flex items-baseline gap-2 hover:bg-lime-900/10"
                >
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 ${severityDot[e.severity]}`} />
                  <span className="text-gray-500 w-14 tabular-nums">[{e.tStartMs}ms]</span>
                  <span className={`w-20 ${nodeColor[e.nodeType]}`}>{e.nodeType}</span>
                  <span className="text-gray-300 truncate">{e.message}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  )
}
