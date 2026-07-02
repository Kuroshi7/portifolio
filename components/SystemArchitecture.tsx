"use client"

import { motion } from "framer-motion"
import {
  MessageSquare,
  Landmark,
  Receipt,
  FileStack,
  ShieldCheck,
  Layers,
  Cpu,
  Database,
  Sparkles,
  Bot,
  ChevronRight,
} from "lucide-react"

type Stage = {
  id: string
  label: string
  title: string
  Icon: React.ComponentType<{ className?: string }>
  points: string[]
}

const sources = [
  { Icon: MessageSquare, label: "WhatsApp" },
  { Icon: Landmark, label: "Banking APIs / Pluggy" },
  { Icon: Receipt, label: "PDV / POS" },
  { Icon: FileStack, label: "NF-e / Documents" },
]

const stages: Stage[] = [
  {
    id: "ingest",
    label: "01 · INGEST",
    title: "Ingestion Gateway",
    Icon: ShieldCheck,
    points: ["Schema validation", "Idempotency keys", "Auth & rate limits"],
  },
  {
    id: "queue",
    label: "02 · BUFFER",
    title: "RabbitMQ Queues",
    Icon: Layers,
    points: ["Back-pressure safe", "Retries + DLQ", "Exactly-once semantics"],
  },
  {
    id: "process",
    label: "03 · PROCESS",
    title: "ETL Workers · K8s",
    Icon: Cpu,
    points: ["Normalization", "Enrichment", "Autoscaled on GKE"],
  },
  {
    id: "store",
    label: "04 · INDEX",
    title: "Store + Vector DB",
    Icon: Database,
    points: ["Structured store", "Embeddings index", "Audit trail"],
  },
  {
    id: "intel",
    label: "05 · REASON",
    title: "RAG / LangChain",
    Icon: Sparkles,
    points: ["Retrieval + ranking", "Grounded answers", "Traced w/ LangSmith"],
  },
  {
    id: "deliver",
    label: "06 · DELIVER",
    title: "AI Assistant",
    Icon: Bot,
    points: ["WhatsApp replies", "Financial insight", "Sub-second UX"],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
}

export default function SystemArchitecture() {
  return (
    <section
      id="architecture"
      className="relative py-20 border-y border-lime-900/30 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg-fine mask-fade opacity-60 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <div className="font-mono-tech text-xs tracking-[0.3em] text-lime-500/80 mb-3">
            // REFERENCE ARCHITECTURE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold acid-glow tracking-wider">
            HOW THE DATA MOVES
          </h2>
          <p className="text-gray-400 mt-4">
            The production shape of the pipelines I build at{" "}
            <span className="text-lime-300">Tamy</span> — from messy real-world sources
            to a grounded AI assistant. Every hop is idempotent, retryable, and observable.
          </p>
        </div>

        {/* Sources rail */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-wrap justify-center gap-3 my-8"
        >
          {sources.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              className="flex items-center gap-2 px-3 py-2 rounded-sm border border-lime-900/40 bg-black/50 text-sm text-gray-300"
            >
              <s.Icon className="h-4 w-4 text-lime-400" />
              {s.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Downlink into pipeline */}
        <div className="flex justify-center mb-6">
          <div className="relative h-10 w-px bg-gradient-to-b from-lime-900/30 via-lime-600/50 to-lime-900/30">
            <span className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-lime-300 shadow-[0_0_8px_rgba(164,198,57,0.9)] packet-y" />
          </div>
        </div>

        {/* Pipeline — responsive grid, no scroll */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          {stages.map((stage, i) => (
            <motion.div
              key={stage.id}
              custom={i}
              variants={fadeUp}
              className="group relative h-full clip-notch bg-gray-950/80 border border-lime-900/50 hover:border-lime-500/70 transition-colors p-5"
            >
              {/* flow chevron between cards (single-row layout only) */}
              {i < stages.length - 1 && (
                <ChevronRight className="hidden xl:block absolute top-1/2 -right-3 -translate-y-1/2 h-4 w-4 text-lime-600 z-10" />
              )}
              <div className="font-mono-tech text-[10px] tracking-widest text-lime-500/80 mb-3">
                {stage.label}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-sm bg-black/60 border border-lime-900/50 group-hover:border-lime-500/60 transition-colors">
                  <stage.Icon className="h-5 w-5 text-lime-400" />
                </div>
                <h3 className="text-lime-200 font-semibold leading-tight">{stage.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {stage.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="mt-1 w-1 h-1 rounded-full bg-lime-500 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Guarantees strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-10 font-mono-tech text-xs text-gray-500"
        >
          {[
            "at-least-once delivery",
            "idempotent consumers",
            "dead-letter recovery",
            "full request tracing",
            "zero-downtime deploys",
          ].map((g) => (
            <span key={g} className="flex items-center gap-2">
              <span className="text-lime-500">✓</span>
              {g}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
