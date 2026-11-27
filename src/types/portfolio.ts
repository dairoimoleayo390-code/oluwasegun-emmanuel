export type ProjectCategory =
  | 'E-commerce'
  | 'Business'
  | 'School'
  | 'Church'
  | 'Restaurant'
  | 'Portfolio'
  | 'Web App';

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory | string;
  isDemo: boolean;
  summary: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl: string;
  highlights: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  title: string;
  category: string;
  isDemo: boolean;
  summary: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  highlights: string[];
  featured?: boolean;
}

export interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  emailSent: boolean;
  createdAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend & UI' | 'AI & Architecture' | 'Backend & Ops';
  description: string;
  focusArea: string;
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ToolItem {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface ValuePillar {
  number: string;
  title: string;
  description: string;
}

export interface ContactSettings {
  email: string;
  whatsappDisplay: string;
  whatsappHref: string;
  linkedinLabel: string;
  linkedinHref: string;
  githubHref: string;
}

