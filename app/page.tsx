"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Github, ExternalLink, Mail, Linkedin, FileText, Music, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import CryptoTicker from "@/components/CryptoTicker"


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
    language: "Go",
    featured: true,
    categories: ["tools"],
  },
  {
    id: 2,
    name: "PyTranscribe",
    description:
      "Audio transcription tool built with Python that converts speech to text using advanced AI models. Supports multiple languages and formats.",
    image: "/openaiwhisper.jpg?height=300&width=600",
    tags: ["Python", "AI", "Audio","CLI", "Transcription", "Automation"],
    github: "https://github.com/Kuroshi7/PyTranscribe",
    demo: null,
    language: "Python",
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
    language: "Node",
    featured: true,
    categories: ["web"],
  },
  {
    id: 4,
    name: "Javabank",
    description:
      "A banking application simulation built with Java. Features account management, transactions, and a secure authentication system.",
    image: "/connectbank.png?height=300&width=600",
    tags: ["Java", "Banking", "Finance"],
    github: "https://github.com/Kuroshi7/Javabank",
    demo: "https://connectbank.netlify.app/",
    language: "Java",
    featured: true,
    categories: ["web", "mobile"],
  },
  {
    id: 5,
    name: "Banda App",
    description: "Band presentation website, with focus on front-end and a responsive display on smaller screens",
    image: "/bandaapp.png?height=300&width=600",
    tags: ["Mobile", "Music", "React Native"],
    github: "https://github.com/Kuroshi7/bandapp",
    demo: "https://afts.vercel.app",
    language: "JavaScript",
    featured: true,
    categories: ["web", "mobile"],
  },
]

// Skills data
const skills = [
  { name: "Go", level: 50 },
  { name: "Python", level: 55 },
  { name: "JavaScript", level: 65 },
  { name: "Node", level: 75 },
  { name: "React", level: 75 },
  { name: "Frontend Development", level: 65 },
  { name: "Backend Development", level: 75 },
  { name: "SQL", level: 65 },
]

// Animation variants with more aggressive feel
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
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
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  hover: {
    y: -8,
    boxShadow: "0 10px 30px rgba(164, 198, 57, 0.2)",
    transition: { duration: 0.3 },
  },
}

const skillBarVariants = {
  hidden: { width: 0 },
  visible: (level: number) => ({
    width: `${level}%`,
    transition: { duration: 1.2, ease: "easeOut" },
  }),
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

  return <span className={`text-xs px-2 py-1 rounded-sm ${colors[category]}`}>{labels[category]}</span>
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
      Node: "bg-green-700"
    }

    return colors[language] || "bg-gray-600"
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 ">
      {/* Texture overlay */}
      <div className="fixed inset-0 bg-[url('/namebackground3.png?height=500&width=1000')] bg-no-repeat bg-center bg-[length:80%] opacity-10 pointer-events-none z-0"></div>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative bg-gradient-to-b from-black to-[#0c1707] text-gray-200 py-20 border-b border-lime-900/30"
      >
        <div className="absolute inset-0 bg-[url('/logo.png?height=500&width=1000')] bg-no-repeat bg-right bg-[length:30%] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-lime-500 shadow-lg shadow-lime-500/20"
            >
              <Image
                src="/profilepic.jpg?height=160&width=160"
                alt="Profile"
                width={160}
                height={160}
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#a4c639] text-shadow-neon">
                VICTOR SOFFI
              </h1>
              <h2 className="text-xl md:text-2xl opacity-90 mb-4 tracking-wider">SOFTWARE DEVELOPER</h2>
              <p className="text-lg opacity-80 max-w-2xl">
                Passionate developer focused on creating creative, efficient, smart solutions to complex and simple problems.
                Specialized in JavaScript, Go, Python, Java development.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex gap-4 mt-6"
              >
                <Button
                  asChild
                  variant="outline"
                  className="transition-transform hover:scale-105 border-lime-800 hover:bg-lime-900/30 hover:text-lime-300"
                >
                  <a href="https://github.com/Kuroshi7" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="transition-transform hover:scale-105 border-lime-800 hover:bg-lime-900/30 hover:text-lime-300"
                >
                  <a href="#contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </a>
                </Button>
              </motion.div>
              {/* Cripto ticker aqui */}
              <div className="mt-4">
                <CryptoTicker />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="container mx-auto py-16 px-4 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <motion.h2
          className="text-3xl font-bold mb-8 text-center text-[#a4c639] tracking-wider text-shadow-neon"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          FEATURED PROJECTS
        </motion.h2>

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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              key={filter}
            >
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={cardVariants} whileHover="hover">
                  <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 bg-gray-900 border-lime-900/50 hover:border-lime-500">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110 filter grayscale group-hover:grayscale-0"
                      />
                      {/* Category badges */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {project.categories.map((category) => (
                          <CategoryBadge key={category} category={category} />
                        ))}
                      </div>
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    </div>
                    <CardHeader className="border-b border-lime-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-sm ${getLanguageColor(project.language)} mr-2`}></span>
                          <span className="text-sm text-gray-400">{project.language}</span>
                        </div>
                      </div>
                      <CardTitle className="line-clamp-1 text-lime-400 ">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-lime-900/50 bg-black/30 text-gray-300 hover:bg-lime-900/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-lime-900/20 pt-4">
                      <div className="flex gap-2 w-full">
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
                        {project.demo && (
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 bg-lime-900/70 hover:bg-lime-800 text-gray-200 transition-all duration-300"
                            asChild
                          >
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Demo
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

      {/* Skills Section */}
      <motion.section
        id="skills"
        className="bg-gray-950 py-16 border-y border-lime-900/30 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] bg-center opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center text-[#a4c639] tracking-wider text-shadow-neon"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            SKILLS & EXPERTISE
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {skills.map((skill, index) => (
              <motion.div key={index} className="mb-4" variants={fadeIn}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-300">{skill.name}</span>
                  <span className="text-sm text-lime-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-sm h-2.5 border border-lime-900/30">
                  <motion.div
                    className="bg-gradient-to-r from-[#a4c639] to-[#c5e515] h-2.5 rounded-sm"
                    variants={skillBarVariants}
                    custom={skill.level}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

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
          <motion.h2
            className="text-3xl font-bold mb-8 text-center text-[#a4c639] tracking-wider text-shadow-neon"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            ABOUT ME
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square relative rounded-sm overflow-hidden border border-lime-900/50 shadow-lg shadow-lime-500/10">
                <Image
                  src="/footerpic.jpg?height=400&width=400"
                  alt="Profile"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
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
              <h4 className="text-xl text-gray-400 mb-6 tracking-wider">SOFTWARE DEVELOPER</h4>

              <p className="mb-4 text-gray-300">
                I'm a passionate software developer versed in multiple programming languages and frameworks. My
                focus is on creating efficient, scalable, and elegant solutions to complex problems.
              </p>

              <p className="mb-6 text-gray-300">
                Even tho i still have ( <span className="text-lime-400 font-semibold"> and always will have</span> ) a long road of studies ahead of me, i got a strong background in Node, Go, Python, and Java, developing various applications ranging from
                backup tools to AI-powered transcription services and banking applications.
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
        <div className="absolute inset-0 bg-[url('/logo.png?height=500&width=1000')] bg-no-repeat bg-center opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl font-bold mb-8 text-center text-[#a4c639] tracking-wider text-shadow-neon"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            GET IN TOUCH
          </motion.h2>

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
                <span className="text-sm text-gray-400">Clique para conversar</span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-8 border-t border-lime-900/30">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Victor Soffi. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://github.com/Kuroshi7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#a4c639] transition-colors duration-300"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="mailto:victorsoffi@gmail.com"
              className="text-gray-500 hover:text-[#a4c639] transition-colors duration-300"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/victor-soffi-web-dev/" className="text-gray-500 hover:text-[#a4c639] transition-colors duration-300">
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/41988887251"
              className="text-gray-500 hover:text-[#a4c639] transition-colors duration-300">
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
