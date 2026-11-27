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
import { CONTACT_PLACEHOLDERS } from './data/portfolioContent';
import type { ContactSettings, Project, ProjectInput } from './types/portfolio';

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
      if (!response.ok) {
        throw new Error('Unable to load portfolio projects.');
      }
      const data = await response.json();
      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (err) {
      setProjectsError(
        err instanceof Error ? err.message : 'Unable to load portfolio projects.'
      );
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setContactSettings(data.settings);
        }
      }
    } catch {
      // Fallback to default contact placeholders if settings endpoint is temporarily unavailable
    }
  }, []);

  useEffect(() => {
    loadProjects();
    loadSettings();
  }, [loadProjects, loadSettings]);

  const handleCreateProject = async (payload: ProjectInput) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add project.');
    }
    await loadProjects();
  };

  const handleUpdateProject = async (id: number, payload: ProjectInput) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update project.');
    }
    await loadProjects();
  };

  const handleDeleteProject = async (id: number) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete project.');
    }
    await loadProjects();
  };

  const handleUpdateContactSettings = async (payload: {
    email: string;
    whatsappDisplay: string;
    linkedinLabel: string;
    githubHref: string;
  }) => {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save contact details.');
    }
    if (data.settings) {
      setContactSettings(data.settings);
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
