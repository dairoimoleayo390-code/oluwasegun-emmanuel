import { ArrowUpRight, FolderKanban, Layers, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { resolveAssetUrl } from '../data/defaultProjects';
import type { Project } from '../types/portfolio';

interface ProjectsSectionProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectProject: (project: Project) => void;
  onOpenManage: () => void;
}

function ProjectThumbnail({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);

  if (!project.imageUrl || failed) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center bg-gradient-to-br from-[#0D1426] via-[#090D18] to-[#05070C] p-6 text-center">
        <Layers className="h-8 w-8 text-blue-400/80" aria-hidden="true" />
        <p className="font-display mt-3 text-sm font-semibold text-slate-200">
          {project.category} Concept
        </p>
        <p className="mt-1 text-xs text-slate-400">Mockup Preview</p>
      </div>
    );
  }

  return (
    <img
      src={resolveAssetUrl(project.imageUrl)}
      alt={`${project.title} website mockup preview`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      loading="lazy"
    />
  );
}

export function ProjectsSection({
  projects,
  loading,
  error,
  onRetry,
  onSelectProject,
  onOpenManage,
}: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return ['All', ...unique];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="border-b border-white/[0.08] bg-[#07090F] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-400">My Projects</p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
              Selected web concepts across commerce, enterprise, and community.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Demonstration blueprints below illustrate production-ready layouts, user flows, and
              technical architecture across key industries.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenManage}
            className="inline-flex min-h-[40px] items-center justify-center gap-2 self-start rounded-lg border border-blue-500/35 bg-blue-600/10 px-4 py-2 text-xs font-semibold text-blue-300 transition-colors hover:border-blue-400 hover:bg-blue-600/20 hover:text-white whitespace-nowrap shrink-0 lg:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>Manage Projects</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="mt-8 flex flex-wrap items-center gap-1.5 border-b border-white/[0.08] pb-4"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={`min-h-[36px] rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[380px] animate-pulse rounded-2xl border border-white/[0.08] bg-[#0B0E16]"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center">
            <p className="text-sm text-red-200">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex min-h-[40px] items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
            >
              Reload Projects
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0B0E16] p-10 text-center">
            <FolderKanban className="mx-auto h-9 w-9 text-blue-400" aria-hidden="true" />
            <p className="font-display mt-3 text-lg font-semibold text-white">
              No projects in this category yet
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Switch filters or add a new project using the Manage Projects studio.
            </p>
          </div>
        )}

        {/* Project Gallery Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index * 0.04, 0.24),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0E16] electric-border-hover"
              >
                <div className="relative overflow-hidden border-b border-white/[0.06] bg-[#06080E]">
                  <ProjectThumbnail project={project} />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
                    <span>{project.isDemo ? 'Demonstration Project' : 'Client Project'}</span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="text-slate-300">{project.category}</span>
                  </div>

                  <h3 className="font-display mt-2.5 text-lg font-bold leading-snug text-white">
                    {project.title}
                  </h3>

                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-400">
                    {project.summary}
                  </p>

                  {/* Unboxed technology list */}
                  <p className="mt-4 border-t border-white/[0.06] pt-3.5 text-xs text-slate-400">
                    {project.technologies.join(' · ')}
                  </p>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-blue-500/35 bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-300 transition-all duration-150 hover:border-blue-400 hover:bg-blue-600 hover:text-white whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      <span>View Project</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
