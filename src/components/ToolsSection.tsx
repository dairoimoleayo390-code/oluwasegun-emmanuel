import { Cpu, HeartHandshake, MessageSquareCode, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { TOOLS_LIST } from '../data/portfolioContent';

function getToolIcon(id: string) {
  switch (id) {
    case 'lovable':
      return HeartHandshake;
    case 'bolt':
      return Zap;
    case 'chatgpt':
      return MessageSquareCode;
    case 'google-ai-studio':
      return Cpu;
    default:
      return Cpu;
  }
}

export function ToolsSection() {
  return (
    <section id="tools" className="border-b border-white/[0.08] bg-[#07090F] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-blue-400">My Development Tools</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            Modern AI platforms integrated into a disciplined engineering workflow.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS_LIST.map((tool, index) => {
            const Icon = getToolIcon(tool.id);
            return (
              <motion.article
                key={tool.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-2xl border border-white/[0.08] bg-[#0B0E16]/95 p-6 backdrop-blur-md electric-border-hover"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-600/15 text-blue-400">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3 className="font-display mt-4 text-lg font-bold text-white">
                  {tool.name}
                </h3>

                <p className="mt-1 text-xs font-medium text-blue-400">{tool.role}</p>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {tool.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
