"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import CryptoTicker from "@/components/CryptoTicker"
import IpInfo from "@/components/IpInfo"

export default function SiteHeader() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="relative bg-gradient-to-b from-black to-[#0c1707] text-gray-200 py-20 border-b border-lime-900/30"
    >
      <div className="absolute inset-0 bg-[url('/logoc1.png?height=500&width=1000')] bg-no-repeat bg-center lg:bg-right bg-[length:200%] lg:bg-[length:30%] opacity-30"></div>
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
              Backend-heavy developer with strong infrastructure and DevOps experience.
              Specialized in JavaScript, Go, Python, Java — with hands-on work in cloud architecture, data pipelines, and AI-powered systems. Aspiring Software Architect.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col md:flex-row gap-4 mt-6 md:items-center"
            >
              <div className="flex gap-4">
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
                  <a href="/#contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </a>
                </Button>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4">
                <IpInfo />
              </div>
            </motion.div>
            <div className="mt-6">
              <CryptoTicker />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
