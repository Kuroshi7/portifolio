"use client"

import { motion } from "framer-motion"
import { Brain, Workflow, Server, Plug } from "lucide-react"

type Domain = {
  Icon: React.ComponentType<{ className?: string }>
  title: string
  blurb: string
  tags: string[]
}

const domains: Domain[] = [
  {
    Icon: Brain,
    title: "AI / LLM Engineering",
    blurb: "Grounded, traceable AI features — not demos. Retrieval, evaluation and guardrails wired into production.",
    tags: ["LangChain", "LangSmith", "RAG", "Embeddings", "Prompt Ops", "Vector DBs", "OpenAI / Whisper"],
  },
  {
    Icon: Workflow,
    title: "Data Ingestion & Pipelines",
    blurb: "High-volume, idempotent ingestion from unreliable real-world sources, with retries, dead-letter and backfills.",
    tags: ["RabbitMQ", "Event-driven", "ETL", "Idempotency", "Backpressure", "Batch + Stream"],
  },
  {
    Icon: Server,
    title: "Infrastructure & DevOps",
    blurb: "Systems that stay up. Containerized, autoscaled, observable, deployed without downtime.",
    tags: ["GCP", "Kubernetes", "Docker", "K9s", "CI/CD", "Observability"],
  },
  {
    Icon: Plug,
    title: "Backend & Integrations",
    blurb: "Reliable services and third-party integrations — banking, payments and PDV — under real financial load.",
    tags: ["Node", "Go", "Python", "Java", "Pluggy / Banking", "REST APIs", "SQL / NoSQL"],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1 },
  }),
}

export default function TechArsenal() {
  return (
    <section id="arsenal" className="relative py-20 bg-gray-950/40">
      <div className="absolute inset-0 grid-bg mask-fade opacity-40 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="font-mono-tech text-xs tracking-[0.3em] text-lime-500/80 mb-3">
            // CAPABILITIES
          </div>
          <h2 className="text-3xl md:text-4xl font-bold acid-glow tracking-wider">
            THE STACK I SHIP WITH
          </h2>
          <p className="text-gray-400 mt-4">
            Four domains, one throughline: build things that survive contact with production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {domains.map((d, i) => (
            <motion.div
              key={d.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative frame-brackets bg-black/60 border border-lime-900/40 hover:border-lime-500/60 transition-all duration-300 hover:-translate-y-1 p-6 rounded-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-sm bg-lime-950/40 border border-lime-900/50 group-hover:border-lime-500/60 transition-colors">
                  <d.Icon className="h-6 w-6 text-lime-400" />
                </div>
                <h3 className="text-xl font-semibold text-lime-200">{d.title}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">{d.blurb}</p>
              <div className="flex flex-wrap gap-2">
                {d.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono-tech text-[11px] px-2.5 py-1 rounded-sm border border-lime-900/50 bg-lime-950/20 text-lime-300/90 hover:bg-lime-900/30 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
