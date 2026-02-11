'use client';

import { clients, getActiveProjectsByClient, getMeetingsByClient } from '@/lib/data';
import { Mail, Phone, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

export default function ClientsPage() {
  const activeClients = clients.filter(c => c.status === 'active');

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3C3C3C]">Clients</h1>
          <p className="text-[#AFAFAF] font-semibold text-xs sm:text-sm mt-0.5">{activeClients.length} active clients</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {activeClients.slice(0, 4).map((c, i) => (
              <div
                key={c.id}
                className="avatar border-2 border-white"
                style={{ background: AVATAR_COLORS[i], width: 32, height: 32, fontSize: 11 }}
              >
                {c.avatar}
              </div>
            ))}
          </div>
          {activeClients.length > 4 && (
            <span className="text-xs font-bold text-[#AFAFAF]">+{activeClients.length - 4}</span>
          )}
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {clients.map((client, i) => {
          const clientProjects = getActiveProjectsByClient(client.id);
          const clientMeetings = getMeetingsByClient(client.id);
          const activeProjectCount = clientProjects.length;
          const totalTasks = clientProjects.reduce((a, p) => a + p.tasks.length, 0);
          const doneTasks = clientProjects.reduce((a, p) => a + p.tasks.filter(t => t.status === 'done').length, 0);
          const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

          return (
            <Link key={client.id} href={`/clients/${client.id}`} className="block group">
              <div className="duo-card h-full">
                {/* Client header */}
                <div className="flex items-start gap-2.5 mb-3">
                  <div
                    className="avatar"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 36, height: 36, fontSize: 13 }}
                  >
                    {client.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-sm truncate">{client.name}</p>
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
                    <div className="flex items-center gap-1 text-xs text-[#AFAFAF] font-semibold">
                      <Building2 size={12} />
                      {client.company}
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-0.5 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#AFAFAF]">
                    <Mail size={12} />
                    <span className="font-semibold truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#AFAFAF]">
                    <Phone size={12} />
                    <span className="font-semibold">{client.phone}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-1.5 mb-2.5">
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
                  <p className="text-[10px] font-bold text-[#AFAFAF]">{progress}% tasks complete</p>
                  <ArrowRight
                    size={14}
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
