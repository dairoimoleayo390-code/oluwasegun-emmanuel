import { Check, Copy, Linkedin, Mail, MessageCircle, Pencil, Send } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { ContactSettings } from '../types/portfolio';

interface ContactSectionProps {
  prefilledSubject: string;
  contactSettings: ContactSettings;
  onEditSettings: () => void;
}

export function ContactSection({
  prefilledSubject,
  contactSettings,
  onEditSettings,
}: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [botField, setBotField] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledSubject) {
      setSubject(prefilledSubject);
    }
  }, [prefilledSubject]);

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Try Netlify Forms submission when hosted statically on Netlify
        const formBody = new URLSearchParams({
          'form-name': 'contact',
          'bot-field': botField,
          name,
          email,
          subject,
          message,
        }).toString();

        try {
          const netlifyResponse = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody,
          });

          if (netlifyResponse.ok) {
            setStatusMessage(
              'Thank you! Your message has been sent. Oluwasegun Emmanuel will get back to you soon.'
            );
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
            setBotField('');
            return;
          }
        } catch {
          // Fall through to mailto fallback if POST is blocked
        }

        // Static fallback for hosts that disallow POST (e.g., GitHub Pages)
        const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
        const mailBody = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        window.location.href = `mailto:${contactSettings.email}?subject=${mailSubject}&body=${mailBody}`;
        setStatusMessage(
          `Opening your email app to send this inquiry directly to ${contactSettings.email}.`
        );
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to send your message.');
      }

      setStatusMessage(
        data.message || 'Thank you! Your inquiry has been received and stored.'
      );
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="border-b border-white/[0.08] bg-[#050508] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Direct Contact Channels */}
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-blue-400">Contact Me</p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
              Let's build your next digital experience.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              Have a business website, online store, school portal, or custom web application in
              mind? Send a project brief and I will get back to you promptly.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Direct Channels</span>
                <button
                  type="button"
                  onClick={onEditSettings}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Edit Email &amp; Links</span>
                </button>
              </div>

              {/* Email Card */}
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0B0E16] p-4">
                <a
                  href={`mailto:${contactSettings.email}`}
                  className="flex min-w-0 items-center gap-3.5 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-600/10 text-blue-400">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">Email</p>
                    <p className="truncate text-sm font-semibold text-white">
                      {contactSettings.email}
                    </p>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('email', contactSettings.email)}
                  aria-label="Copy email address"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-blue-400 hover:text-white"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* WhatsApp Card */}
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0B0E16] p-4">
                <a
                  href={contactSettings.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-3.5 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-600/10 text-blue-400">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">WhatsApp</p>
                    <p className="truncate font-mono text-sm font-semibold text-white tabular-nums">
                      {contactSettings.whatsappDisplay}
                    </p>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('whatsapp', contactSettings.whatsappDisplay)}
                  aria-label="Copy WhatsApp number"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-blue-400 hover:text-white"
                >
                  {copiedField === 'whatsapp' ? (
                    <Check className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* LinkedIn Card */}
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0B0E16] p-4">
                <a
                  href={contactSettings.linkedinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-3.5 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-600/10 text-blue-400">
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">LinkedIn</p>
                    <p className="truncate text-sm font-semibold text-white">
                      {contactSettings.linkedinLabel}
                    </p>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('linkedin', contactSettings.linkedinHref)}
                  aria-label="Copy LinkedIn profile URL"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-blue-400 hover:text-white"
                >
                  {copiedField === 'linkedin' ? (
                    <Check className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Backend-Connected Contact Form */}
          <div className="lg:col-span-7">
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/[0.08] bg-[#0B0E16]/90 p-6 backdrop-blur-md sm:p-8"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden" aria-hidden="true">
                <label>
                  Don’t fill this out if you’re human:{' '}
                  <input
                    name="bot-field"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                  />
                </label>
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#050508] px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={160}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#050508] px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-300">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  minLength={3}
                  maxLength={180}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Project type or inquiry subject"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#050508] px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="mt-5">
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your goals, timeline, and the website or web app you want to build..."
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#050508] px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
                />
              </div>

              {statusMessage && (
                <div
                  role="status"
                  className="mt-5 rounded-lg border border-blue-500/40 bg-blue-950/35 px-4 py-3 text-sm text-blue-200"
                >
                  {statusMessage}
                </div>
              )}

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-5 rounded-lg border border-red-500/40 bg-red-950/35 px-4 py-3 text-sm text-red-200"
                >
                  {errorMessage}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Messages are delivered directly so I can get back to you promptly.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-blue-500 disabled:opacity-60 electric-glow whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
