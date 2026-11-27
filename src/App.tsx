import { useCallback, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { ManageProjectsModal } from './components/ManageProjectsModal';
import { Navbar } from './components/Navbar';
import { ProjectModal } from './components/ProjectModal';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesSection } from './components/ServicesSection';
import { SkillsSection } from './components/SkillsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ToolsSection } from './components/ToolsSection';
import { WhyWorkWithMeSection } from './components/WhyWorkWithMeSection';
import { DEFAULT_PROJECTS } from './data/defaultProjects';
import { CONTACT_PLACEHOLDERS } from './data/portfolioContent';
import type { ContactSettings, Project, ProjectInput } from './types/portfolio';

const LOCAL_PROJECTS_KEY = 'oe_portfolio_projects';
const LOCAL_SETTINGS_KEY = 'oe_portfolio_settings';

function readLocalProjects(): Project[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore storage read errors
  }
  return DEFAULT_PROJECTS;
}

function writeLocalProjects(items: Project[]) {
  try {
    window.localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage write errors
  }
}

function readLocalSettings(): ContactSettings {
  try {
    const raw = window.localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (raw) {
      return { ...CONTACT_PLACEHOLDERS, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore storage read errors
  }
  return CONTACT_PLACEHOLDERS;
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [manageTab, setManageTab] = useState<'projects' | 'inquiries' | 'settings'>('projects');
  const [prefilledSubject, setPrefilledSubject] = useState('');
  const [contactSettings, setContactSettings] = useState<ContactSettings>(CONTACT_PLACEHOLDERS);

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    setProjectsError(null);
    try {
      const response = await fetch('/api/projects');
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        setProjects(readLocalProjects());
        return;
      }
      const data = await response.json();
      setProjects(Array.isArray(data.projects) ? data.projects : DEFAULT_PROJECTS);
    } catch {
      setProjects(readLocalProjects());
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings');
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.settings) {
          setContactSettings(data.settings);
          return;
        }
      }
    } catch {
      // Fallback to localStorage/defaults on static hosting
    }
    setContactSettings(readLocalSettings());
  }, []);

  useEffect(() => {
    loadProjects();
    loadSettings();
  }, [loadProjects, loadSettings]);

  const handleCreateProject = async (payload: ProjectInput) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to add project.');
        }
        await loadProjects();
        return;
      }
    } catch (err) {
      if (err instanceof Error && err.message !== 'Failed to fetch') {
        throw err;
      }
    }

    // Static hosting fallback (localStorage)
    const now = new Date().toISOString();
    const nextId = projects.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const created: Project = {
      id: nextId,
      title: payload.title,
      category: payload.category,
      isDemo: payload.isDemo,
      summary: payload.summary,
      description: payload.description,
      technologies: payload.technologies,
      imageUrl: payload.imageUrl,
      liveUrl: payload.liveUrl || '',
      highlights: payload.highlights,
      featured: Boolean(payload.featured),
      createdAt: now,
      updatedAt: now,
    };
    const nextList = [created, ...projects];
    setProjects(nextList);
    writeLocalProjects(nextList);
  };

  const handleUpdateProject = async (id: number, payload: ProjectInput) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to update project.');
        }
        await loadProjects();
        return;
      }
    } catch (err) {
      if (err instanceof Error && err.message !== 'Failed to fetch') {
        throw err;
      }
    }

    const now = new Date().toISOString();
    const nextList = projects.map((p) =>
      p.id === id
        ? {
            ...p,
            ...payload,
            liveUrl: payload.liveUrl || '',
            featured: Boolean(payload.featured),
            updatedAt: now,
          }
        : p
    );
    setProjects(nextList);
    writeLocalProjects(nextList);
  };

  const handleDeleteProject = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete project.');
        }
        await loadProjects();
        return;
      }
    } catch (err) {
      if (err instanceof Error && err.message !== 'Failed to fetch') {
        throw err;
      }
    }

    const nextList = projects.filter((p) => p.id !== id);
    setProjects(nextList);
    writeLocalProjects(nextList);
  };

  const handleUpdateContactSettings = async (payload: {
    email: string;
    whatsappDisplay: string;
    linkedinLabel: string;
    githubHref: string;
  }) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to save contact details.');
        }
        if (data.settings) {
          setContactSettings(data.settings);
        }
        return;
      }
    } catch (err) {
      if (err instanceof Error && err.message !== 'Failed to fetch') {
        throw err;
      }
    }

    const rawDigits = payload.whatsappDisplay.replace(/[^0-9]/g, '');
    const intlDigits =
      rawDigits.length === 11 && rawDigits.startsWith('0')
        ? `234${rawDigits.slice(1)}`
        : rawDigits;
    const cleanLinkedin = payload.linkedinLabel.replace(/^https?:\/\//i, '');
    const nextSettings: ContactSettings = {
      email: payload.email,
      whatsappDisplay: payload.whatsappDisplay,
      whatsappHref: intlDigits ? `https://wa.me/${intlDigits}` : 'https://wa.me/',
      linkedinLabel: cleanLinkedin,
      linkedinHref: `https://${cleanLinkedin}`,
      githubHref: payload.githubHref || 'https://github.com/dairoimoleayo390-code',
    };
    setContactSettings(nextSettings);
    try {
      window.localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(nextSettings));
    } catch {
      // Ignore storage write errors
    }
  };

  const scrollToContactWithSubject = (subjectText: string) => {
    setPrefilledSubject(subjectText);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100">
      <Navbar />

      <main>
        <HeroSection projectCount={projects.length || 6} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection
          projects={projects}
          loading={loadingProjects}
          error={projectsError}
          onRetry={loadProjects}
          onSelectProject={setSelectedProject}
          onOpenManage={() => {
            setManageTab('projects');
            setManageOpen(true);
          }}
        />
        <ServicesSection
          onRequestService={(serviceTitle) =>
            scrollToContactWithSubject(`Inquiry: ${serviceTitle}`)
          }
        />
        <ToolsSection />
        <WhyWorkWithMeSection />
        <TestimonialsSection />
        <ContactSection
          prefilledSubject={prefilledSubject}
          contactSettings={contactSettings}
          onEditSettings={() => {
            setManageTab('settings');
            setManageOpen(true);
          }}
        />
      </main>

      <Footer contactSettings={contactSettings} />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onRequestSimilar={(projectTitle) =>
          scrollToContactWithSubject(`Similar Build Inquiry: ${projectTitle}`)
        }
      />

      <ManageProjectsModal
        open={manageOpen}
        initialTab={manageTab}
        projects={projects}
        contactSettings={contactSettings}
        onClose={() => setManageOpen(false)}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onUpdateContactSettings={handleUpdateContactSettings}
      />
    </div>
  );
}
