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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3C3C3C]">Meetings</h1>
          <p className="text-[#AFAFAF] font-semibold text-xs sm:text-sm mt-0.5">Transcripts, summaries, and action items</p>
        </div>
        <button
          onClick={() => setShowFirefliesSetup(true)}
          className="btn-primary flex items-center gap-1.5 w-fit !text-xs"
        >
          <Flame size={15} />
          <span className="hidden sm:inline">Fireflies Settings</span>
          <span className="sm:hidden">Settings</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Meetings', value: meetings.length, color: '#4285F4', bg: '#E8F0FE' },
          { label: 'Total Minutes', value: totalMinutes, color: '#34A853', bg: '#E6F4EA' },
          { label: 'Action Items', value: totalActionItems, color: '#FBBC04', bg: '#FEF7E0' },
          { label: 'Clients Met', value: new Set(meetings.map(m => m.clientId)).size, color: '#EA4335', bg: '#FCE8E6' },
        ].map(stat => (
          <div key={stat.label} className="duo-card !p-3 stat-card">
            <p className="text-lg sm:text-xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[10px] sm:text-xs font-bold text-[#AFAFAF]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Fireflies Integration Banner */}
      <div className="duo-card !p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2"
        style={{ background: 'linear-gradient(135deg, #FFF8E1 0%, #E8F0FE 100%)', border: '2px solid #FBBC04' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🔥</span>
          <div>
            <p className="font-black text-xs sm:text-sm">Fireflies.ai Integration</p>
            <p className="text-[10px] sm:text-xs text-[#AFAFAF] font-semibold">
              Auto-transcribe and summarize client calls
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowFirefliesSetup(true)}
          className="sm:ml-auto btn-secondary flex items-center gap-1.5 !py-1.5 !px-3 !text-[10px] sm:!text-xs"
        >
          <Settings size={12} />
          Configure
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFAFAF]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full p-2.5 pl-9 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
          placeholder="Search meetings, summaries, action items..."
        />
      </div>

      {/* Meeting List */}
      <div className="space-y-2">
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
                <div className="flex items-center gap-2">
                  <div
                    className="avatar shrink-0"
                    style={{
                      background: AVATAR_COLORS[clientIndex % AVATAR_COLORS.length],
                      width: 34,
                      height: 34,
                      fontSize: 12,
                    }}
                  >
                    {client?.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs">{meeting.title}</h3>
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-[#AFAFAF] font-semibold mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Calendar size={10} />
                        {new Date(meeting.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock size={10} />
                        {meeting.duration} min
                      </span>
                      <span className="hidden sm:inline">{client?.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {meeting.firefliesId && (
                      <span className="badge hidden sm:flex" style={{ background: '#FEF7E0', color: '#F9A825' }}>
                        🔥 Transcribed
                      </span>
                    )}
                    <span className="badge" style={{ background: '#E6F4EA', color: '#34A853' }}>
                      {meeting.actionItems.length} actions
                    </span>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-3 space-y-3 border-t-2 border-[#F0F0F0] pt-3">
                  {/* Summary */}
                  <div>
                    <h4 className="text-[10px] font-bold text-[#AFAFAF] uppercase mb-1 flex items-center gap-1">
                      <Mic size={10} />
                      Meeting Summary
                    </h4>
                    <p className="text-xs font-semibold leading-relaxed bg-[#FAFAFA] rounded-xl p-3">
                      {meeting.summary}
                    </p>
                  </div>

                  {/* Attendees */}
                  <div>
                    <h4 className="text-[10px] font-bold text-[#AFAFAF] uppercase mb-1">Attendees</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {meeting.attendees.map((attendee, i) => (
                        <span key={i} className="badge" style={{ background: '#F0F0F0', color: '#3C3C3C' }}>
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Items */}
                  <div>
                    <h4 className="text-[10px] font-bold text-[#AFAFAF] uppercase mb-1">
                      Action Items ({meeting.actionItems.length})
                    </h4>
                    <div className="space-y-1.5">
                      {meeting.actionItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5 p-2 bg-[#FAFAFA] rounded-xl">
                          <CheckCircle2 size={14} className="text-[#E5E5E5] shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fireflies data */}
                  {meeting.firefliesId && (
                    <div className="bg-gradient-to-r from-[#FFF8E1] to-[#E8F0FE] rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔥</span>
                        <div>
                          <p className="font-bold text-xs">Fireflies.ai Transcript</p>
                          <p className="text-[10px] text-[#AFAFAF] font-semibold">
                            ID: {meeting.firefliesId} &middot; Auto-transcribed
                          </p>
                        </div>
                      </div>
                      <button className="sm:ml-auto btn-secondary !py-1 !px-2.5 !text-[10px] flex items-center gap-1">
                        <ExternalLink size={10} />
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
        <div className="text-center py-10">
          <p className="text-3xl mb-2">🔍</p>
          <p className="font-bold text-xs text-[#AFAFAF]">No meetings found</p>
          <p className="text-[10px] text-[#D0D0D0] font-semibold">Try adjusting your search</p>
        </div>
      )}

      {/* Fireflies Setup Modal */}
      {showFirefliesSetup && (
        <div className="modal-overlay" onClick={() => setShowFirefliesSetup(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-black mb-2">Fireflies.ai Setup</h2>
            <p className="text-xs text-[#AFAFAF] font-semibold mb-4">
              Connect your Fireflies account to auto-import meeting transcripts and summaries.
            </p>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-[#FFF8E1] to-[#E8F0FE] rounded-xl p-3">
                <p className="font-bold text-xs mb-2">What you&apos;ll get:</p>
                <ul className="text-xs font-semibold space-y-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#34A853]" />
                    Automatic meeting transcription
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#34A853]" />
                    AI-generated meeting summaries
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#34A853]" />
                    Auto-extracted action items
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#34A853]" />
                    Client meeting history tracking
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">FIREFLIES API KEY</label>
                <input
                  type="password"
                  className="w-full p-2.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                  placeholder="ff-api-..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">WEBHOOK URL (OPTIONAL)</label>
                <input
                  type="text"
                  className="w-full p-2.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                  placeholder="https://your-app.com/api/fireflies/webhook"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFirefliesSetup(false)}
                  className="btn-secondary flex-1 !text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFirefliesSetup(false)}
                  className="btn-primary btn-green flex-1 flex items-center justify-center gap-1.5 !text-xs"
                >
                  <Flame size={14} />
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
