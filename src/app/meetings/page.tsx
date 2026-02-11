'use client';

import { useState } from 'react';
import { meetings, clients } from '@/lib/data';
import { Mic, Calendar, Clock, CheckCircle2, ChevronDown, ChevronRight, ExternalLink, Settings, Search, Flame } from 'lucide-react';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

export default function MeetingsPage() {
  const [expandedMeetings, setExpandedMeetings] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFirefliesSetup, setShowFirefliesSetup] = useState(false);

  const toggleMeeting = (id: string) => {
    setExpandedMeetings(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredMeetings = meetings.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const client = clients.find(c => c.id === m.clientId);
    return (
      m.title.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q) ||
      client?.name.toLowerCase().includes(q) ||
      client?.company.toLowerCase().includes(q) ||
      m.actionItems.some(a => a.toLowerCase().includes(q))
    );
  });

  const totalActionItems = meetings.reduce((a, m) => a + m.actionItems.length, 0);
  const totalMinutes = meetings.reduce((a, m) => a + m.duration, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#3C3C3C]">Meetings</h1>
          <p className="text-[#AFAFAF] font-semibold mt-1">Transcripts, summaries, and action items</p>
        </div>
        <button
          onClick={() => setShowFirefliesSetup(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Flame size={18} />
          Fireflies Settings
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Meetings', value: meetings.length, color: '#4285F4', bg: '#E8F0FE' },
          { label: 'Total Minutes', value: totalMinutes, color: '#34A853', bg: '#E6F4EA' },
          { label: 'Action Items', value: totalActionItems, color: '#FBBC04', bg: '#FEF7E0' },
          { label: 'Clients Met', value: new Set(meetings.map(m => m.clientId)).size, color: '#EA4335', bg: '#FCE8E6' },
        ].map(stat => (
          <div key={stat.label} className="duo-card !p-4 stat-card">
            <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs font-bold text-[#AFAFAF]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Fireflies Integration Banner */}
      <div className="duo-card !p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #FFF8E1 0%, #E8F0FE 100%)', border: '2px solid #FBBC04' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="font-black">Fireflies.ai Integration</p>
            <p className="text-sm text-[#AFAFAF] font-semibold">
              Automatically transcribe and summarize your client calls
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowFirefliesSetup(true)}
          className="sm:ml-auto btn-secondary flex items-center gap-2 !py-2 !px-4 text-sm"
        >
          <Settings size={14} />
          Configure
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-11 border-2 border-[#E5E5E5] rounded-xl font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
          placeholder="Search meetings, summaries, action items..."
        />
      </div>

      {/* Meeting List */}
      <div className="space-y-3">
        {filteredMeetings.map(meeting => {
          const client = clients.find(c => c.id === meeting.clientId);
          const clientIndex = client ? clients.indexOf(client) : 0;
          const isExpanded = expandedMeetings.has(meeting.id);

          return (
            <div key={meeting.id} className="duo-card">
              <button
                onClick={() => toggleMeeting(meeting.id)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="avatar shrink-0"
                    style={{
                      background: AVATAR_COLORS[clientIndex % AVATAR_COLORS.length],
                      width: 40,
                      height: 40,
                      fontSize: 14,
                    }}
                  >
                    {client?.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[15px]">{meeting.title}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#AFAFAF] font-semibold mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(meeting.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {meeting.duration} min
                      </span>
                      <span>{client?.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {meeting.firefliesId && (
                      <span className="badge hidden sm:flex" style={{ background: '#FEF7E0', color: '#F9A825' }}>
                        🔥 Transcribed
                      </span>
                    )}
                    <span className="badge" style={{ background: '#E6F4EA', color: '#34A853' }}>
                      {meeting.actionItems.length} actions
                    </span>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-4 border-t-2 border-[#F0F0F0] pt-4">
                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-bold text-[#AFAFAF] uppercase mb-2 flex items-center gap-1">
                      <Mic size={12} />
                      Meeting Summary
                    </h4>
                    <p className="text-sm font-semibold leading-relaxed bg-[#FAFAFA] rounded-xl p-4">
                      {meeting.summary}
                    </p>
                  </div>

                  {/* Attendees */}
                  <div>
                    <h4 className="text-xs font-bold text-[#AFAFAF] uppercase mb-2">Attendees</h4>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((attendee, i) => (
                        <span key={i} className="badge" style={{ background: '#F0F0F0', color: '#3C3C3C' }}>
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Items */}
                  <div>
                    <h4 className="text-xs font-bold text-[#AFAFAF] uppercase mb-2">
                      Action Items ({meeting.actionItems.length})
                    </h4>
                    <div className="space-y-2">
                      {meeting.actionItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-[#FAFAFA] rounded-xl">
                          <CheckCircle2 size={16} className="text-[#E5E5E5] shrink-0 mt-0.5" />
                          <span className="text-sm font-semibold">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fireflies data */}
                  {meeting.firefliesId && (
                    <div className="bg-gradient-to-r from-[#FFF8E1] to-[#E8F0FE] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🔥</span>
                        <div>
                          <p className="font-bold text-sm">Fireflies.ai Transcript</p>
                          <p className="text-xs text-[#AFAFAF] font-semibold">
                            Meeting ID: {meeting.firefliesId} &middot; Auto-transcribed
                          </p>
                        </div>
                      </div>
                      <button className="sm:ml-auto btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
                        <ExternalLink size={12} />
                        View Transcript
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-bold text-[#AFAFAF]">No meetings found</p>
          <p className="text-sm text-[#D0D0D0] font-semibold">Try adjusting your search</p>
        </div>
      )}

      {/* Fireflies Setup Modal */}
      {showFirefliesSetup && (
        <div className="modal-overlay" onClick={() => setShowFirefliesSetup(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black mb-2">Fireflies.ai Setup</h2>
            <p className="text-sm text-[#AFAFAF] font-semibold mb-6">
              Connect your Fireflies account to auto-import meeting transcripts and summaries.
            </p>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#FFF8E1] to-[#E8F0FE] rounded-xl p-4">
                <p className="font-bold text-sm mb-2">What you&apos;ll get:</p>
                <ul className="text-sm font-semibold space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#34A853]" />
                    Automatic meeting transcription
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#34A853]" />
                    AI-generated meeting summaries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#34A853]" />
                    Auto-extracted action items
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#34A853]" />
                    Client meeting history tracking
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-[#AFAFAF]">FIREFLIES API KEY</label>
                <input
                  type="password"
                  className="w-full p-3 border-2 border-[#E5E5E5] rounded-xl font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                  placeholder="ff-api-..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-[#AFAFAF]">WEBHOOK URL (OPTIONAL)</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-[#E5E5E5] rounded-xl font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                  placeholder="https://your-app.com/api/fireflies/webhook"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFirefliesSetup(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFirefliesSetup(false)}
                  className="btn-primary btn-green flex-1 flex items-center justify-center gap-2"
                >
                  <Flame size={16} />
                  Connect Fireflies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
