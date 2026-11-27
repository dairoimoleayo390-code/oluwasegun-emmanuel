import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import {
  createInquiry,
  createProject,
  deleteProject,
  getContactSettings,
  listInquiries,
  listProjects,
  updateContactSettings,
  updateProject,
} from './server/db.ts';
import type { ProjectInput } from './src/types/portfolio.ts';

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/')) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}

function validateProjectPayload(body: unknown): { data?: ProjectInput; error?: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body.' };
  }
  const raw = body as Record<string, unknown>;
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const category = typeof raw.category === 'string' ? raw.category.trim() : '';
  const summary = typeof raw.summary === 'string' ? raw.summary.trim() : '';
  const description = typeof raw.description === 'string' ? raw.description.trim() : '';

  if (title.length < 2 || title.length > 140) {
    return { error: 'Project title must be between 2 and 140 characters.' };
  }
  if (category.length < 2 || category.length > 50) {
    return { error: 'Category must be between 2 and 50 characters.' };
  }
  if (summary.length < 10 || summary.length > 320) {
    return { error: 'Summary must be between 10 and 320 characters.' };
  }
  if (description.length < 10 || description.length > 2000) {
    return { error: 'Description must be between 10 and 2000 characters.' };
  }

  const technologies = Array.isArray(raw.technologies)
    ? raw.technologies
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
        .slice(0, 12)
    : [];

  const highlights = Array.isArray(raw.highlights)
    ? raw.highlights
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
        .slice(0, 8)
    : [];

  const imageUrl =
    typeof raw.imageUrl === 'string' ? sanitizeUrl(raw.imageUrl) : '';
  const liveUrl =
    typeof raw.liveUrl === 'string' ? sanitizeUrl(raw.liveUrl) : '';

  return {
    data: {
      title,
      category,
      isDemo: raw.isDemo !== false,
      summary,
      description,
      technologies,
      imageUrl,
      liveUrl,
      highlights,
      featured: Boolean(raw.featured),
    },
  };
}

async function trySendContactEmail(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const settings = getContactSettings();
  await transporter.sendMail({
    from: `"Portfolio Contact" <${SMTP_USER}>`,
    to: CONTACT_TO_EMAIL || settings.email || SMTP_USER,
    replyTo: payload.email,
    subject: `[Portfolio Inquiry] ${payload.subject}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}`,
  });

  return true;
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
  app.use(express.json({ limit: '1mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Projects CRUD API
  app.get('/api/projects', (_req, res) => {
    try {
      const projects = listProjects();
      res.json({ projects });
    } catch (err) {
      console.error('Failed to list projects:', err);
      res.status(500).json({ error: 'Unable to load projects.' });
    }
  });

  app.post('/api/projects', (req, res) => {
    const validated = validateProjectPayload(req.body);
    if (validated.error || !validated.data) {
      res.status(400).json({ error: validated.error || 'Invalid project payload.' });
      return;
    }
    try {
      const project = createProject(validated.data);
      res.status(201).json({ project });
    } catch (err) {
      console.error('Failed to create project:', err);
      res.status(500).json({ error: 'Unable to create project.' });
    }
  });

  app.put('/api/projects/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid project ID.' });
      return;
    }
    const validated = validateProjectPayload(req.body);
    if (validated.error || !validated.data) {
      res.status(400).json({ error: validated.error || 'Invalid project payload.' });
      return;
    }
    try {
      const project = updateProject(id, validated.data);
      if (!project) {
        res.status(404).json({ error: 'Project not found.' });
        return;
      }
      res.json({ project });
    } catch (err) {
      console.error('Failed to update project:', err);
      res.status(500).json({ error: 'Unable to update project.' });
    }
  });

  app.delete('/api/projects/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid project ID.' });
      return;
    }
    try {
      const removed = deleteProject(id);
      if (!removed) {
        res.status(404).json({ error: 'Project not found.' });
        return;
      }
      res.json({ deleted: true });
    } catch (err) {
      console.error('Failed to delete project:', err);
      res.status(500).json({ error: 'Unable to delete project.' });
    }
  });

  // Site Contact Settings API
  app.get('/api/settings', (_req, res) => {
    try {
      res.json({ settings: getContactSettings() });
    } catch (err) {
      console.error('Failed to load contact settings:', err);
      res.status(500).json({ error: 'Unable to load contact settings.' });
    }
  });

  app.put('/api/settings', (req, res) => {
    const raw = (req.body || {}) as Record<string, unknown>;
    const email = typeof raw.email === 'string' ? raw.email.trim() : '';
    const whatsappDisplay =
      typeof raw.whatsappDisplay === 'string' ? raw.whatsappDisplay.trim() : '';
    const linkedinLabel =
      typeof raw.linkedinLabel === 'string' ? raw.linkedinLabel.trim() : '';
    const githubRaw =
      typeof raw.githubHref === 'string' ? raw.githubHref.trim() : '';

    if (!isValidEmail(email) || email.length > 160) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (whatsappDisplay.length < 5 || whatsappDisplay.length > 40) {
      res.status(400).json({ error: 'Please enter a valid WhatsApp number.' });
      return;
    }
    if (linkedinLabel.length < 3 || linkedinLabel.length > 160) {
      res.status(400).json({ error: 'Please enter a valid LinkedIn handle or URL.' });
      return;
    }

    const rawDigits = whatsappDisplay.replace(/[^0-9]/g, '');
    const intlDigits =
      rawDigits.length === 11 && rawDigits.startsWith('0')
        ? `234${rawDigits.slice(1)}`
        : rawDigits;
    const whatsappHref = intlDigits ? `https://wa.me/${intlDigits}` : 'https://wa.me/';
    const cleanLinkedin = linkedinLabel.replace(/^https?:\/\//i, '');
    const linkedinHref = `https://${cleanLinkedin}`;
    const githubHref = sanitizeUrl(
      githubRaw && !/^https?:\/\//i.test(githubRaw) ? `https://${githubRaw}` : githubRaw
    ) || 'https://github.com';

    try {
      const settings = updateContactSettings({
        email,
        whatsappDisplay,
        whatsappHref,
        linkedinLabel: cleanLinkedin,
        linkedinHref,
        githubHref,
      });
      res.json({ settings });
    } catch (err) {
      console.error('Failed to update contact settings:', err);
      res.status(500).json({ error: 'Unable to update contact settings.' });
    }
  });

  // Contact Inquiry API
  app.get('/api/inquiries', (_req, res) => {
    try {
      const inquiries = listInquiries();
      res.json({ inquiries });
    } catch (err) {
      console.error('Failed to list inquiries:', err);
      res.status(500).json({ error: 'Unable to load inquiries.' });
    }
  });

  app.post('/api/contact', async (req, res) => {
    const raw = (req.body || {}) as Record<string, unknown>;
    const name = typeof raw.name === 'string' ? raw.name.trim() : '';
    const email = typeof raw.email === 'string' ? raw.email.trim() : '';
    const subject = typeof raw.subject === 'string' ? raw.subject.trim() : '';
    const message = typeof raw.message === 'string' ? raw.message.trim() : '';

    if (name.length < 2 || name.length > 120) {
      res.status(400).json({ error: 'Please enter your name (2–120 characters).' });
      return;
    }
    if (!isValidEmail(email) || email.length > 160) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (subject.length < 3 || subject.length > 180) {
      res.status(400).json({ error: 'Please enter a subject (3–180 characters).' });
      return;
    }
    if (message.length < 10 || message.length > 3000) {
      res.status(400).json({ error: 'Please enter a message (at least 10 characters).' });
      return;
    }

    let emailSent = false;
    try {
      emailSent = await trySendContactEmail({ name, email, subject, message });
    } catch (mailErr) {
      console.warn('SMTP email dispatch skipped or failed:', mailErr);
    }

    try {
      const inquiry = createInquiry({ name, email, subject, message, emailSent });
      res.status(201).json({
        inquiry,
        message: emailSent
          ? 'Your message has been delivered and saved.'
          : 'Your message has been saved securely. I will respond shortly.',
      });
    } catch (err) {
      console.error('Failed to store contact inquiry:', err);
      res.status(500).json({ error: 'Unable to submit your message right now.' });
    }
  });

  if (isProduction) {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir, { maxAge: '7d', index: false }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
