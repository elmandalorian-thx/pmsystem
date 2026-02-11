'use client';

import { useState } from 'react';
import { clients, projects, meetings, getProjectsByClient } from '@/lib/data';
import { Users, FolderKanban, CheckCircle2, Clock, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import AddProjectModal from '@/components/AddProjectModal';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

export default function Dashboard() {
  const [showAddProject, setShowAddProject] = useState(false);

  const activeClients = clients.filter(c => c.status === 'active');
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'done').length, 0);
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;

  const stats = [
    { label: 'Active Clients', value: activeClients.length, icon: Users, color: '#4285F4', bg: '#E8F0FE' },
    { label: 'Projects', value: projects.length, icon: FolderKanban, color: '#34A853', bg: '#E6F4EA' },
    { label: 'In Progress', value: inProgressProjects, icon: Clock, color: '#FBBC04', bg: '#FEF7E0' },
    { label: 'Tasks Done', value: `${completedTasks}/${totalTasks}`, icon: CheckCircle2, color: '#EA4335', bg: '#FCE8E6' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#3C3C3C]">Dashboard</h1>
          <p className="text-[#AFAFAF] font-semibold mt-1">Welcome back! Here&apos;s your overview.</p>
        </div>
        <button
          onClick={() => setShowAddProject(true)}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={stat.label} className="duo-card stat-card !p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <TrendingUp size={16} style={{ color: stat.color }} className="ml-auto" />
            </div>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-sm text-[#AFAFAF] font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active Clients */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black">Active Clients</h2>
          <Link href="/clients" className="text-sm font-bold text-[#4285F4] flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeClients.map((client, i) => {
            const clientProjects = getProjectsByClient(client.id);
            const activeProjectCount = clientProjects.filter(p => p.status !== 'done').length;
            return (
              <Link key={client.id} href={`/clients/${client.id}`} className="block">
                <div className="duo-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="avatar"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    >
                      {client.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold truncate">{client.name}</p>
                      <p className="text-sm text-[#AFAFAF] font-semibold truncate">{client.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="badge" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                      {activeProjectCount} active project{activeProjectCount !== 1 ? 's' : ''}
                    </span>
                    <span className="badge" style={{ background: '#E6F4EA', color: '#34A853' }}>
                      {clientProjects.reduce((a, p) => a + p.tasks.length, 0)} tasks
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-black mb-4">Recent Meetings</h2>
        <div className="space-y-3">
          {meetings.slice(0, 4).map(meeting => {
            const client = clients.find(c => c.id === meeting.clientId);
            return (
              <div key={meeting.id} className="duo-card flex flex-col sm:flex-row sm:items-center gap-3">
                <div
                  className="avatar shrink-0"
                  style={{
                    background: AVATAR_COLORS[clients.indexOf(client!) % AVATAR_COLORS.length],
                    width: 36,
                    height: 36,
                    fontSize: 13,
                  }}
                >
                  {client?.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{meeting.title}</p>
                  <p className="text-xs text-[#AFAFAF] font-semibold">{client?.company} &middot; {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-2">
                  <span className="badge" style={{ background: '#FEF7E0', color: '#F9A825' }}>
                    {meeting.actionItems.length} action items
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onAdd={(p) => console.log('New project:', p)}
        />
      )}
    </div>
  );
}
