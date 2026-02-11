'use client';

import { clients, getProjectsByClient, getMeetingsByClient } from '@/lib/data';
import { Users, Mail, Phone, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

export default function ClientsPage() {
  const activeClients = clients.filter(c => c.status === 'active');

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#3C3C3C]">Clients</h1>
          <p className="text-[#AFAFAF] font-semibold mt-1">{activeClients.length} active clients</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {activeClients.slice(0, 4).map((c, i) => (
              <div
                key={c.id}
                className="avatar border-2 border-white"
                style={{ background: AVATAR_COLORS[i], width: 36, height: 36, fontSize: 12 }}
              >
                {c.avatar}
              </div>
            ))}
          </div>
          {activeClients.length > 4 && (
            <span className="text-sm font-bold text-[#AFAFAF]">+{activeClients.length - 4}</span>
          )}
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map((client, i) => {
          const clientProjects = getProjectsByClient(client.id);
          const clientMeetings = getMeetingsByClient(client.id);
          const activeProjectCount = clientProjects.filter(p => p.status !== 'done').length;
          const totalTasks = clientProjects.reduce((a, p) => a + p.tasks.length, 0);
          const doneTasks = clientProjects.reduce((a, p) => a + p.tasks.filter(t => t.status === 'done').length, 0);
          const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

          return (
            <Link key={client.id} href={`/clients/${client.id}`} className="block group">
              <div className="duo-card h-full">
                {/* Client header */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="avatar"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {client.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-lg truncate">{client.name}</p>
                      <span
                        className="badge ml-auto"
                        style={{
                          background: client.status === 'active' ? '#E6F4EA' : '#F0F0F0',
                          color: client.status === 'active' ? '#34A853' : '#AFAFAF',
                        }}
                      >
                        {client.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#AFAFAF] font-semibold">
                      <Building2 size={14} />
                      {client.company}
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#AFAFAF]">
                    <Mail size={14} />
                    <span className="font-semibold truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#AFAFAF]">
                    <Phone size={14} />
                    <span className="font-semibold">{client.phone}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-2 mb-3">
                  <span className="badge" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                    {activeProjectCount} projects
                  </span>
                  <span className="badge" style={{ background: '#FEF7E0', color: '#F9A825' }}>
                    {clientMeetings.length} meetings
                  </span>
                </div>

                {/* Progress */}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                      background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-bold text-[#AFAFAF]">{progress}% tasks complete</p>
                  <ArrowRight
                    size={16}
                    className="text-[#AFAFAF] group-hover:text-[#4285F4] transition-colors"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
