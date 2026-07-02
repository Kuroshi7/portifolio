"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Building2, CalendarDays, MapPin, ExternalLink } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

type Experience = {
  id: number
  company: string
  role: string
  period: string
  location?: string
  description: string
  bullets?: string[]
  tech?: string[]
  image?: string | null
  link?: string | null
}

const experiences: Experience[] = [
  {
    id: 1,
    company: "Tamy AI",
    role: "Backend Developer",
    period: "2025",
    location: "Remote",
    description:
      "AI-powered financial assistant for restaurant owners via WhatsApp. Google for Startups backed company handling high-volume financial data from clients generating 1M+ BRL/month each.",
    bullets: [
      "Designed data-pipeline ingestion architecture using RabbitMQ queues with idempotency for large-scale data processing",
      "Managed infrastructure on GCP, Kubernetes, Docker, K9s",
      "Built PDV and banking integrations (Pluggy)",
      "AI development with LangChain, LangSmith and RAG",
      "Led architectural decisions approved directly by C-level leadership",
    ],
    tech: ["Node", "Python", "RabbitMQ", "GCP", "Kubernetes", "Docker", "LangChain", "RAG"],
    image: "/porco.png?height=300&width=300",
    link: "https://tamy.ai",
  },
  {
    id: 2,
    company: "Aploar",
    role: "Software Developer (Freelance)",
    period: "2025",
    location: "Remote",
    description:
      "Delivered features and integrations for web properties. Helped reduce operational overhead through automation and backend improvements.",
    bullets: [
      "API integrations and data flows",
      "Refactors for maintainability",
      "Deployment support and monitoring",
    ],
    tech: ["Node", "React", "SQL", "Docker"],
    image: "/apolar.webp",
    link: "https://www.apolar.com.br/triplea",
  },
  {
    id: 3,
    company: "iBolt",
    role: "Backend Developer (Freelance)",
    period: "2025",
    location: "Remote",
    description:
      "Backend development and banking integrations on a legacy codebase, focused on modernizing infrastructure and improving reliability.",
    bullets: [
      "Banking integration with Banco Inter",
      "Infrastructure modernization: migrated from Apache servers to Docker containers",
      "Legacy codebase refactoring and stabilization",
    ],
    tech: ["Java 8+", "Docker", "SQL", "REST APIs"],
    image: "/ibolt.jpeg",
    link: "http://www.iboltsys.com.br",
  },
  {
    id: 4,
    company: "ABDConst",
    role: "Web Developer (Contract)",
    period: "2025",
    location: "On‑site / Remote",
    description:
      "Implemented features and maintained web pages with an emphasis on usability and fast iteration cycles.",
    bullets: [
      "Landing pages and forms",
      "Performance and accessibility tweaks",
      "Content updates and SEO basics",
      "Data base management and operetional cost reductions"
    ],
    tech: ["React", "Node", "Tailwind"],
    image: "/abdconst.svg",
    link: "https://www.abdconst.com.br",
  },
]

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export default function ProfessionalBackground() {
  const total = experiences.length
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <motion.section
      id="background"
      className="container mx-auto py-16 px-4 relative z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
    >
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <div className="font-mono-tech text-xs tracking-[0.3em] text-lime-500/80 mb-3">
          // WHERE I&apos;VE SHIPPED
        </div>
        <h2 className="text-3xl md:text-4xl font-bold acid-glow tracking-wider">
          PROFESSIONAL BACKGROUND
        </h2>
      </motion.div>
  <div className="relative max-w-7xl mx-auto">
        {/* Edge fade overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-24 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-24 bg-gradient-to-l from-black to-transparent z-10" />

        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: true, duration: 25 }}
          className="relative"
        >
          <CarouselContent>
            {experiences.map((exp, idx) => {
              const active = idx === selected
              return (
                <CarouselItem
                  key={exp.id}
                  className="basis-full md:basis-[92%] lg:basis-[78%]"
                >
                  <motion.div
                    className="h-full"
                    initial={{ opacity: 0.7, scale: 0.985 }}
                    animate={{
                      opacity: active ? 1 : 0.6,
                      scale: active ? 1 : 0.985,
                    }}
                    transition={{ duration: 0.35 }}
                  >
                    <Card className="group relative clip-notch bg-gray-950/80 border-lime-900/50 overflow-hidden h-[560px] md:h-[600px] lg:h-[640px] flex flex-col">
                      {/* left accent bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-lime-500/70 via-lime-600/30 to-transparent" />
                      {/* index badge */}
                      <div className="absolute top-4 right-5 font-mono-tech text-[11px] tracking-widest text-lime-500/70">
                        {String(idx + 1).padStart(2, "0")} <span className="text-gray-700">/</span> {String(total).padStart(2, "0")}
                      </div>
                      <CardHeader className="border-b border-lime-900/20 pl-6">
                        <div className="font-mono-tech text-[10px] tracking-[0.3em] text-lime-500/70 mb-2">
                          // EXPERIENCE
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                          <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4 text-lime-400" /> {exp.company}</span>
                          <span className="text-gray-700">•</span>
                          <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4 text-lime-400" /> {exp.period}</span>
                          {exp.location && (
                            <>
                              <span className="text-gray-700">•</span>
                              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-lime-400" /> {exp.location}</span>
                            </>
                          )}
                        </div>
                        <CardTitle className="text-lime-300 text-2xl mt-2 group-hover:acid-glow transition-all">{exp.role}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 pl-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 py-6 h-full">
                          <div className="md:col-span-2 flex items-start">
                          <div className="frame-brackets relative w-full h-[220px] md:h-[260px] lg:h-[300px] clip-notch overflow-hidden border border-lime-900/50 bg-black/40 shadow-lg shadow-lime-500/10">
                            <div className="absolute inset-0 grid-bg-fine opacity-40 pointer-events-none" />
                            <Image
                              src={exp.image || "/placeholder-logo.png"}
                              alt={exp.company}
                              fill
                              className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-700 relative z-10"
                            />
                          </div>
                        </div>
                          <div className="md:col-span-3 flex flex-col gap-4 overflow-hidden">
                            <p className="text-gray-300 leading-relaxed">{exp.description}</p>

                            {exp.bullets && exp.bullets.length > 0 && (
                              <ul className="grid gap-2 text-gray-300 list-disc pl-4">
                                {exp.bullets.map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            )}

                            {exp.tech && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {exp.tech.map((t) => (
                                  <span
                                    key={t}
                                    className="font-mono-tech text-[11px] px-2.5 py-1 rounded-sm border border-lime-900/50 bg-lime-950/20 text-lime-300/90"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}

                            {exp.link && (
                              <a
                                href={exp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-lime-300 hover:text-lime-200 mt-2 font-mono-tech text-sm w-fit border-b border-lime-800/50 hover:border-lime-400 pb-0.5 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" /> visit site
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          <CarouselPrevious className="-left-3 md:-left-10 border-lime-900/50 bg-gray-900/70 hover:bg-lime-900/30" />
          <CarouselNext className="-right-3 md:-right-10 border-lime-900/50 bg-gray-900/70 hover:bg-lime-900/30" />
        </Carousel>
      </div>
    </motion.section>
  )
}
