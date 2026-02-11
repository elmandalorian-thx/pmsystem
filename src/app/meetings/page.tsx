'use client';

import { useState } from 'react';
import { meetings, clients } from '@/lib/data';
import { Mic, Calendar, Clock, CheckCircle2, ChevronDown, ChevronRight, ExternalLink, Settings, Search, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

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
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">Meetings</h1>
          <p className="text-muted-foreground font-semibold text-xs sm:text-sm mt-0.5">Transcripts, summaries, and action items</p>
        </div>
        <Button
          onClick={() => setShowFirefliesSetup(true)}
          size="sm"
          className="w-fit gap-1.5 rounded-xl"
        >
          <Flame size={15} />
          <span className="hidden sm:inline">Fireflies Settings</span>
          <span className="sm:hidden">Settings</span>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Meetings', value: meetings.length, color: '#4285F4', bg: '#E8F0FE' },
          { label: 'Total Minutes', value: totalMinutes, color: '#34A853', bg: '#E6F4EA' },
          { label: 'Action Items', value: totalActionItems, color: '#FBBC04', bg: '#FEF7E0' },
          { label: 'Clients Met', value: new Set(meetings.map(m => m.clientId)).size, color: '#EA4335', bg: '#FCE8E6' },
        ].map(stat => (
          <Card key={stat.label} className="glass-card !py-0 !gap-0 border-transparent">
            <CardContent className="!px-3 !py-3">
              <p className="text-lg sm:text-xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] sm:text-xs font-bold text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Fireflies Integration Banner */}
      <motion.div variants={item}>
        <Card className="!py-0 !gap-0 mb-4" style={{ background: 'linear-gradient(135deg, #FFF8E1 0%, #E8F0FE 100%)', border: '2px solid #FBBC04' }}>
          <CardContent className="!px-3 !py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🔥</span>
              <div>
                <p className="font-black text-xs sm:text-sm">Fireflies.ai Integration</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold">
                  Auto-transcribe and summarize client calls
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowFirefliesSetup(true)}
              variant="outline"
              size="xs"
              className="sm:ml-auto gap-1 rounded-lg"
            >
              <Settings size={12} />
              Configure
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full p-2.5 pl-9 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors bg-card"
          placeholder="Search meetings, summaries, action items..."
        />
      </motion.div>

      {/* Meeting List */}
      <div className="space-y-2">
        {filteredMeetings.map(meeting => {
          const client = clients.find(c => c.id === meeting.clientId);
          const clientIndex = client ? clients.indexOf(client) : 0;
          const isExpanded = expandedMeetings.has(meeting.id);
          const dateObj = new Date(meeting.date);

          return (
            <motion.div key={meeting.id} variants={item}>
              <Card className="glass-card !py-0 !gap-0 border-transparent">
                <CardContent className="!px-3 !py-3 sm:!px-4">
                  <button
                    onClick={() => toggleMeeting(meeting.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback
                          className="text-white font-bold text-[11px]"
                          style={{ background: AVATAR_COLORS[clientIndex % AVATAR_COLORS.length] }}
                        >
                          {client?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs truncate">{meeting.title}</h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold mt-0.5 whitespace-nowrap overflow-hidden">
                          <Calendar size={10} className="shrink-0" />
                          <span>{dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="text-border">·</span>
                          <Clock size={10} className="shrink-0" />
                          <span>{meeting.duration}m</span>
                          <span className="hidden sm:inline text-border">·</span>
                          <span className="hidden sm:inline truncate">{client?.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {meeting.firefliesId && (
                          <Badge variant="secondary" className="hidden sm:flex text-[9px]" style={{ background: '#FEF7E0', color: '#F9A825' }}>
                            🔥 Transcribed
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]" style={{ background: '#E6F4EA', color: '#34A853' }}>
                          {meeting.actionItems.length}
                        </Badge>
                        {isExpanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      <Separator />
                      {/* Summary */}
                      <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                          <Mic size={10} />
                          Meeting Summary
                        </h4>
                        <p className="text-xs font-semibold leading-relaxed bg-muted rounded-xl p-3">
                          {meeting.summary}
                        </p>
                      </div>

                      {/* Attendees */}
                      <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Attendees</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {meeting.attendees.map((attendee, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">
                              {attendee}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Items */}
                      <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          Action Items ({meeting.actionItems.length})
                        </h4>
                        <div className="space-y-1.5">
                          {meeting.actionItems.map((actionItem, i) => (
                            <div key={i} className="flex items-start gap-1.5 p-2 bg-muted rounded-xl">
                              <CheckCircle2 size={14} className="text-border shrink-0 mt-0.5" />
                              <span className="text-xs font-semibold">{actionItem}</span>
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
                              <p className="text-[10px] text-muted-foreground font-semibold">
                                ID: {meeting.firefliesId} &middot; Auto-transcribed
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="xs" className="sm:ml-auto gap-1 rounded-lg">
                            <ExternalLink size={10} />
                            View Transcript
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">🔍</p>
          <p className="font-bold text-xs text-muted-foreground">No meetings found</p>
          <p className="text-[10px] text-border font-semibold">Try adjusting your search</p>
        </div>
      )}

      {/* Fireflies Setup Modal */}
      {showFirefliesSetup && (
        <div className="modal-overlay" onClick={() => setShowFirefliesSetup(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-black mb-2">Fireflies.ai Setup</h2>
            <p className="text-xs text-muted-foreground font-semibold mb-4">
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
                <label className="block text-[10px] font-bold mb-1 text-muted-foreground">FIREFLIES API KEY</label>
                <input
                  type="password"
                  className="w-full p-2.5 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
                  placeholder="ff-api-..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1 text-muted-foreground">WEBHOOK URL (OPTIONAL)</label>
                <input
                  type="text"
                  className="w-full p-2.5 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
                  placeholder="https://your-app.com/api/fireflies/webhook"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-xs rounded-xl" onClick={() => setShowFirefliesSetup(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 text-xs rounded-xl bg-[#34A853] hover:bg-[#2D9649] gap-1.5" onClick={() => setShowFirefliesSetup(false)}>
                  <Flame size={14} />
                  Connect Fireflies
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
