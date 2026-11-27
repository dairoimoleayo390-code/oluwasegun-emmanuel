import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SERVICES_LIST } from '../data/portfolioContent';

interface ServicesSectionProps {
  onRequestService: (serviceTitle: string) => void;
}

export function ServicesSection({ onRequestService }: ServicesSectionProps) {
  return (
    <section id="services" className="border-b border-white/[0.08] bg-[#050508] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-blue-400">My Services</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            Tailored web engineering services built for growth and longevity.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES_LIST.map((service, index) => (
            <motion.article
              key={service.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.03, 0.24),
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#0B0E16] p-6 electric-border-hover"
            >
              <span className="font-mono text-xs font-medium text-blue-400 tabular-nums">
                {service.number}.
              </span>

              <h3 className="font-display mt-3 text-lg font-bold leading-snug text-white">
                {service.title}
              </h3>

              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-400">
                {service.description}
              </p>

              <p className="mt-4 border-t border-white/[0.06] pt-3.5 text-xs text-slate-400">
                {service.deliverables.join(' · ')}
              </p>

              <button
                type="button"
                onClick={() => onRequestService(service.title)}
                className="mt-5 inline-flex min-h-[40px] items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-blue-500/50 hover:bg-blue-600/15 hover:text-white whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>Request Service</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
