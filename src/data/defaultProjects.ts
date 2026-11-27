import type { Project } from '../types/portfolio';

export function resolveAssetUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('/src/assets/')) {
    return `.${url}`;
  }
  return url;
}

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Nouvelle Commerce — Modern E-commerce Storefront',
    category: 'E-commerce',
    isDemo: true,
    summary:
      'High-converting luxury retail storefront with instant product filtering, slide-over cart architecture, and streamlined checkout flow.',
    description:
      'A demonstration e-commerce platform engineered for modern fashion and lifestyle brands. Built with responsive product grids, dynamic variant selection, persistent shopping cart state, and fast server-backed inventory structure.',
    technologies: ['React', 'Tailwind CSS', 'TypeScript', 'Node.js', 'SQLite'],
    imageUrl: 'src/assets/images/project_ecommerce_mockup_1795774382945.jpg',
    liveUrl: '',
    highlights: [
      'Real-time slide-over cart drawer with quantity and subtotal updates',
      'Category filtering, search indexing, and mobile-first product cards',
      'Checkout validation workflow ready for payment gateway integration',
    ],
    featured: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 2,
    title: 'Nexus Advisory — Corporate Business Platform',
    category: 'Business',
    isDemo: true,
    summary:
      'Authority-driven B2B consulting website designed to convert international enterprise leads with structured service tiers and consultation booking.',
    description:
      'A demonstration corporate business website built for consulting firms and growth-stage companies. Combines sharp executive typography, clear value architecture, case study sections, and an integrated inquiry pipeline.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Express'],
    imageUrl: 'src/assets/images/project_business_mockup_1795774383943.jpg',
    liveUrl: '',
    highlights: [
      'Structured executive landing layout with conversion-focused CTAs',
      'Service capability matrix and interactive consultation request flow',
      'SEO-structured semantic markup and high-contrast accessibility',
    ],
    featured: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 3,
    title: 'Aristotle Academy — School & Admissions Portal',
    category: 'School',
    isDemo: true,
    summary:
      'Comprehensive educational institution website featuring academic program directories, campus news, and prospective student admissions workflows.',
    description:
      'A demonstration school and academy web platform designed to serve parents, students, and faculty. Organizes academic departments, admissions requirements, calendar events, and portal links in a clear, accessible hierarchy.',
    technologies: ['React', 'Tailwind CSS', 'Database Integration', 'UI/UX Design'],
    imageUrl: 'src/assets/images/project_school_mockup_1795774384077.jpg',
    liveUrl: '',
    highlights: [
      'Organized academic program explorer by faculty and grade level',
      'Dedicated admissions inquiry and prospectus request workflow',
      'Accessible navigation engineered for families across all devices',
    ],
    featured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 4,
    title: 'Grace Community — Church & Ministry Hub',
    category: 'Church',
    isDemo: true,
    summary:
      'Welcoming digital sanctuary featuring service schedules, searchable sermon archives, event announcements, and ministry connection forms.',
    description:
      'A demonstration church website crafted to help congregations stay connected during the week. Includes Sunday service timings, media-ready sermon collections, small group sign-ups, and an approachable mobile experience.',
    technologies: ['HTML5', 'Tailwind CSS', 'JavaScript', 'AI-Assisted Dev'],
    imageUrl: 'src/assets/images/project_church_mockup_1795774385059.jpg',
    liveUrl: '',
    highlights: [
      'Clear weekly service schedules and first-time visitor welcome flow',
      'Structured sermon series library with speaker and topic filtering',
      'Integrated prayer request and volunteer ministry contact forms',
    ],
    featured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 5,
    title: 'Aurora Dining — Restaurant & Table Reservation Site',
    category: 'Restaurant',
    isDemo: true,
    summary:
      'Atmospheric hospitality website showcasing seasonal tasting menus, chef highlights, and an interactive table reservation request experience.',
    description:
      'A demonstration restaurant and culinary brand website blending rich editorial presentation with practical guest utility. Guests can browse curated menu courses, dietary notes, private dining options, and submit table bookings.',
    technologies: ['React', 'CSS3', 'Responsive Design', 'Node.js'],
    imageUrl: 'src/assets/images/project_restaurant_mockup_1795774385850.jpg',
    liveUrl: '',
    highlights: [
      'Interactive menu navigation across starters, mains, and curated drinks',
      'Streamlined date, time, and party-size table reservation form',
      'Mobile-optimized layout for guests checking directions and hours on the go',
    ],
    featured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 6,
    title: 'Developer Showcase — Personal Portfolio Concept',
    category: 'Portfolio',
    isDemo: true,
    summary:
      'Futuristic dark-mode personal brand architecture engineered for software engineers, designers, and technical founders.',
    description:
      'A demonstration personal portfolio system featuring interactive project previews, modular content management, smooth section transitions, and a backend-connected inquiry pipeline for client acquisition.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'SQLite', 'Google AI Studio'],
    imageUrl: 'src/assets/images/project_portfolio_mockup_1795774385371.jpg',
    liveUrl: '',
    highlights: [
      'Modular project gallery backed by persistent database storage',
      'Dark-first visual system with electric-blue interaction accents',
      'End-to-end contact pipeline with validation and instant confirmation',
    ],
    featured: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];
