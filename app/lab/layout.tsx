import type React from "react"
import LabSubNav from "@/components/lab/LabSubNav"

export const metadata = {
  title: "AI Lab | Kuroshi7",
  description: "Interactive visualizer for agentic AI pipelines — chunking, embeddings, RAG, and LangGraph-style agent graphs.",
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10">
      <LabSubNav />
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
