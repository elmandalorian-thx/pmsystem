'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getClientById, getActiveProjectsByClient, getPastProjectsByClient, getMeetingsByClient, clients } from '@/lib/data';
import { Mail, Phone, Building2, Calendar, ArrowLeft, Plus, Clock, Flag, CheckCircle2, FileText, Mic, ChevronDown, ChevronRight, FolderCheck } from 'lucide-react';
import Link from 'next/link';
import AddProjectModal from '@/components/AddProjectModal';
import { PRIORITY_COLORS } from '@/lib/types';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const client = getClientById(clientId);
  const activeProjects = getActiveProjectsByClient(clientId);
  const pastProjects = getPastProjectsByClient(clientId);
  const clientMeetings = getMeetingsByClient(clientId);
  const [showAddProject, setShowAddProject] = useState(false);
  const [expandedMeetings, setExpandedMeetings] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'projects' | 'meetings'>('projects');
  const [pastProjectsOpen, setPastProjectsOpen] = useState(false);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-lg font-black mb-2">Client not found</h2>
          <Link href="/clients" className="text-[#4285F4] font-bold text-sm hover:underline">
            Back to clients
          </Link>
        </div>
      </div>
    );
  }

  const clientIndex = clients.indexOf(client);
  const allProjects = [...activeProjects, ...pastProjects];
  const totalTasks = allProjects.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = allProjects.reduce((a, p) => a + p.tasks.filter(t => t.status === 'done').length, 0);

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
        className="inline-flex items-center gap-1.5 text-[#AFAFAF] font-bold text-xs mb-4 hover:text-[#3C3C3C] transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Clients
      </Link>

      {/* Client Header */}
      <div className="duo-card mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div
            className="avatar"
            style={{
              background: AVATAR_COLORS[clientIndex % AVATAR_COLORS.length],
              width: 48,
              height: 48,
              fontSize: 18,
            }}
          >
            {client.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5">
              <h1 className="text-lg sm:text-xl font-black truncate">{client.name}</h1>
              <span
                className="badge w-fit"
                style={{ background: '#E6F4EA', color: '#34A853' }}
              >
                {client.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#AFAFAF] font-semibold">
              <span className="flex items-center gap-1"><Building2 size={12} /> {client.company}</span>
              <span className="flex items-center gap-1"><Mail size={12} /> {client.email}</span>
              <span className="hidden sm:flex items-center gap-1"><Phone size={12} /> {client.phone}</span>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-3 mt-2 sm:mt-0">
            <div className="text-center">
              <p className="text-lg sm:text-xl font-black text-[#4285F4]">{activeProjects.length}</p>
              <p className="text-[10px] font-bold text-[#AFAFAF]">Active</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-black text-[#34A853]">{doneTasks}/{totalTasks}</p>
              <p className="text-[10px] font-bold text-[#AFAFAF]">Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-black text-[#FBBC04]">{clientMeetings.length}</p>
              <p className="text-[10px] font-bold text-[#AFAFAF]">Meetings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'projects'
              ? 'bg-[#4285F4] text-white shadow-[0_3px_0_#3367D6]'
              : 'bg-white border-2 border-[#E5E5E5] text-[#AFAFAF] hover:bg-[#F0F0F0]'
          }`}
        >
          <FileText size={14} className="inline mr-1.5" />
          Projects ({activeProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'meetings'
              ? 'bg-[#4285F4] text-white shadow-[0_3px_0_#3367D6]'
              : 'bg-white border-2 border-[#E5E5E5] text-[#AFAFAF] hover:bg-[#F0F0F0]'
          }`}
        >
          <Mic size={14} className="inline mr-1.5" />
          Meetings ({clientMeetings.length})
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black">Active Projects</h2>
            <button
              onClick={() => setShowAddProject(true)}
              className="btn-primary flex items-center gap-1.5 !py-1.5 !px-3 !text-xs !rounded-lg"
            >
              <Plus size={14} />
              Add Project
            </button>
          </div>
          <div className="space-y-3">
            {activeProjects.map(project => {
              const progress = project.tasks.length > 0
                ? Math.round((project.tasks.filter(t => t.status === 'done').length / project.tasks.length) * 100)
                : 0;
              return (
                <div key={project.id} className="duo-card">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: project.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm">{project.title}</h3>
                      <p className="text-xs text-[#AFAFAF] font-semibold truncate">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[10px]">
                        <Flag size={10} style={{ color: PRIORITY_COLORS[project.priority] }} />
                        <span className="font-bold capitalize">{project.priority}</span>
                      </div>
                      <span
                        className="badge capitalize !text-[10px] !px-2 !py-0.5"
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
                  <div className="space-y-0.5 mb-2">
                    {project.tasks.map(task => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[#FAFAFA] transition-colors"
                      >
                        <CheckCircle2
                          size={15}
                          style={{
                            color: task.status === 'done' ? '#34A853' : '#E5E5E5',
                          }}
                        />
                        <span className={`flex-1 text-xs font-semibold ${task.status === 'done' ? 'line-through text-[#AFAFAF]' : ''}`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-[#AFAFAF]">
                          <Clock size={10} />
                          <span className="font-semibold hidden sm:inline">
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
                    <p className="text-[10px] font-bold text-[#AFAFAF]">{progress}% complete</p>
                    <p className="text-[10px] font-bold text-[#AFAFAF]">
                      <Calendar size={9} className="inline mr-0.5" />
                      Due {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Past Projects Collapsible Dropdown */}
          {pastProjects.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setPastProjectsOpen(!pastProjectsOpen)}
                className="w-full flex items-center gap-2 p-3 bg-white border-2 border-[#E5E5E5] rounded-xl hover:bg-[#FAFAFA] transition-colors"
              >
                <FolderCheck size={16} className="text-[#34A853]" />
                <span className="text-xs font-black flex-1 text-left">
                  Past Projects ({pastProjects.length})
                </span>
                {pastProjectsOpen
                  ? <ChevronDown size={16} className="text-[#AFAFAF]" />
                  : <ChevronRight size={16} className="text-[#AFAFAF]" />
                }
              </button>

              {pastProjectsOpen && (
                <div className="mt-2 space-y-1.5 animate-[fadeIn_0.2s_ease]">
                  {pastProjects.map(project => (
                    <div
                      key={project.id}
                      className="flex items-center gap-3 p-3 bg-white border border-[#E5E5E5] rounded-xl hover:bg-[#FAFAFA] transition-colors"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: project.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{project.title}</p>
                        <p className="text-[10px] text-[#AFAFAF] font-semibold truncate">{project.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="badge !text-[9px] !px-1.5 !py-0.5" style={{ background: '#E6F4EA', color: '#34A853' }}>
                          Completed
                        </span>
                        <p className="text-[10px] text-[#AFAFAF] font-semibold mt-0.5">
                          {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black">Meeting History</h2>
            <span className="badge !text-[10px]" style={{ background: '#E8F0FE', color: '#4285F4' }}>
              Powered by Fireflies.ai
            </span>
          </div>
          <div className="space-y-2">
            {clientMeetings.map(meeting => {
              const isExpanded = expandedMeetings.has(meeting.id);
              return (
                <div key={meeting.id} className="duo-card">
                  <button
                    onClick={() => toggleMeeting(meeting.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      <Mic size={15} className="text-[#4285F4]" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs">{meeting.title}</h3>
                        <div className="flex flex-wrap gap-x-2 text-[10px] text-[#AFAFAF] font-semibold mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <Calendar size={10} />
                            {new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} />
                            {meeting.duration} min
                          </span>
                          <span className="hidden sm:inline">{meeting.attendees.join(', ')}</span>
                        </div>
                      </div>
                      {meeting.firefliesId && (
                        <span className="badge shrink-0 !text-[9px] !px-1.5 hidden sm:flex" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                          🔥 Fireflies
                        </span>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pl-4 sm:pl-8 space-y-3">
                      <div>
                        <h4 className="text-[10px] font-bold text-[#AFAFAF] uppercase mb-1">Summary</h4>
                        <p className="text-xs font-semibold leading-relaxed bg-[#FAFAFA] rounded-xl p-2.5">
                          {meeting.summary}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-[#AFAFAF] uppercase mb-1">Action Items</h4>
                        <div className="space-y-1">
                          {meeting.actionItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs font-semibold">
                              <CheckCircle2 size={13} className="text-[#E5E5E5] shrink-0" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {meeting.firefliesId && (
                        <div className="bg-[#E8F0FE] rounded-xl p-2.5 flex items-center gap-2">
                          <span className="text-base">🔥</span>
                          <div>
                            <p className="text-xs font-bold text-[#4285F4]">View transcript on Fireflies</p>
                            <p className="text-[10px] text-[#AFAFAF] font-semibold">ID: {meeting.firefliesId}</p>
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
