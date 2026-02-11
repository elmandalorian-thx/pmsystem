import { Client, Project, Meeting } from './types';

export const clients: Client[] = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    email: 'sarah@techflow.io',
    company: 'TechFlow Inc.',
    avatar: 'SC',
    status: 'active',
    phone: '+1 (555) 123-4567',
    createdAt: '2025-09-15',
  },
  {
    id: 'c2',
    name: 'Marcus Johnson',
    email: 'marcus@greenleaf.co',
    company: 'GreenLeaf Co.',
    avatar: 'MJ',
    status: 'active',
    phone: '+1 (555) 234-5678',
    createdAt: '2025-10-02',
  },
  {
    id: 'c3',
    name: 'Elena Rodriguez',
    email: 'elena@brightstar.com',
    company: 'BrightStar Media',
    avatar: 'ER',
    status: 'active',
    phone: '+1 (555) 345-6789',
    createdAt: '2025-11-20',
  },
  {
    id: 'c4',
    name: 'David Park',
    email: 'david@nimbus.dev',
    company: 'Nimbus Dev',
    avatar: 'DP',
    status: 'active',
    phone: '+1 (555) 456-7890',
    createdAt: '2025-12-05',
  },
  {
    id: 'c5',
    name: 'Aisha Patel',
    email: 'aisha@solara.io',
    company: 'Solara Solutions',
    avatar: 'AP',
    status: 'active',
    phone: '+1 (555) 567-8901',
    createdAt: '2026-01-10',
  },
];

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design',
    clientId: 'c1',
    status: 'in-progress',
    priority: 'high',
    startDate: '2026-01-15',
    endDate: '2026-03-30',
    color: '#4285F4',
    tasks: [
      { id: 't1', title: 'Wireframes', description: 'Create wireframes for all pages', status: 'done', priority: 'high', assignee: 'You', startDate: '2026-01-15', endDate: '2026-01-25', projectId: 'p1' },
      { id: 't2', title: 'UI Design', description: 'Design mockups in Figma', status: 'in-progress', priority: 'high', assignee: 'You', startDate: '2026-01-26', endDate: '2026-02-15', projectId: 'p1' },
      { id: 't3', title: 'Frontend Dev', description: 'Build React components', status: 'todo', priority: 'medium', assignee: 'You', startDate: '2026-02-16', endDate: '2026-03-10', projectId: 'p1' },
      { id: 't4', title: 'Testing & QA', description: 'Cross-browser testing', status: 'todo', priority: 'medium', assignee: 'You', startDate: '2026-03-11', endDate: '2026-03-30', projectId: 'p1' },
    ],
  },
  {
    id: 'p2',
    title: 'Mobile App MVP',
    description: 'Build a minimum viable product for the mobile app',
    clientId: 'c2',
    status: 'todo',
    priority: 'high',
    startDate: '2026-02-01',
    endDate: '2026-05-15',
    color: '#34A853',
    tasks: [
      { id: 't5', title: 'Requirements Gathering', description: 'Define MVP features', status: 'done', priority: 'high', assignee: 'You', startDate: '2026-02-01', endDate: '2026-02-10', projectId: 'p2' },
      { id: 't6', title: 'App Architecture', description: 'Set up project structure', status: 'in-progress', priority: 'high', assignee: 'You', startDate: '2026-02-11', endDate: '2026-02-20', projectId: 'p2' },
      { id: 't7', title: 'Core Features', description: 'Build authentication and main screens', status: 'todo', priority: 'high', assignee: 'You', startDate: '2026-02-21', endDate: '2026-04-01', projectId: 'p2' },
      { id: 't8', title: 'Beta Testing', description: 'Internal beta release', status: 'todo', priority: 'medium', assignee: 'You', startDate: '2026-04-02', endDate: '2026-05-15', projectId: 'p2' },
    ],
  },
  {
    id: 'p3',
    title: 'Brand Identity',
    description: 'Create a complete brand identity package',
    clientId: 'c3',
    status: 'review',
    priority: 'medium',
    startDate: '2025-12-01',
    endDate: '2026-02-28',
    color: '#EA4335',
    tasks: [
      { id: 't9', title: 'Brand Research', description: 'Competitive analysis and mood boards', status: 'done', priority: 'high', assignee: 'You', startDate: '2025-12-01', endDate: '2025-12-15', projectId: 'p3' },
      { id: 't10', title: 'Logo Design', description: 'Design 3 logo concepts', status: 'done', priority: 'high', assignee: 'You', startDate: '2025-12-16', endDate: '2026-01-10', projectId: 'p3' },
      { id: 't11', title: 'Style Guide', description: 'Complete brand style guide', status: 'review', priority: 'medium', assignee: 'You', startDate: '2026-01-11', endDate: '2026-02-10', projectId: 'p3' },
      { id: 't12', title: 'Asset Delivery', description: 'Final file delivery', status: 'todo', priority: 'low', assignee: 'You', startDate: '2026-02-11', endDate: '2026-02-28', projectId: 'p3' },
    ],
  },
  {
    id: 'p4',
    title: 'API Integration',
    description: 'Integrate third-party APIs into existing platform',
    clientId: 'c4',
    status: 'in-progress',
    priority: 'medium',
    startDate: '2026-01-20',
    endDate: '2026-03-15',
    color: '#FBBC04',
    tasks: [
      { id: 't13', title: 'API Documentation Review', description: 'Review all API docs', status: 'done', priority: 'medium', assignee: 'You', startDate: '2026-01-20', endDate: '2026-01-28', projectId: 'p4' },
      { id: 't14', title: 'Payment Gateway', description: 'Stripe integration', status: 'in-progress', priority: 'high', assignee: 'You', startDate: '2026-01-29', endDate: '2026-02-15', projectId: 'p4' },
      { id: 't15', title: 'Email Service', description: 'SendGrid integration', status: 'todo', priority: 'medium', assignee: 'You', startDate: '2026-02-16', endDate: '2026-03-01', projectId: 'p4' },
      { id: 't16', title: 'Analytics', description: 'Mixpanel integration', status: 'todo', priority: 'low', assignee: 'You', startDate: '2026-03-02', endDate: '2026-03-15', projectId: 'p4' },
    ],
  },
  {
    id: 'p5',
    title: 'E-commerce Platform',
    description: 'Build custom e-commerce solution',
    clientId: 'c5',
    status: 'todo',
    priority: 'high',
    startDate: '2026-02-15',
    endDate: '2026-06-30',
    color: '#4285F4',
    tasks: [
      { id: 't17', title: 'Platform Selection', description: 'Evaluate and choose tech stack', status: 'in-progress', priority: 'high', assignee: 'You', startDate: '2026-02-15', endDate: '2026-02-28', projectId: 'p5' },
      { id: 't18', title: 'Product Catalog', description: 'Build product management system', status: 'todo', priority: 'high', assignee: 'You', startDate: '2026-03-01', endDate: '2026-04-15', projectId: 'p5' },
      { id: 't19', title: 'Shopping Cart & Checkout', description: 'Cart and payment flow', status: 'todo', priority: 'high', assignee: 'You', startDate: '2026-04-16', endDate: '2026-05-30', projectId: 'p5' },
      { id: 't20', title: 'Launch Prep', description: 'Performance testing and launch', status: 'todo', priority: 'medium', assignee: 'You', startDate: '2026-06-01', endDate: '2026-06-30', projectId: 'p5' },
    ],
  },
];

export const meetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Website Redesign Kickoff',
    clientId: 'c1',
    date: '2026-01-15T10:00:00',
    duration: 60,
    summary: 'Discussed project scope, timeline, and key deliverables. Sarah emphasized mobile-first approach and accessibility. Agreed on bi-weekly check-ins.',
    actionItems: ['Send wireframe timeline', 'Share competitor analysis', 'Set up Slack channel'],
    attendees: ['You', 'Sarah Chen'],
    firefliesId: 'ff-001',
  },
  {
    id: 'm2',
    title: 'Design Review - Homepage',
    clientId: 'c1',
    date: '2026-02-03T14:00:00',
    duration: 45,
    summary: 'Reviewed homepage wireframes. Client loved the hero section concept. Requested changes to navigation layout. Footer needs more social links.',
    actionItems: ['Revise nav layout', 'Add social links to footer', 'Prepare mobile mockups'],
    attendees: ['You', 'Sarah Chen', 'Tom (CTO)'],
    firefliesId: 'ff-002',
  },
  {
    id: 'm3',
    title: 'MVP Feature Prioritization',
    clientId: 'c2',
    date: '2026-02-05T11:00:00',
    duration: 90,
    summary: 'Prioritized features for the MVP launch. Core features: auth, dashboard, notifications. Push features: social sharing, advanced analytics. Marcus wants beta by April.',
    actionItems: ['Create feature matrix', 'Draft technical architecture', 'Estimate sprint velocity'],
    attendees: ['You', 'Marcus Johnson', 'Lisa (PM)'],
    firefliesId: 'ff-003',
  },
  {
    id: 'm4',
    title: 'Brand Review Session',
    clientId: 'c3',
    date: '2026-01-20T09:00:00',
    duration: 60,
    summary: 'Presented 3 logo concepts. Elena preferred concept B with modifications. Discussed color palette - wants more vibrant tones. Style guide draft due next week.',
    actionItems: ['Refine logo concept B', 'Create vibrant color palette options', 'Draft style guide'],
    attendees: ['You', 'Elena Rodriguez'],
    firefliesId: 'ff-004',
  },
  {
    id: 'm5',
    title: 'API Integration Planning',
    clientId: 'c4',
    date: '2026-01-25T15:00:00',
    duration: 45,
    summary: 'Mapped out integration priority: Stripe first, then SendGrid, then Mixpanel. David shared API credentials and staging environment access.',
    actionItems: ['Set up staging environment', 'Begin Stripe sandbox testing', 'Document API endpoints'],
    attendees: ['You', 'David Park'],
    firefliesId: 'ff-005',
  },
  {
    id: 'm6',
    title: 'E-commerce Requirements',
    clientId: 'c5',
    date: '2026-02-10T13:00:00',
    duration: 75,
    summary: 'Detailed requirements gathering for the e-commerce platform. Aisha needs multi-currency support and inventory management. Discussed Shopify vs custom build.',
    actionItems: ['Compare platform options', 'Draft requirements doc', 'Estimate timeline for each option'],
    attendees: ['You', 'Aisha Patel', 'Raj (Tech Lead)'],
    firefliesId: 'ff-006',
  },
];

export function getClientById(id: string): Client | undefined {
  return clients.find(c => c.id === id);
}

export function getProjectsByClient(clientId: string): Project[] {
  return projects.filter(p => p.clientId === clientId);
}

export function getMeetingsByClient(clientId: string): Meeting[] {
  return meetings.filter(m => m.clientId === clientId);
}

export function getAllTasks() {
  return projects.flatMap(p => p.tasks.map(t => ({ ...t, projectTitle: p.title, projectColor: p.color })));
}
