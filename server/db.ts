import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import type {
  ContactInquiry,
  ContactSettings,
  Project,
  ProjectInput,
} from '../src/types/portfolio.ts';

const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'portfolio.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    is_demo INTEGER NOT NULL DEFAULT 1,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT NOT NULL DEFAULT '[]',
    image_url TEXT NOT NULL DEFAULT '',
    live_url TEXT NOT NULL DEFAULT '',
    highlights TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    email_sent INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

interface ProjectRow {
  id: number;
  title: string;
  category: string;
  is_demo: number;
  summary: string;
  description: string;
  technologies: string;
  image_url: string;
  live_url: string;
  highlights: string;
  featured: number;
  created_at: string;
  updated_at: string;
}

interface InquiryRow {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  email_sent: number;
  created_at: string;
}

function parseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    isDemo: Boolean(row.is_demo),
    summary: row.summary,
    description: row.description,
    technologies: parseJsonArray(row.technologies),
    imageUrl: row.image_url,
    liveUrl: row.live_url,
    highlights: parseJsonArray(row.highlights),
    featured: Boolean(row.featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInquiryRow(row: InquiryRow): ContactInquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    emailSent: Boolean(row.email_sent),
    createdAt: row.created_at,
  };
}

const seedProjects: ProjectInput[] = [
  {
    title: 'Nouvelle Commerce — Modern E-commerce Storefront',
    category: 'E-commerce',
    isDemo: true,
    summary:
      'High-converting luxury retail storefront with instant product filtering, slide-over cart architecture, and streamlined checkout flow.',
    description:
      'A demonstration e-commerce platform engineered for modern fashion and lifestyle brands. Built with responsive product grids, dynamic variant selection, persistent shopping cart state, and fast server-backed inventory structure.',
    technologies: ['React', 'Tailwind CSS', 'TypeScript', 'Node.js', 'SQLite'],
    imageUrl: '/src/assets/images/project_ecommerce_mockup_1795774382945.jpg',
    liveUrl: '',
    highlights: [
      'Real-time slide-over cart drawer with quantity and subtotal updates',
      'Category filtering, search indexing, and mobile-first product cards',
      'Checkout validation workflow ready for payment gateway integration',
    ],
    featured: true,
  },
  {
    title: 'Nexus Advisory — Corporate Business Platform',
    category: 'Business',
    isDemo: true,
    summary:
      'Authority-driven B2B consulting website designed to convert international enterprise leads with structured service tiers and consultation booking.',
    description:
      'A demonstration corporate business website built for consulting firms and growth-stage companies. Combines sharp executive typography, clear value architecture, case study sections, and an integrated inquiry pipeline.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Express'],
    imageUrl: '/src/assets/images/project_business_mockup_1795774383943.jpg',
    liveUrl: '',
    highlights: [
      'Structured executive landing layout with conversion-focused CTAs',
      'Service capability matrix and interactive consultation request flow',
      'SEO-structured semantic markup and high-contrast accessibility',
    ],
    featured: true,
  },
  {
    title: 'Aristotle Academy — School & Admissions Portal',
    category: 'School',
    isDemo: true,
    summary:
      'Comprehensive educational institution website featuring academic program directories, campus news, and prospective student admissions workflows.',
    description:
      'A demonstration school and academy web platform designed to serve parents, students, and faculty. Organizes academic departments, admissions requirements, calendar events, and portal links in a clear, accessible hierarchy.',
    technologies: ['React', 'Tailwind CSS', 'Database Integration', 'UI/UX Design'],
    imageUrl: '/src/assets/images/project_school_mockup_1795774384077.jpg',
    liveUrl: '',
    highlights: [
      'Organized academic program explorer by faculty and grade level',
      'Dedicated admissions inquiry and prospectus request workflow',
      'Accessible navigation engineered for families across all devices',
    ],
    featured: false,
  },
  {
    title: 'Grace Community — Church & Ministry Hub',
    category: 'Church',
    isDemo: true,
    summary:
      'Welcoming digital sanctuary featuring service schedules, searchable sermon archives, event announcements, and ministry connection forms.',
    description:
      'A demonstration church website crafted to help congregations stay connected during the week. Includes Sunday service timings, media-ready sermon collections, small group sign-ups, and an approachable mobile experience.',
    technologies: ['HTML5', 'Tailwind CSS', 'JavaScript', 'AI-Assisted Dev'],
    imageUrl: '/src/assets/images/project_church_mockup_1795774385059.jpg',
    liveUrl: '',
    highlights: [
      'Clear weekly service schedules and first-time visitor welcome flow',
      'Structured sermon series library with speaker and topic filtering',
      'Integrated prayer request and volunteer ministry contact forms',
    ],
    featured: false,
  },
  {
    title: 'Aurora Dining — Restaurant & Table Reservation Site',
    category: 'Restaurant',
    isDemo: true,
    summary:
      'Atmospheric hospitality website showcasing seasonal tasting menus, chef highlights, and an interactive table reservation request experience.',
    description:
      'A demonstration restaurant and culinary brand website blending rich editorial presentation with practical guest utility. Guests can browse curated menu courses, dietary notes, private dining options, and submit table bookings.',
    technologies: ['React', 'CSS3', 'Responsive Design', 'Node.js'],
    imageUrl: '/src/assets/images/project_restaurant_mockup_1795774385850.jpg',
    liveUrl: '',
    highlights: [
      'Interactive menu navigation across starters, mains, and curated drinks',
      'Streamlined date, time, and party-size table reservation form',
      'Mobile-optimized layout for guests checking directions and hours on the go',
    ],
    featured: false,
  },
  {
    title: 'Developer Showcase — Personal Portfolio Concept',
    category: 'Portfolio',
    isDemo: true,
    summary:
      'Futuristic dark-mode personal brand architecture engineered for software engineers, designers, and technical founders.',
    description:
      'A demonstration personal portfolio system featuring interactive project previews, modular content management, smooth section transitions, and a backend-connected inquiry pipeline for client acquisition.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'SQLite', 'Google AI Studio'],
    imageUrl: '/src/assets/images/project_portfolio_mockup_1795774385371.jpg',
    liveUrl: '',
    highlights: [
      'Modular project gallery backed by persistent database storage',
      'Dark-first visual system with electric-blue interaction accents',
      'End-to-end contact pipeline with validation and instant confirmation',
    ],
    featured: true,
  },
];

function ensureSeeded() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  if (countRow.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO projects (
        title, category, is_demo, summary, description,
        technologies, image_url, live_url, highlights, featured
      ) VALUES (
        @title, @category, @is_demo, @summary, @description,
        @technologies, @image_url, @live_url, @highlights, @featured
      )
    `);
    const insertMany = db.transaction((items: ProjectInput[]) => {
      for (const item of items) {
        insertStmt.run({
          title: item.title,
          category: item.category,
          is_demo: item.isDemo ? 1 : 0,
          summary: item.summary,
          description: item.description,
          technologies: JSON.stringify(item.technologies),
          image_url: item.imageUrl,
          live_url: item.liveUrl ?? '',
          highlights: JSON.stringify(item.highlights),
          featured: item.featured ? 1 : 0,
        });
      }
    });
    insertMany(seedProjects);
  }
}

ensureSeeded();

export function listProjects(): Project[] {
  const rows = db
    .prepare('SELECT * FROM projects ORDER BY featured DESC, id ASC')
    .all() as ProjectRow[];
  return rows.map(mapProjectRow);
}

export function getProjectById(id: number): Project | null {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as ProjectRow | undefined;
  return row ? mapProjectRow(row) : null;
}

export function createProject(input: ProjectInput): Project {
  const stmt = db.prepare(`
    INSERT INTO projects (
      title, category, is_demo, summary, description,
      technologies, image_url, live_url, highlights, featured
    ) VALUES (
      @title, @category, @is_demo, @summary, @description,
      @technologies, @image_url, @live_url, @highlights, @featured
    )
  `);
  const result = stmt.run({
    title: input.title,
    category: input.category,
    is_demo: input.isDemo ? 1 : 0,
    summary: input.summary,
    description: input.description,
    technologies: JSON.stringify(input.technologies),
    image_url: input.imageUrl,
    live_url: input.liveUrl ?? '',
    highlights: JSON.stringify(input.highlights),
    featured: input.featured ? 1 : 0,
  });
  return getProjectById(Number(result.lastInsertRowid))!;
}

export function updateProject(id: number, input: ProjectInput): Project | null {
  const existing = getProjectById(id);
  if (!existing) return null;

  db.prepare(`
    UPDATE projects
    SET title = @title,
        category = @category,
        is_demo = @is_demo,
        summary = @summary,
        description = @description,
        technologies = @technologies,
        image_url = @image_url,
        live_url = @live_url,
        highlights = @highlights,
        featured = @featured,
        updated_at = datetime('now')
    WHERE id = @id
  `).run({
    id,
    title: input.title,
    category: input.category,
    is_demo: input.isDemo ? 1 : 0,
    summary: input.summary,
    description: input.description,
    technologies: JSON.stringify(input.technologies),
    image_url: input.imageUrl,
    live_url: input.liveUrl ?? '',
    highlights: JSON.stringify(input.highlights),
    featured: input.featured ? 1 : 0,
  });

  return getProjectById(id);
}

export function deleteProject(id: number): boolean {
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  return result.changes > 0;
}

export function createInquiry(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  emailSent: boolean;
}): ContactInquiry {
  const result = db
    .prepare(
      `INSERT INTO inquiries (name, email, subject, message, email_sent)
       VALUES (@name, @email, @subject, @message, @email_sent)`
    )
    .run({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      email_sent: data.emailSent ? 1 : 0,
    });

  const row = db
    .prepare('SELECT * FROM inquiries WHERE id = ?')
    .get(Number(result.lastInsertRowid)) as InquiryRow;
  return mapInquiryRow(row);
}

export function listInquiries(): ContactInquiry[] {
  const rows = db
    .prepare('SELECT * FROM inquiries ORDER BY id DESC LIMIT 50')
    .all() as InquiryRow[];
  return rows.map(mapInquiryRow);
}

const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  email: 'emmaoluwasegun100@gmail.com',
  whatsappDisplay: '09165705882',
  whatsappHref: 'https://wa.me/2349165705882',
  linkedinLabel: 'linkedin.com/in/oluwasegun-emmanuel',
  linkedinHref: 'https://linkedin.com/in/oluwasegun-emmanuel',
  githubHref: 'https://github.com',
};

export function getContactSettings(): ContactSettings {
  const row = db
    .prepare('SELECT value FROM site_settings WHERE key = ?')
    .get('contact_settings') as { value: string } | undefined;

  if (!row) {
    return DEFAULT_CONTACT_SETTINGS;
  }

  try {
    const parsed = JSON.parse(row.value) as Partial<ContactSettings>;
    return {
      email: parsed.email || DEFAULT_CONTACT_SETTINGS.email,
      whatsappDisplay: parsed.whatsappDisplay || DEFAULT_CONTACT_SETTINGS.whatsappDisplay,
      whatsappHref: parsed.whatsappHref || DEFAULT_CONTACT_SETTINGS.whatsappHref,
      linkedinLabel: parsed.linkedinLabel || DEFAULT_CONTACT_SETTINGS.linkedinLabel,
      linkedinHref: parsed.linkedinHref || DEFAULT_CONTACT_SETTINGS.linkedinHref,
      githubHref: parsed.githubHref || DEFAULT_CONTACT_SETTINGS.githubHref,
    };
  } catch {
    return DEFAULT_CONTACT_SETTINGS;
  }
}

export function updateContactSettings(settings: ContactSettings): ContactSettings {
  db.prepare(
    `INSERT INTO site_settings (key, value)
     VALUES ('contact_settings', @value)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run({
    value: JSON.stringify(settings),
  });
  return getContactSettings();
}

