"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Github, Mail, FileText, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import SystemStatus from "@/components/SystemStatus"

const metrics = [
  { label: "SCALE / CLIENT", value: "1M+ BRL", sub: "monthly volume ingested" },
  { label: "PIPELINE", value: "IDEMPOTENT", sub: "queue-backed ingestion" },
  { label: "STACK", value: "AI · RAG", sub: "LangChain · LangSmith" },
  { label: "INFRA", value: "GCP · K8s", sub: "Docker · RabbitMQ" },
]

export default function SiteHeader() {
  return (
    <section className="relative overflow-hidden bg-black text-gray-200 border-b border-lime-900/30">
      {/* Layered backgrounds */}
      <div className="absolute inset-0 grid-bg mask-fade opacity-70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-lime-950/10 via-transparent to-black pointer-events-none" />
      <div className="absolute inset-0 scanline pointer-events-none" />

      {/* VICTOR SOFFI logo — large faded watermark */}
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[min(60vw,760px)] aspect-square opacity-[0.10] pointer-events-none select-none mix-blend-lighten">
        <Image src="/victor-logo.png" alt="" fill className="object-contain" priority />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-14 pb-10 md:pt-16 md:pb-14">
        {/* Top status line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-tech text-[11px] md:text-xs text-lime-400/80 mb-8"
        >
          <span className="status-dot" />
          <span className="tracking-widest">SYSTEMS ONLINE</span>
          <span className="text-gray-700">//</span>
          <span className="text-gray-500">AI &amp; DATA-PIPELINE ENGINEERING</span>
        </motion.div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8 md:gap-12 items-center">
          {/* Left: big portrait photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[320px]"
          >
            <div className="absolute -inset-4 bg-lime-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="frame-brackets relative">
              <div className="relative aspect-[3/4] w-full overflow-hidden clip-notch border border-lime-500/40 shadow-2xl shadow-lime-950/50">
                <Image
                  src="/profilepic.jpg"
                  alt="Victor Soffi"
                  fill
                  priority
                  sizes="(max-width: 1024px) 320px, 320px"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                {/* tint + scanline over photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-lime-900/10 pointer-events-none" />
                <div className="absolute inset-0 scanline pointer-events-none opacity-60" />
                {/* nameplate */}
                <div className="absolute bottom-0 left-0 right-0 p-3 font-mono-tech text-[11px]">
                  <span className="text-lime-300 tracking-widest">VICTOR SOFFI</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: STANISLAWSKI brand + copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative w-full max-w-[560px]"
            >
              <div className="font-mono-tech text-[10px] tracking-[0.35em] text-lime-500/70 mb-2">
                CODENAME
              </div>
              <Image
                src="/stanislauski.png"
                alt="Stanislauski"
                width={1575}
                height={999}
                priority
                className="w-full max-w-[520px] h-auto drop-shadow-[0_0_28px_rgba(164,198,57,0.28)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-5 max-w-xl"
            >
              <h2 className="text-lg md:text-xl font-mono-tech tracking-wide text-lime-300">
                AI &amp; Data-Pipeline Engineer
                <span className="text-gray-500"> @ </span>
                <a href="https://tamy.ai" target="_blank" rel="noopener noreferrer" className="hover:text-lime-200 underline decoration-lime-800 underline-offset-4">tamy.ai</a>
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                I design and operate the systems behind AI products — high-volume
                <span className="text-lime-300"> data-ingestion pipelines</span>, resilient
                <span className="text-lime-300"> banking &amp; PDV integrations</span>, and
                <span className="text-lime-300"> RAG-powered</span> assistants running on
                Kubernetes. Built to be idempotent, observable, and hard to break.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Button
                  asChild
                  className="bg-lime-500/90 hover:bg-lime-400 text-black font-semibold transition-all hover:scale-105 clip-notch"
                >
                  <a href="#architecture">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    See the architecture
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-lime-800 hover:bg-lime-900/30 hover:text-lime-300 transition-all hover:scale-105"
                >
                  <a href="/victor_soffi_curriculo.pdf" download>
                    <FileText className="mr-2 h-4 w-4" />
                    Resume
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-lime-800 hover:bg-lime-900/30 hover:text-lime-300 transition-all hover:scale-105"
                >
                  <a href="https://github.com/Kuroshi7" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-lime-800 hover:bg-lime-900/30 hover:text-lime-300 transition-all hover:scale-105"
                >
                  <a href="/#contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Row 2: live status + metric strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid lg:grid-cols-[minmax(0,380px)_1fr] gap-6 mt-12 items-stretch"
        >
          <SystemStatus />
          <div className="grid grid-cols-2 gap-px bg-lime-900/30 border border-lime-900/40 rounded-sm overflow-hidden">
            {metrics.map((m) => (
              <div key={m.label} className="bg-black/70 p-4 md:p-5 flex flex-col justify-center hover:bg-lime-950/30 transition-colors">
                <div className="font-mono-tech text-[10px] tracking-widest text-gray-500 mb-1">{m.label}</div>
                <div className="text-lg md:text-2xl font-bold acid-glow leading-tight">{m.value}</div>
                <div className="text-xs text-gray-500 mt-1">{m.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
