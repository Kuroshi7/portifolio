import Image from "next/image"
import { Github, Mail, Linkedin, Phone } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="relative bg-black text-gray-300 py-12 border-t border-lime-900/30 overflow-hidden">
      <div className="absolute inset-0 grid-bg-fine mask-fade opacity-30 pointer-events-none" />
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* brand signature */}
        <Image
          src="/stanislauski.png"
          alt="Stanislauski"
          width={1575}
          height={999}
          className="w-full max-w-[300px] h-auto mx-auto mb-6 opacity-60 drop-shadow-[0_0_20px_rgba(164,198,57,0.2)]"
        />
        <p className="font-mono-tech text-sm text-gray-500">© {new Date().getFullYear()} Victor Soffi · Stanislauski. All rights reserved.</p>
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
          <a
            href="https://www.linkedin.com/in/victor-soffi-web-dev/"
            className="text-gray-500 hover:text-[#a4c639] transition-colors duration-300"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://wa.me/41988887251"
            className="text-gray-500 hover:text-[#a4c639] transition-colors duration-300"
          >
            <Phone className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
