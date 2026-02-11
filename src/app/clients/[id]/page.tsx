'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getClientById, getProjectsByClient, getMeetingsByClient, clients } from '@/lib/data';
import { Mail, Phone, Building2, Calendar, ArrowLeft, Plus, Clock, Flag, CheckCircle2, FileText, Mic, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AddProjectModal from '@/components/AddProjectModal';
import { PRIORITY_COLORS } from '@/lib/types';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const client = getClientById(clientId);
  const clientProjects = getProjectsByClient(clientId);
  const clientMeetings = getMeetingsByClient(clientId);
  const [showAddProject, setShowAddProject] = useState(false);
  const [expandedMeetings, setExpandedMeetings] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'projects' | 'meetings'>('projects');

  if (!client) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-xl font-black mb-2">Client not found</h2>
          <Link href="/clients" className="text-[#4285F4] font-bold hover:underline">
            Back to clients
          </Link>
        </div>
      </div>
    );
  }

  const clientIndex = clients.indexOf(client);
  const totalTasks = clientProjects.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = clientProjects.reduce((a, p) => a + p.tasks.filter(t => t.status === 'done').length, 0);

  const toggleMeeting = (id: string) => {
    setExpandedMeetings(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Back button */}
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-[#AFAFAF] font-bold text-sm mb-6 hover:text-[#3C3C3C] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Clients
      </Link>

      {/* Client Header */}
      <div className="duo-card mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div
            className="avatar"
            style={{
              background: AVATAR_COLORS[clientIndex % AVATAR_COLORS.length],
              width: 64,
              height: 64,
              fontSize: 24,
            }}
          >
            {client.avatar}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-2xl font-black">{client.name}</h1>
              <span
                className="badge w-fit"
                style={{ background: '#E6F4EA', color: '#34A853' }}
              >
                {client.status}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-[#AFAFAF] font-semibold">
              <span className="flex items-center gap-1"><Building2 size={14} /> {client.company}</span>
              <span className="flex items-center gap-1"><Mail size={14} /> {client.email}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {client.phone}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <p className="text-2xl font-black text-[#4285F4]">{clientProjects.length}</p>
              <p className="text-xs font-bold text-[#AFAFAF]">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#34A853]">{doneTasks}/{totalTasks}</p>
              <p className="text-xs font-bold text-[#AFAFAF]">Tasks Done</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#FBBC04]">{clientMeetings.length}</p>
              <p className="text-xs font-bold text-[#AFAFAF]">Meetings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'projects'
              ? 'bg-[#4285F4] text-white shadow-[0_4px_0_#3367D6]'
              : 'bg-white border-2 border-[#E5E5E5] text-[#AFAFAF] hover:bg-[#F0F0F0]'
          }`}
        >
          <FileText size={16} className="inline mr-2" />
          Projects ({clientProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'meetings'
              ? 'bg-[#4285F4] text-white shadow-[0_4px_0_#3367D6]'
              : 'bg-white border-2 border-[#E5E5E5] text-[#AFAFAF] hover:bg-[#F0F0F0]'
          }`}
        >
          <Mic size={16} className="inline mr-2" />
          Meetings ({clientMeetings.length})
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black">Active Projects</h2>
            <button
              onClick={() => setShowAddProject(true)}
              className="btn-primary flex items-center gap-2 !py-2 !px-4 text-sm"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
          <div className="space-y-4">
            {clientProjects.map(project => {
              const progress = project.tasks.length > 0
                ? Math.round((project.tasks.filter(t => t.status === 'done').length / project.tasks.length) * 100)
                : 0;
              return (
                <div key={project.id} className="duo-card">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: project.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{project.title}</h3>
                      <p className="text-sm text-[#AFAFAF] font-semibold">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Flag size={12} style={{ color: PRIORITY_COLORS[project.priority] }} />
                        <span className="font-bold capitalize">{project.priority}</span>
                      </div>
                      <span
                        className="badge capitalize"
                        style={{
                          background: project.status === 'done' ? '#E6F4EA'
                            : project.status === 'in-progress' ? '#FEF7E0'
                            : project.status === 'review' ? '#FCE8E6'
                            : '#F0F0F0',
                          color: project.status === 'done' ? '#34A853'
                            : project.status === 'in-progress' ? '#F9A825'
                            : project.status === 'review' ? '#EA4335'
                            : '#AFAFAF',
                        }}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Task list */}
                  <div className="space-y-2 mb-3">
                    {project.tasks.map(task => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAFAFA] transition-colors"
                      >
                        <CheckCircle2
                          size={18}
                          style={{
                            color: task.status === 'done' ? '#34A853' : '#E5E5E5',
                          }}
                        />
                        <span className={`flex-1 text-sm font-semibold ${task.status === 'done' ? 'line-through text-[#AFAFAF]' : ''}`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[#AFAFAF]">
                          <Clock size={12} />
                          <span className="font-semibold">
                            {new Date(task.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                        background: project.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs font-bold text-[#AFAFAF]">{progress}% complete</p>
                    <p className="text-xs font-bold text-[#AFAFAF]">
                      <Calendar size={10} className="inline mr-1" />
                      Due {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black">Meeting History</h2>
            <span className="badge" style={{ background: '#E8F0FE', color: '#4285F4' }}>
              Powered by Fireflies.ai
            </span>
          </div>
          <div className="space-y-3">
            {clientMeetings.map(meeting => {
              const isExpanded = expandedMeetings.has(meeting.id);
              return (
                <div key={meeting.id} className="duo-card">
                  <button
                    onClick={() => toggleMeeting(meeting.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      <Mic size={18} className="text-[#4285F4]" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold">{meeting.title}</h3>
                        <div className="flex flex-wrap gap-2 text-xs text-[#AFAFAF] font-semibold mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {meeting.duration} min
                          </span>
                          <span>{meeting.attendees.join(', ')}</span>
                        </div>
                      </div>
                      {meeting.firefliesId && (
                        <span className="badge shrink-0" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                          🔥 Fireflies
                        </span>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 pl-10 space-y-4">
                      {/* Summary */}
                      <div>
                        <h4 className="text-xs font-bold text-[#AFAFAF] uppercase mb-2">Summary</h4>
                        <p className="text-sm font-semibold leading-relaxed bg-[#FAFAFA] rounded-xl p-3">
                          {meeting.summary}
                        </p>
                      </div>

                      {/* Action Items */}
                      <div>
                        <h4 className="text-xs font-bold text-[#AFAFAF] uppercase mb-2">Action Items</h4>
                        <div className="space-y-1">
                          {meeting.actionItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm font-semibold">
                              <CheckCircle2 size={16} className="text-[#E5E5E5] shrink-0" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fireflies link */}
                      {meeting.firefliesId && (
                        <div className="bg-[#E8F0FE] rounded-xl p-3 flex items-center gap-2">
                          <span className="text-lg">🔥</span>
                          <div>
                            <p className="text-sm font-bold text-[#4285F4]">View full transcript on Fireflies</p>
                            <p className="text-xs text-[#AFAFAF] font-semibold">Meeting ID: {meeting.firefliesId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onAdd={(p) => console.log('New project:', p)}
          preselectedClientId={clientId}
        />
      )}
    </div>
  );
}
