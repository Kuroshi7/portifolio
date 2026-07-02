"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Github, ExternalLink, Mail, FileText, Music, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import ProfessionalBackground from "@/components/ProfessionalBackground"
import SystemArchitecture from "@/components/SystemArchitecture"
import TechArsenal from "@/components/TechArsenal"


// Project data with multiple categories
const projects = [
  {
    id: 1,
    name: "Go-backup-tool",
    description:
      "A powerful backup tool built with Go that provides reduced backup times for large databases, incremental backups with concurrency.",
    image: "/gobackup.jpg?height=300&width=600",
    tags: ["Go", "CLI", "Backup", "Automation"],
    github: "https://github.com/Kuroshi7/go-db-backup",
    demo: null,
    languages: ["Go"],
    featured: true,
    categories: ["tools"],
  },
  {
    id: 2,
    name: "PyTranscribe",
    description:
      "Audio transcription tool built with Python that converts speech to text using advanced AI models. Supports multiple languages and formats.",
    image: "/openaiwhisper.jpg?height=300&width=600",
    tags: ["Python", "AI", "Audio", "CLI", "Transcription", "Automation"],
    github: "https://github.com/Kuroshi7/PyTranscribe",
    demo: null,
    languages: ["Python"],
    featured: true,
    categories: ["ai", "tools"],
  },
  {
    id: 3,
    name: "PicNest",
    description:
      "Full stack Instagram-like web application Features publishing photos, comments and likes using JWT authentication and redux",
    image: "/picnest.png?height=300&width=600",
    tags: ["JavaScript", "social media"],
    github: "https://github.com/Kuroshi7/ReactGram-Fullstack",
    demo: null,
    languages: ["Node", "React"],
    featured: true,
    categories: ["web"],
  },
  {
    id: 4,
    name: "Lia — Menu AI Agent",
    description:
      "Conversational AI that recommends menu dishes by dietary restriction. A LangChain tool-calling agent with a dual LLM provider (local Ollama or Claude API), two-layer scope guardrails, per-step observability and a one-command Docker Compose deploy.",
    image: "/lia.png",
    tags: ["LangChain", "FastAPI", "Agent", "Ollama", "Claude", "Docker"],
    github: "https://github.com/Kuroshi7/L_IA",
    demo: null,
    languages: ["Python", "React"],
    featured: true,
    categories: ["ai"],
  },
    {
    id: 5,
    name: "Zoomanager",
    description: "A web aplication for managing animals in a zoo and their needed care, with a focus on back-end and database management (the spool time for the database is a bit high around 50 seconds, so be patient)",
    image: "/zoomanager.png?height=300&width=600",
    tags: ["Mobile", "Management", "Vite"],
    github: "https://github.com/Kuroshi7/zoomanager",
    demo: "https://zoomanager.vercel.app",
    languages: ["Go", "TypeScript"],
    featured: true,
    categories: ["web", "mobile"],
  },
  {
    id: 6,
    name: "OPOLZ Studio",
    description:
      "Website for a Brazilian creative studio — branding, 3D product visuals and campaigns. Motion-heavy front-end with a bold, memorable brand identity. Designed and built end to end.",
    image: "/opolzstudio.png",
    tags: ["Next.js", "Branding", "3D / Motion", "Design"],
    github: "",
    demo: "https://opolzstudio.com",
    languages: ["TypeScript", "React"],
    featured: true,
    categories: ["web"],
  },
]

// Animation variants with more aggressive feel
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number] },
  },
  hover: {
    y: -8,
    boxShadow: "0 10px 30px rgba(164, 198, 57, 0.2)",
    transition: { duration: 0.3 },
  },
}

// Category badges with Monster-inspired colors
const CategoryBadge = ({ category }: { category: string }) => {
  const colors: Record<string, string> = {
    tools: "bg-lime-900/70 text-lime-300 border border-lime-700",
    ai: "bg-purple-900/70 text-purple-300 border border-purple-700",
    web: "bg-cyan-900/70 text-cyan-300 border border-cyan-700",
    mobile: "bg-yellow-900/70 text-yellow-300 border border-yellow-700",
  }

  const labels: Record<string, string> = {
    tools: "CLI Tool",
    ai: "AI",
    web: "Web",
    mobile: "Mobile",
  }

  return (
    <span className={`font-mono-tech text-[10px] tracking-wider px-2 py-1 rounded-sm backdrop-blur-sm ${colors[category]}`}>
      {labels[category]}
    </span>
  )
}

export default function Portfolio() {
  const [filter, setFilter] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState(projects)

  useEffect(() => {
    setIsLoaded(true)
    filterProjects("all")
  }, [])

  // Filter function for multiple categories
  const filterProjects = (filterValue: string) => {
    setFilter(filterValue)

    if (filterValue === "all") {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter((project) => project.categories.includes(filterValue))
      setFilteredProjects(filtered)
    }
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-600",
      TypeScript: "bg-blue-600",
      Python: "bg-green-600",
      Java: "bg-red-600",
      Go: "bg-cyan-600",
      "C#": "bg-purple-600",
      HTML: "bg-orange-600",
      CSS: "bg-pink-600",
      PHP: "bg-indigo-600",
      Ruby: "bg-red-700",
      Rust: "bg-orange-700",
      "C++": "bg-pink-700",
      C: "bg-gray-600",
      Node: "bg-green-700",
      React: "bg-blue-700",
    }

    return colors[language] || "bg-gray-600"
  }

  return (
    <>
      {/* Flagship: System Architecture */}
      <SystemArchitecture />

      {/* Professional Background */}
      <ProfessionalBackground />

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="container mx-auto py-16 px-4 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-mono-tech text-xs tracking-[0.3em] text-lime-500/80 mb-3">
            // SELECTED WORK
          </div>
          <h2 className="text-3xl md:text-4xl font-bold acid-glow tracking-wider">
            FEATURED PROJECTS
          </h2>
        </motion.div>

        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-center">
            <TabsList className="bg-gray-900 border border-lime-900/50">
              <TabsTrigger
                value="all"
                onClick={() => filterProjects("all")}
                className="data-[state=active]:bg-lime-900/30 data-[state=active]:text-lime-300 transition-all duration-300"
              >
                All Projects
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                onClick={() => filterProjects("tools")}
                className="data-[state=active]:bg-lime-900/30 data-[state=active]:text-lime-300 transition-all duration-300"
              >
                Tools
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                onClick={() => filterProjects("ai")}
                className="data-[state=active]:bg-lime-900/30 data-[state=active]:text-lime-300 transition-all duration-300"
              >
                AI
              </TabsTrigger>
              <TabsTrigger
                value="web"
                onClick={() => filterProjects("web")}
                className="data-[state=active]:bg-lime-900/30 data-[state=active]:text-lime-300 transition-all duration-300"
              >
                Web
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                onClick={() => filterProjects("mobile")}
                className="data-[state=active]:bg-lime-900/30 data-[state=active]:text-lime-300 transition-all duration-300"
              >
                Mobile
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={filter} className="mt-8 transition-all duration-500 ease-in-out">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              key={filter}
            >
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={cardVariants} whileHover="hover">
                  <Card className="group relative clip-notch flex flex-col h-full overflow-hidden transition-all duration-300 bg-gray-950/80 border-lime-900/50 hover:border-lime-500">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                      />
                      {/* project index */}
                      <div className="absolute top-2 left-3 font-mono-tech text-[11px] tracking-widest text-lime-300/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                        {String(project.id).padStart(2, "0")}
                      </div>
                      {/* Category badges */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {project.categories.map((category) => (
                          <CategoryBadge key={category} category={category} />
                        ))}
                      </div>
                      {/* Dark overlay + scanline */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                      <div className="absolute inset-0 scanline opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    <CardHeader className="border-b border-lime-900/20">
                      <div className="flex items-center gap-1">
                        {project.languages.map((lang) => (
                          <span key={lang} className={`w-3 h-3 rounded-sm ${getLanguageColor(lang)}`}></span>
                        ))}
                        <span className="font-mono-tech text-xs text-gray-400 ml-2">
                          {project.languages.join(" · ")}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-1 text-lime-300 group-hover:acid-glow transition-all">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono-tech text-[11px] px-2 py-0.5 rounded-sm border border-lime-900/50 bg-lime-950/20 text-lime-300/80 hover:bg-lime-900/30 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-lime-900/20 pt-4">
                      <div className="flex gap-2 w-full">
                        {project.github && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-lime-900/50 hover:bg-lime-900/30 hover:text-lime-300 transition-all duration-300"
                            asChild
                          >
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-2" />
                              Code
                            </a>
                          </Button>
                        )}
                        {project.demo && (
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 bg-lime-900/70 hover:bg-lime-800 text-gray-200 transition-all duration-300"
                            asChild
                          >
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* Capabilities: Tech Arsenal */}
      <TechArsenal />

      {/* About Section */}
      <motion.section
        id="about"
        className="container mx-auto py-16 px-4 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-mono-tech text-xs tracking-[0.3em] text-lime-500/80 mb-3">
              // OPERATOR
            </div>
            <h2 className="text-3xl md:text-4xl font-bold acid-glow tracking-wider">
              ABOUT ME
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative w-full max-w-[320px] mx-auto aspect-[3/4] rounded-sm overflow-hidden border border-lime-900/50 shadow-lg shadow-lime-500/10">
                <Image
                  src="/profilepic.jpg"
                  alt="Victor Soffi"
                  fill
                  sizes="(max-width: 768px) 320px, 320px"
                  className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-lime-400 ">Victor Soffi</h3>
              <h4 className="text-xl text-gray-400 mb-6 tracking-wider">AI &amp; DATA-PIPELINE ENGINEER</h4>

              <p className="mb-4 text-gray-300">
                I build the plumbing behind AI products. At <span className="text-lime-400 font-semibold">Tamy</span> I designed a
                <span className="text-lime-400 font-semibold"> queue-backed ingestion architecture</span> that reliably absorbs high-volume
                financial data from clients doing <span className="text-lime-400 font-semibold">1M+ BRL/month</span> each — with idempotency,
                retries and dead-letter recovery baked in — then feeds a <span className="text-lime-400 font-semibold">RAG</span> assistant that
                answers over WhatsApp.
              </p>

              <p className="mb-6 text-gray-300">
                Across <span className="text-lime-400 font-semibold">Tamy, iBolt, Aploar and ABDConst</span> I've shipped
                <span className="text-lime-400 font-semibold"> banking &amp; PDV integrations</span>, modernized legacy infra, and led
                architectural calls approved directly by C-level. Hands-on with
                <span className="text-lime-400 font-semibold"> GCP, Kubernetes, Docker, RabbitMQ, LangChain and LangSmith</span>, on a
                backbone of Node, Go, Python and Java.
              </p>

              <div className="flex items-center mb-6 bg-gray-900/50 p-3 border border-lime-900/30 rounded-sm">
                <Music className="h-5 w-5 mr-3 text-[#a4c639]" />
                <span className="text-gray-300">
                  Passionate about <span className="text-lime-400 font-semibold">EXTREME</span> music generes and bringing
                  that energy into my creative work
                </span>
              </div>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="transition-all duration-300 hover:scale-105 border-lime-900/50 hover:bg-lime-900/30 hover:text-lime-300"
                >
                  <a href="victor_soffi_curriculo.pdf" download>
                    <FileText className="mr-2 h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
                <Button
                  asChild
                  className="transition-all duration-300 hover:scale-105 bg-[#a4c639]/70 hover:bg-[#a4c639] text-gray-900 font-medium"
                >
                  <a href="#contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Me
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="bg-gradient-to-b from-black to-[#0c1707] text-gray-200 py-16 border-t border-lime-900/30 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="absolute inset-0 bg-[url('/logoc1.png?height=500&width=1000')] bg-no-repeat bg-center opacity-15"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-mono-tech text-xs tracking-[0.3em] text-lime-500/80 mb-3">
              // OPEN A CHANNEL
            </div>
            <h2 className="text-3xl md:text-4xl font-bold acid-glow tracking-wider">
              GET IN TOUCH
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.p
              className="mb-8 text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Interested in collaborating or have questions about my projects? Feel free to reach out!
            </motion.p>

            <motion.div
              className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=victorsoffi@gmail.com&su=Assunto&body=Mensagem"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-sm border border-lime-900/50 hover:bg-lime-900/20 transition-all duration-300 hover:scale-105"
                variants={cardVariants}
              >
                <Mail className="h-8 w-8 mb-2 text-[#a4c639]" />
                <span className="font-medium text-gray-200">Email Me</span>
                <span className="text-sm text-gray-400">victorsoffi@gmail.com</span>
              </motion.a>

              <motion.a
                href="https://github.com/Kuroshi7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-sm border border-lime-900/50 hover:bg-lime-900/20 transition-all duration-300 hover:scale-105"
                variants={cardVariants}
              >
                <Github className="h-8 w-8 mb-2 text-[#a4c639]" />
                <span className="font-medium text-gray-200">GitHub</span>
                <span className="text-sm text-gray-400">@Kuroshi7</span>
              </motion.a>
              <motion.a
                href="https://wa.me/41988887251"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-sm border border-lime-900/50 hover:bg-lime-900/20 transition-all duration-300 hover:scale-105"
                variants={cardVariants}
              >
                <Phone className="h-8 w-8 mb-2 text-[#a4c639]" />
                <span className="font-medium text-gray-200">WhatsApp</span>
                <span className="text-sm text-gray-400">Send me a message</span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.section>

    </>
  )
}
