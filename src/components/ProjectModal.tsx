import { ArrowRight, CheckCircle2, ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';
import { resolveAssetUrl } from '../data/defaultProjects';
import type { Project } from '../types/portfolio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onRequestSimilar: (projectTitle: string) => void;
}

export function ProjectModal({ project, onClose, onRequestSimilar }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-blue-500/30 bg-[#0B0E16] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project preview"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-black/70 text-slate-200 backdrop-blur-md transition-colors hover:border-blue-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-white/[0.08] bg-[#06080E]">
          {project.imageUrl ? (
            <img
              src={resolveAssetUrl(project.imageUrl)}
              alt={`${project.title} full presentation mockup`}
              referrerPolicy="no-referrer"
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-[#090D18] text-sm text-slate-400">
              Project Preview Unavailable
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-400">
            <span>{project.isDemo ? 'Demonstration Project' : 'Client Project'}</span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span className="text-slate-300">{project.category}</span>
          </div>

          <h3 id="project-modal-title" className="font-display mt-2 text-2xl font-bold text-white sm:text-3xl">
            {project.title}
          </h3>

          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            {project.description}
          </p>

          {project.highlights.length > 0 && (
            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <h4 className="text-xs font-semibold tracking-wide text-blue-400">
                Key Architecture &amp; Features
              </h4>
              <ul className="mt-3 space-y-2.5">
                {project.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-blue-400"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <h4 className="text-xs font-semibold tracking-wide text-slate-400">
              Technologies Used
            </h4>
            <p className="mt-2 text-sm font-medium text-slate-200">
              {project.technologies.join(' · ')}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-white/[0.08] pt-5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-blue-400 hover:text-white whitespace-nowrap"
              >
                <span>Open Live Link</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                onRequestSimilar(project.title);
                onClose();
              }}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 electric-glow whitespace-nowrap"
            >
              <span>Request a Similar Website</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
