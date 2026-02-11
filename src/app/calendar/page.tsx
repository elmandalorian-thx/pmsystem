'use client';

import { useState, useMemo } from 'react';
import { meetings, clients, getActiveProjects } from '@/lib/data';
import { ChevronLeft, ChevronRight, Calendar, Clock, ExternalLink, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isToday,
} from 'date-fns';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);

  const activeProjects = getActiveProjects();

  const events = useMemo(() => {
    const meetingEvents = meetings.map(m => ({
      id: m.id,
      title: m.title,
      date: parseISO(m.date),
      type: 'meeting' as const,
      color: '#4285F4',
      clientId: m.clientId,
      duration: m.duration,
    }));

    const deadlineEvents = activeProjects.map(p => ({
      id: `deadline-${p.id}`,
      title: `${p.title} — Deadline`,
      date: parseISO(p.endDate),
      type: 'deadline' as const,
      color: p.color,
      clientId: p.clientId,
      duration: 0,
    }));

    const taskEvents = activeProjects.flatMap(p =>
      p.tasks.map(t => ({
        id: t.id,
        title: t.title,
        date: parseISO(t.endDate),
        type: 'task' as const,
        color: p.color,
        clientId: p.clientId,
        duration: 0,
      }))
    );

    return [...meetingEvents, ...deadlineEvents, ...taskEvents];
  }, [activeProjects]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) =>
    events.filter(e => isSameDay(e.date, day));

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">Calendar</h1>
          <p className="text-muted-foreground font-semibold text-xs sm:text-sm mt-0.5">Meetings, deadlines, and tasks</p>
        </div>
        <Button
          onClick={() => setShowGoogleSetup(true)}
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-xl w-fit"
        >
          <Calendar size={14} />
          <span className="hidden sm:inline">Connect Google Calendar</span>
          <span className="sm:hidden">Google Cal</span>
        </Button>
      </motion.div>

      {/* Google Calendar Integration Banner */}
      <motion.div variants={item}>
        <Card className="glass-card !py-0 !gap-0 border-transparent mb-4">
          <CardContent className="!px-3 !py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E8F0FE] flex items-center justify-center">
                <Calendar size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-xs">Google Calendar</p>
                <p className="text-[10px] text-muted-foreground font-semibold">Sync your meetings and events</p>
              </div>
            </div>
            <div className="sm:ml-auto flex gap-1.5">
              <Badge variant="secondary" className="text-[10px]" style={{ background: '#FEF7E0', color: '#F9A825' }}>
                Setup Required
              </Badge>
              <Button
                onClick={() => setShowGoogleSetup(true)}
                variant="outline"
                size="xs"
                className="gap-1 rounded-lg"
              >
                <Settings size={10} />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar */}
      <motion.div variants={item}>
        <Card className="glass-card !py-0 !gap-0 border-transparent overflow-hidden">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="rounded-xl"
            >
              <ChevronLeft size={18} />
            </Button>
            <h2 className="text-base sm:text-lg font-black">{format(currentMonth, 'MMMM yyyy')}</h2>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="rounded-xl"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-1.5 sm:p-2 text-center text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);

              return (
                <div
                  key={i}
                  className={`min-h-[72px] sm:min-h-[100px] p-1 sm:p-1.5 border-b border-r border-border/40 transition-colors ${
                    !inMonth ? 'bg-muted/30' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-center mb-0.5">
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-bold ${
                        today
                          ? 'bg-primary text-white'
                          : !inMonth
                          ? 'text-muted-foreground/40'
                          : 'text-foreground'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-[8px] sm:text-[10px] font-bold px-1 py-px rounded-md truncate cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ background: event.color + '20', color: event.color }}
                        title={`${event.title}`}
                      >
                        {event.type === 'meeting' && '📅 '}
                        {event.type === 'deadline' && '🎯 '}
                        {event.type === 'task' && '✓ '}
                        <span className="hidden sm:inline">{event.title.length > 14 ? event.title.slice(0, 14) + '...' : event.title}</span>
                        <span className="sm:hidden">{event.title.slice(0, 6)}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[8px] font-bold text-muted-foreground text-center">
                        +{dayEvents.length - 2}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div variants={item} className="mt-4">
        <h2 className="text-sm font-black mb-3">Upcoming</h2>
        <div className="space-y-2">
          {events
            .filter(e => e.date >= new Date(2026, 1, 11))
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 6)
            .map(event => {
              const client = clients.find(c => c.id === event.clientId);
              return (
                <Card key={event.id} className="glass-card !py-0 !gap-0 border-transparent">
                  <CardContent className="!px-3 !py-2.5 flex items-center gap-2.5">
                    <div
                      className="w-1.5 h-8 rounded-full shrink-0"
                      style={{ background: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate">{event.title}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        {client?.company} &middot; {format(event.date, 'EEE, MMM d')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 capitalize text-[10px]"
                      style={{
                        background: event.type === 'meeting' ? '#E8F0FE'
                          : event.type === 'deadline' ? '#FCE8E6'
                          : '#E6F4EA',
                        color: event.type === 'meeting' ? '#4285F4'
                          : event.type === 'deadline' ? '#EA4335'
                          : '#34A853',
                      }}
                    >
                      {event.type}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </motion.div>

      {/* Google Calendar Setup Modal */}
      {showGoogleSetup && (
        <div className="modal-overlay" onClick={() => setShowGoogleSetup(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-black mb-3">Connect Google Calendar</h2>
            <div className="space-y-3">
              <div className="bg-[#E8F0FE] rounded-xl p-3">
                <p className="font-bold text-xs text-primary mb-2">How to connect:</p>
                <ol className="text-xs font-semibold text-foreground space-y-1.5">
                  <li className="flex gap-1.5">
                    <span className="bg-primary text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">1</span>
                    Go to Google Cloud Console and enable the Calendar API
                  </li>
                  <li className="flex gap-1.5">
                    <span className="bg-primary text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">2</span>
                    Create OAuth 2.0 credentials for your app
                  </li>
                  <li className="flex gap-1.5">
                    <span className="bg-primary text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">3</span>
                    Add your Client ID and Secret below
                  </li>
                </ol>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1 text-muted-foreground">GOOGLE CLIENT ID</label>
                <input
                  type="text"
                  className="w-full p-2.5 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
                  placeholder="your-client-id.apps.googleusercontent.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1 text-muted-foreground">CALENDAR ID</label>
                <input
                  type="text"
                  className="w-full p-2.5 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
                  placeholder="primary"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-xs rounded-xl" onClick={() => setShowGoogleSetup(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 text-xs rounded-xl bg-[#34A853] hover:bg-[#2D9649] gap-1.5" onClick={() => setShowGoogleSetup(false)}>
                  <ExternalLink size={14} />
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
