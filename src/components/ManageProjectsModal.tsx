import { Mail, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { ContactInquiry, ContactSettings, Project, ProjectInput } from '../types/portfolio';

interface ManageProjectsModalProps {
  open: boolean;
  initialTab?: 'projects' | 'inquiries' | 'settings';
  projects: Project[];
  contactSettings: ContactSettings;
  onClose: () => void;
  onCreateProject: (payload: ProjectInput) => Promise<void>;
  onUpdateProject: (id: number, payload: ProjectInput) => Promise<void>;
  onDeleteProject: (id: number) => Promise<void>;
  onUpdateContactSettings: (payload: {
    email: string;
    whatsappDisplay: string;
    linkedinLabel: string;
    githubHref: string;
  }) => Promise<void>;
}

const DEFAULT_FORM_STATE = {
  title: '',
  category: 'Business',
  isDemo: true,
  summary: '',
  description: '',
  technologiesText: 'React, TypeScript, Tailwind CSS',
  imageUrl: '/src/assets/images/project_business_mockup_1795774383943.jpg',
  liveUrl: '',
  highlightsText: 'Responsive mobile-first layout\nSEO-structured architecture\nFast production deployment',
  featured: false,
};

const PRESET_MOCKUPS = [
  { label: 'E-commerce Mockup', value: '/src/assets/images/project_ecommerce_mockup_1795774382945.jpg' },
  { label: 'Business Mockup', value: '/src/assets/images/project_business_mockup_1795774383943.jpg' },
  { label: 'School Mockup', value: '/src/assets/images/project_school_mockup_1795774384077.jpg' },
  { label: 'Church Mockup', value: '/src/assets/images/project_church_mockup_1795774385059.jpg' },
  { label: 'Restaurant Mockup', value: '/src/assets/images/project_restaurant_mockup_1795774385850.jpg' },
  { label: 'Portfolio Mockup', value: '/src/assets/images/project_portfolio_mockup_1795774385371.jpg' },
];

export function ManageProjectsModal({
  open,
  initialTab = 'projects',
  projects,
  contactSettings,
  onClose,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onUpdateContactSettings,
}: ManageProjectsModalProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'inquiries' | 'settings'>(initialTab);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [settingsForm, setSettingsForm] = useState({
    email: contactSettings.email,
    whatsappDisplay: contactSettings.whatsappDisplay,
    linkedinLabel: contactSettings.linkedinLabel,
    githubHref: contactSettings.githubHref,
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      setSettingsForm({
        email: contactSettings.email,
        whatsappDisplay: contactSettings.whatsappDisplay,
        linkedinLabel: contactSettings.linkedinLabel,
        githubHref: contactSettings.githubHref,
      });
      setFeedback(null);
      setErrorMsg(null);
    }
  }, [open, initialTab, contactSettings]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || activeTab !== 'inquiries') return;
    let active = true;
    setLoadingInquiries(true);
    fetch('/api/inquiries')
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data.inquiries)) {
          setInquiries(data.inquiries);
        }
      })
      .catch(() => {
        // Ignore silent fetch error in viewer
      })
      .finally(() => {
        if (active) setLoadingInquiries(false);
      });
    return () => {
      active = false;
    };
  }, [open, activeTab]);

  if (!open) return null;

  const startCreate = () => {
    setEditingId(null);
    setForm(DEFAULT_FORM_STATE);
    setFeedback(null);
    setErrorMsg(null);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      isDemo: project.isDemo,
      summary: project.summary,
      description: project.description,
      technologiesText: project.technologies.join(', '),
      imageUrl: project.imageUrl,
      liveUrl: project.liveUrl,
      highlightsText: project.highlights.join('\n'),
      featured: project.featured,
    });
    setFeedback(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    setErrorMsg(null);

    const payload: ProjectInput = {
      title: form.title.trim(),
      category: form.category.trim(),
      isDemo: form.isDemo,
      summary: form.summary.trim(),
      description: form.description.trim(),
      technologies: form.technologiesText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrl: form.imageUrl.trim(),
      liveUrl: form.liveUrl.trim(),
      highlights: form.highlightsText
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
      featured: form.featured,
    };

    try {
      if (editingId !== null) {
        await onUpdateProject(editingId, payload);
        setFeedback('Project updated in database.');
      } else {
        await onCreateProject(payload);
        setFeedback('New project saved to database.');
        setForm(DEFAULT_FORM_STATE);
      }
      setEditingId(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setSaving(true);
    setErrorMsg(null);
    setFeedback(null);
    try {
      await onDeleteProject(id);
      if (editingId === id) {
        startCreate();
      }
      setFeedback('Project deleted.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to delete project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-studio-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-blue-500/30 bg-[#0B0E16] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-6 py-4">
          <div>
            <h3 id="manage-studio-title" className="font-display text-lg font-bold text-white">
              Portfolio Content Manager
            </h3>
            <p className="text-xs text-slate-400">
              Add or edit portfolio projects and inspect saved contact inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#06080E] p-1">
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Projects ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Inquiries
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Contact Details
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close manager"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:border-blue-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'projects' ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Project List */}
              <div className="space-y-3 lg:col-span-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold tracking-wide text-slate-400">
                    Existing Projects
                  </h4>
                  <button
                    type="button"
                    onClick={startCreate}
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600/15 px-2.5 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-600 hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>New Project</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`rounded-xl border p-3.5 transition-colors ${
                        editingId === project.id
                          ? 'border-blue-500 bg-blue-600/10'
                          : 'border-white/[0.08] bg-[#07090F]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {project.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {project.isDemo ? 'Demo' : 'Live'} · {project.category}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(project)}
                            aria-label={`Edit ${project.title}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-slate-300 hover:border-blue-400 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(project.id)}
                            aria-label={`Delete ${project.title}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-slate-400 hover:border-red-500/50 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add / Edit Form */}
              <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-7">
                <h4 className="text-sm font-semibold text-white">
                  {editingId !== null ? 'Edit Selected Project' : 'Add New Project'}
                </h4>

                {feedback && (
                  <div className="rounded-lg border border-blue-500/40 bg-blue-950/30 px-4 py-2.5 text-xs font-medium text-blue-200">
                    {feedback}
                  </div>
                )}

                {errorMsg && (
                  <div className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-2.5 text-xs font-medium text-red-200">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g., Horizon Realty Portal"
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="E-commerce">E-commerce</option>
                      <option value="Business">Business</option>
                      <option value="School">School</option>
                      <option value="Church">Church</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Web App">Web App</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">Short Summary</label>
                  <input
                    type="text"
                    required
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="Concise 1-2 line summary shown on the gallery card"
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Full Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Detailed project overview shown when clicking View Project"
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.technologiesText}
                      onChange={(e) => setForm({ ...form, technologiesText: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Mockup Image Preset or Path
                    </label>
                    <select
                      value={
                        PRESET_MOCKUPS.some((m) => m.value === form.imageUrl)
                          ? form.imageUrl
                          : 'custom'
                      }
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setForm({ ...form, imageUrl: e.target.value });
                        }
                      }}
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      {PRESET_MOCKUPS.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                      <option value="custom">Custom URL</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Image URL / Asset Path
                    </label>
                    <input
                      type="text"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      placeholder="/src/assets/images/..."
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Live Project URL (optional)
                    </label>
                    <input
                      type="url"
                      value={form.liveUrl}
                      onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Key Highlights (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={form.highlightsText}
                    onChange={(e) => setForm({ ...form, highlightsText: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.isDemo}
                      onChange={(e) => setForm({ ...form, isDemo: e.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-[#06080E] text-blue-600 focus:ring-blue-500"
                    />
                    <span>Label as Demonstration Project</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="h-4 w-4 rounded border-white/20 bg-[#06080E] text-blue-600 focus:ring-blue-500"
                    />
                    <span>Feature near top</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
                  {editingId !== null && (
                    <button
                      type="button"
                      onClick={startCreate}
                      className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                  >
                    {saving
                      ? 'Saving...'
                      : editingId !== null
                        ? 'Save Project Changes'
                        : 'Add Project'}
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">
                  Submitted Contact Inquiries
                </h4>
                <span className="text-xs text-slate-400">
                  Stored securely in SQLite database
                </span>
              </div>

              {loadingInquiries ? (
                <p className="text-sm text-slate-400">Loading inquiries...</p>
              ) : inquiries.length === 0 ? (
                <div className="rounded-xl border border-white/[0.08] bg-[#07090F] p-8 text-center">
                  <Mail className="mx-auto h-7 w-7 text-blue-400" aria-hidden="true" />
                  <p className="mt-2 text-sm font-medium text-white">No inquiries received yet</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Messages submitted through the Contact form appear here immediately.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="rounded-xl border border-white/[0.08] bg-[#07090F] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white">{inq.subject}</p>
                        <span className="font-mono text-xs text-slate-400 tabular-nums">
                          {inq.createdAt}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-blue-400">
                        {inq.name} · {inq.email}
                      </p>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setFeedback(null);
                setErrorMsg(null);
                try {
                  await onUpdateContactSettings(settingsForm);
                  setFeedback('Contact details saved. Your portfolio now displays the updated information.');
                } catch (err) {
                  setErrorMsg(err instanceof Error ? err.message : 'Unable to save contact details.');
                } finally {
                  setSaving(false);
                }
              }}
              className="mx-auto max-w-xl space-y-5"
            >
              <div>
                <h4 className="text-base font-semibold text-white">
                  Update Your Email &amp; Social Links
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                  Change your Gmail or business email, WhatsApp number, and LinkedIn profile shown
                  across the Contact section and Footer.
                </p>
              </div>

              {feedback && (
                <div className="rounded-lg border border-blue-500/40 bg-blue-950/30 px-4 py-2.5 text-xs font-medium text-blue-200">
                  {feedback}
                </div>
              )}

              {errorMsg && (
                <div className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-2.5 text-xs font-medium text-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Email / Gmail Address
                </label>
                <input
                  type="email"
                  required
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  placeholder="yourname@gmail.com"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsappDisplay}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, whatsappDisplay: e.target.value })
                  }
                  placeholder="+234 800 000 0000"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  LinkedIn Profile URL
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.linkedinLabel}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, linkedinLabel: e.target.value })
                  }
                  placeholder="linkedin.com/in/your-profile"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  GitHub Profile URL
                </label>
                <input
                  type="text"
                  value={settingsForm.githubHref}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, githubHref: e.target.value })
                  }
                  placeholder="https://github.com/yourusername"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#06080E] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end border-t border-white/[0.08] pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Contact Details'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
