"use client"

import { motion } from "framer-motion"
import { ArrowRight, type LucideIcon } from "lucide-react"

export interface PipelineStep {
  id: string
  label: string
  Icon: LucideIcon
}

interface Props {
  steps: PipelineStep[]
  activeId: string | null
  completedIds: Set<string>
}

export default function PipelineStepIndicator({ steps, activeId, completedIds }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {steps.map((s, idx) => {
        const isActive = s.id === activeId
        const isDone = completedIds.has(s.id)
        const tone = isActive
          ? "border-lime-400 text-lime-300 shadow-[0_0_18px_-2px_rgba(164,198,57,0.7)]"
          : isDone
          ? "border-lime-700 text-lime-200/80"
          : "border-gray-800 text-gray-600"
        return (
          <div key={s.id} className="flex items-center gap-2">
            <motion.div
              animate={{ scale: isActive ? 1.06 : 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14 }}
              className={`flex items-center gap-2 px-3 py-2 border-2 rounded-sm bg-black/60 transition-colors duration-300 ${tone}`}
            >
              <s.Icon className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
            </motion.div>
            {idx < steps.length - 1 && (
              <ArrowRight className={`h-4 w-4 ${isDone || isActive ? "text-lime-500" : "text-gray-700"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
