import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import type { ContactSettings } from '../types/portfolio';

interface FooterProps {
  contactSettings: ContactSettings;
}

export function Footer({ contactSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#040507] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 border-b border-white/[0.08] pb-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-lg font-bold tracking-wide text-white">
              OLUWASEGUN EMMANUEL
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wider text-blue-400">
              AI WEB DEVELOPER
            </p>
            <p className="mt-2 text-sm text-slate-300">
              “I Don't Just Build Websites. I Build Digital Experiences.”
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${contactSettings.email}`}
              aria-label="Email Oluwasegun Emmanuel"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0B0E16] text-slate-300 transition-colors hover:border-blue-500/50 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href={contactSettings.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0B0E16] text-slate-300 transition-colors hover:border-blue-500/50 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={contactSettings.linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0B0E16] text-slate-300 transition-colors hover:border-blue-500/50 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={contactSettings.githubHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0B0E16] text-slate-300 transition-colors hover:border-blue-500/50 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>&copy; {currentYear} Oluwasegun Emmanuel. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#skills" className="hover:text-white transition-colors">
              Skills
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              Projects
            </a>
            <a href="#services" className="hover:text-white transition-colors">
              Services
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
