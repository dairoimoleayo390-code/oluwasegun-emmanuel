import { Quote } from 'lucide-react';
import { TESTIMONIAL_PLACEHOLDERS } from '../data/portfolioContent';

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-b border-white/[0.08] bg-[#07090F] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-400">Testimonials</p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
              Client reviews and partnership feedback.
            </h2>
          </div>
          <p className="text-xs font-medium text-slate-400">
            Placeholder slots reserved for verified client reviews
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIAL_PLACEHOLDERS.map((item) => (
            <article
              key={item.slot}
              className="flex flex-col justify-between rounded-2xl border border-dashed border-white/[0.14] bg-[#0B0E16]/70 p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-blue-400">
                  <span className="font-medium">{item.slot}</span>
                  <Quote className="h-4 w-4 text-blue-500/60" aria-hidden="true" />
                </div>

                <p className="mt-4 text-sm italic leading-relaxed text-slate-300">
                  “{item.quotePlaceholder}”
                </p>
              </div>

              <div className="mt-6 border-t border-white/[0.08] pt-4">
                <p className="text-sm font-semibold text-white">{item.clientPlaceholder}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {item.rolePlaceholder} · {item.projectType}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
