import { Github, Mail, Linkedin, Phone } from "lucide-react"

export default function SiteFooter() {
  return (
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
