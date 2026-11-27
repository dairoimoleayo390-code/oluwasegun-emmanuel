import { ArrowRight, Code2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { HERO_AVATAR_URL } from '../data/portfolioContent';
import { TechBackground } from './TechBackground';

interface HeroSectionProps {
  projectCount: number;
}

export function HeroSection({ projectCount }: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/[0.08] bg-[#050508]"
    >
      <TechBackground />

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-18 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Typographic Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-7"
          >
            <p className="text-sm font-semibold tracking-wide text-blue-400">
              AI Web Developer
            </p>

            <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
              Oluwasegun Emmanuel
            </h1>

            <p className="mt-5 max-w-2xl text-xl font-medium leading-snug text-blue-200/95 sm:text-2xl">
              “I Don't Just Build Websites. I Build Digital Experiences.”
            </p>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              Designing and engineering high-converting, responsive websites and custom web
              applications by uniting modern software architecture with AI-assisted development
              workflows.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-blue-500 electric-glow whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>View My Projects</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href="#contact"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-blue-500/40 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-md transition-all duration-150 hover:border-blue-400 hover:bg-blue-600/15 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Hire Me
              </a>
            </div>
          </motion.div>

          {/* Right Portrait Showcase Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative h-full min-h-[360px] overflow-hidden rounded-2xl border border-blue-500/30 bg-[#0B0E16] shadow-2xl lg:min-h-[440px]">
              {/* Subtle top-right electric light sheen */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 z-10 h-44 w-44 rounded-full bg-blue-600/20 blur-3xl"
                aria-hidden="true"
              />

              {!imageError ? (
                <img
                  src={HERO_AVATAR_URL}
                  alt="Studio portrait of Oluwasegun Emmanuel, AI Web Developer"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full min-h-[360px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0A0F1E] via-[#070B14] to-[#050508] p-8 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-600/10 text-blue-400">
                    <Code2 className="h-10 w-10" aria-hidden="true" />
                  </div>
                  <p className="font-display mt-4 text-lg font-semibold text-white">
                    Oluwasegun Emmanuel
                  </p>
                  <p className="mt-1 text-sm text-slate-400">AI Web Developer</p>
                </div>
              )}

              {/* Bottom caption scrim */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent p-5">
                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3.5 text-xs text-slate-300">
                  <span className="font-medium text-white">Oluwasegun Emmanuel</span>
                  <span className="flex items-center gap-1.5 text-blue-300">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>AI Web Engineering</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Summary Strip Below Hero Split */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-8 sm:grid-cols-4 sm:gap-6">
          <div>
            <p className="font-mono text-2xl font-medium text-white tabular-nums sm:text-3xl">
              {projectCount}
            </p>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Showcase Blueprints Ready
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-blue-400 tabular-nums sm:text-3xl">
              10
            </p>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Core Engineering Disciplines
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-white tabular-nums sm:text-3xl">
              08
            </p>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Specialized Web Services
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-blue-400 tabular-nums sm:text-3xl">
              100%
            </p>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Responsive Across Devices
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
