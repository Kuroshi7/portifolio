"use client"

import dynamic from "next/dynamic"

const AgentBuilder = dynamic(() => import("@/components/lab/AgentBuilder"), {
  ssr: false,
  loading: () => (
    <div className="border border-lime-900/40 rounded-sm bg-black/60 h-[520px] flex items-center justify-center text-gray-500">
      Loading graph canvas…
    </div>
  ),
})

export default function BuilderPage() {
  return <AgentBuilder />
}
