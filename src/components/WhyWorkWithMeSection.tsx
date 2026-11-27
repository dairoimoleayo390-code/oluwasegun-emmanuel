import { motion } from 'motion/react';
import { WHY_WORK_WITH_ME } from '../data/portfolioContent';

export function WhyWorkWithMeSection() {
  return (
    <section id="why-me" className="border-b border-white/[0.08] bg-[#050508] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-blue-400">Why Work With Me</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            Built for reliability, visual authority, and measurable client satisfaction.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_WORK_WITH_ME.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.04, 0.2),
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-2xl border border-white/[0.08] bg-[#0B0E16] p-6 electric-border-hover"
            >
              <span className="font-mono text-xs font-medium text-blue-400 tabular-nums">
                {pillar.number}.
              </span>
              <h3 className="font-display mt-3 text-lg font-bold text-white">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
