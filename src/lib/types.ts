export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar: string;
  status: 'active' | 'inactive';
  phone: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  startDate: string;
  endDate: string;
  projectId: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  color: string;
  tasks: Task[];
}

export interface Meeting {
  id: string;
  title: string;
  clientId: string;
  date: string;
  duration: number;
  summary: string;
  actionItems: string[];
  attendees: string[];
  firefliesId?: string;
  transcript?: string;
}

export type KanbanColumn = 'todo' | 'in-progress' | 'review' | 'done';

export const COLUMN_TITLES: Record<KanbanColumn, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done',
};

export const COLUMN_COLORS: Record<KanbanColumn, string> = {
  'todo': '#4285F4',
  'in-progress': '#FBBC04',
  'review': '#EA4335',
  'done': '#34A853',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#34A853',
  medium: '#FBBC04',
  high: '#EA4335',
};
