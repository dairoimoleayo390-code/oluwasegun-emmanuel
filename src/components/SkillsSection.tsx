import {
  Bot,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Globe,
  Layout,
  MonitorSmartphone,
  Palette,
  Server,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { SKILLS_LIST } from '../data/portfolioContent';
import type { SkillItem } from '../types/portfolio';

type SkillFilter = 'All' | SkillItem['category'];

const SKILL_FILTERS: SkillFilter[] = ['All', 'Frontend & UI', 'AI & Architecture', 'Backend & Ops'];

function getSkillIcon(id: string) {
  switch (id) {
    case 'html':
      return FileCode2;
    case 'css':
      return Palette;
    case 'javascript':
      return Code2;
    case 'responsive-design':
      return MonitorSmartphone;
    case 'database-integration':
      return Database;
    case 'ai-assisted-dev':
      return Bot;
    case 'ui-ux-design':
      return Layout;
    case 'website-deployment':
      return Globe;
    case 'frontend-dev':
      return Cpu;
    case 'backend-dev':
      return Server;
    default:
      return Code2;
  }
}

export function SkillsSection() {
  const [activeFilter, setActiveFilter] = useState<SkillFilter>('All');

  const visibleSkills =
    activeFilter === 'All'
      ? SKILLS_LIST
      : SKILLS_LIST.filter((skill) => skill.category === activeFilter);

  return (
    <section id="skills" className="border-b border-white/[0.08] bg-[#050508] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-400">My Skills</p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
              Full-spectrum capabilities from interface craft to deployment.
            </h2>
          </div>

          {/* Interactive Category Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter skills by discipline"
            className="flex flex-wrap items-center gap-1 rounded-xl border border-white/[0.08] bg-[#0B0E16] p-1"
          >
            {SKILL_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter)}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {visibleSkills.map((skill, index) => {
            const Icon = getSkillIcon(skill.id);
            return (
              <motion.article
                key={skill.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.03, 0.25),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group rounded-xl border border-white/[0.08] bg-[#0B0E16]/90 p-5 backdrop-blur-md electric-border-hover"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/25 bg-blue-600/10 text-blue-400 transition-colors group-hover:border-blue-400/50 group-hover:bg-blue-600/20 group-hover:text-blue-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {skill.focusArea}
                  </span>
                </div>

                <h3 className="font-display mt-4 text-base font-semibold text-white">
                  {skill.name}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {skill.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
