import { motion } from 'motion/react';

export function AboutSection() {
  return (
    <section id="about" className="border-b border-white/[0.08] bg-[#07090F] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12"
        >
          <div className="lg:col-span-4">
            <p className="text-sm font-semibold text-blue-400">About Me</p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
              Engineering modern digital experiences with precision and AI speed.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-slate-300 lg:col-span-8">
            <p>
              I am <strong className="font-semibold text-white">Oluwasegun Emmanuel</strong>, an
              AI Web Developer passionate about creating modern websites, scalable web applications,
              and memorable digital experiences. By bridging artificial intelligence tooling with
              clean frontend and backend development, I help businesses, institutions, and founders
              launch digital platforms that feel refined, purposeful, and effortless to use.
            </p>
            <p>
              Every project begins with clarity: understanding your audience, structuring an
              intuitive user journey, and pairing responsive visual design with dependable database
              and deployment architecture. Whether building an online storefront, a corporate
              presence, an academic portal, or a custom web application, my focus remains the same
              — delivering international-grade digital craftsmanship built to perform.
            </p>

            <div className="grid grid-cols-1 gap-4 border-t border-white/[0.08] pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-blue-400">Primary Craft</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  AI-Assisted Web Engineering
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-400">Design Philosophy</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Clarity, Speed &amp; Responsiveness
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-400">Client Focus</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Businesses, Schools &amp; Global Brands
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
