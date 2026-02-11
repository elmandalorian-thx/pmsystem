'use client';

import { useState } from 'react';
import { clients, meetings, getActiveProjectsByClient, getActiveProjects } from '@/lib/data';
import { Users, FolderKanban, CheckCircle2, Clock, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import AddProjectModal from '@/components/AddProjectModal';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

export default function Dashboard() {
  const [showAddProject, setShowAddProject] = useState(false);

  const activeClients = clients.filter(c => c.status === 'active');
  const activeProjects = getActiveProjects();
  const totalTasks = activeProjects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = activeProjects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'done').length, 0);
  const inProgressProjects = activeProjects.filter(p => p.status === 'in-progress').length;

  const stats = [
    { label: 'Active Clients', value: activeClients.length, icon: Users, color: '#4285F4', bg: '#E8F0FE' },
    { label: 'Projects', value: activeProjects.length, icon: FolderKanban, color: '#34A853', bg: '#E6F4EA' },
    { label: 'In Progress', value: inProgressProjects, icon: Clock, color: '#FBBC04', bg: '#FEF7E0' },
    { label: 'Tasks Done', value: `${completedTasks}/${totalTasks}`, icon: CheckCircle2, color: '#EA4335', bg: '#FCE8E6' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3C3C3C]">Dashboard</h1>
          <p className="text-[#AFAFAF] font-semibold text-xs sm:text-sm mt-0.5">Welcome back! Here&apos;s your overview.</p>
        </div>
        <button
          onClick={() => setShowAddProject(true)}
          className="btn-primary flex items-center gap-1.5 w-fit text-xs sm:text-sm"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="duo-card stat-card !p-3 sm:!p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg }}
              >
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <TrendingUp size={12} style={{ color: stat.color }} className="ml-auto" />
            </div>
            <p className="text-lg sm:text-xl font-black">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-[#AFAFAF] font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active Clients */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-black">Active Clients</h2>
          <Link href="/clients" className="text-xs font-bold text-[#4285F4] flex items-center gap-1 hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeClients.map((client, i) => {
            const clientProjects = getActiveProjectsByClient(client.id);
            const activeProjectCount = clientProjects.length;
            return (
              <Link key={client.id} href={`/clients/${client.id}`} className="block">
                <div className="duo-card">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div
                      className="avatar"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 36, height: 36, fontSize: 13 }}
                    >
                      {client.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{client.name}</p>
                      <p className="text-xs text-[#AFAFAF] font-semibold truncate">{client.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="badge" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                      {activeProjectCount} project{activeProjectCount !== 1 ? 's' : ''}
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
        <h2 className="text-sm sm:text-base font-black mb-3">Recent Meetings</h2>
        <div className="space-y-2">
          {meetings.slice(0, 4).map(meeting => {
            const client = clients.find(c => c.id === meeting.clientId);
            return (
              <div key={meeting.id} className="duo-card flex items-center gap-2.5">
                <div
                  className="avatar shrink-0"
                  style={{
                    background: AVATAR_COLORS[clients.indexOf(client!) % AVATAR_COLORS.length],
                    width: 32,
                    height: 32,
                    fontSize: 11,
                  }}
                >
                  {client?.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs truncate">{meeting.title}</p>
                  <p className="text-[10px] text-[#AFAFAF] font-semibold truncate">{client?.company} &middot; {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <span className="badge shrink-0" style={{ background: '#FEF7E0', color: '#F9A825' }}>
                  {meeting.actionItems.length} actions
                </span>
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
