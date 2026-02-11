'use client';

import { useState, useMemo } from 'react';
import { meetings, clients, getActiveProjects } from '@/lib/data';
import { ChevronLeft, ChevronRight, Calendar, Clock, ExternalLink, Settings } from 'lucide-react';
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

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);

  const activeProjects = getActiveProjects();

  // Combine meetings and project deadlines into calendar events
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
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3C3C3C]">Calendar</h1>
          <p className="text-[#AFAFAF] font-semibold text-xs sm:text-sm mt-0.5">Meetings, deadlines, and tasks</p>
        </div>
        <button
          onClick={() => setShowGoogleSetup(true)}
          className="btn-secondary flex items-center gap-1.5 !text-xs !py-2 !px-3"
        >
          <Calendar size={14} />
          <span className="hidden sm:inline">Connect Google Calendar</span>
          <span className="sm:hidden">Google Cal</span>
        </button>
      </div>

      {/* Google Calendar Integration Banner */}
      <div className="duo-card !p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E8F0FE] flex items-center justify-center">
            <Calendar size={16} className="text-[#4285F4]" />
          </div>
          <div>
            <p className="font-bold text-xs">Google Calendar</p>
            <p className="text-[10px] text-[#AFAFAF] font-semibold">Sync your meetings and events</p>
          </div>
        </div>
        <div className="sm:ml-auto flex gap-1.5">
          <span className="badge" style={{ background: '#FEF7E0', color: '#F9A825' }}>
            Setup Required
          </span>
          <button
            onClick={() => setShowGoogleSetup(true)}
            className="badge cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
            style={{ background: '#E8F0FE', color: '#4285F4' }}
          >
            <Settings size={10} />
            Configure
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="duo-card !p-0 overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b-2 border-[#E5E5E5]">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-[#F0F0F0] rounded-xl transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-base sm:text-lg font-black">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-[#F0F0F0] rounded-xl transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[#E5E5E5]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-1.5 sm:p-2 text-center text-[9px] sm:text-[10px] font-bold text-[#AFAFAF] uppercase">
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
                className={`min-h-[72px] sm:min-h-[100px] p-1 sm:p-1.5 border-b border-r border-[#F0F0F0] transition-colors ${
                  !inMonth ? 'bg-[#FAFAFA]' : 'hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center justify-center mb-0.5">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-bold ${
                      today
                        ? 'bg-[#4285F4] text-white'
                        : !inMonth
                        ? 'text-[#D0D0D0]'
                        : 'text-[#3C3C3C]'
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
                    <p className="text-[8px] font-bold text-[#AFAFAF] text-center">
                      +{dayEvents.length - 2}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-4">
        <h2 className="text-sm font-black mb-3">Upcoming</h2>
        <div className="space-y-2">
          {events
            .filter(e => e.date >= new Date(2026, 1, 11))
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 6)
            .map(event => {
              const client = clients.find(c => c.id === event.clientId);
              return (
                <div key={event.id} className="duo-card flex items-center gap-2.5 !p-3">
                  <div
                    className="w-1.5 h-8 rounded-full shrink-0"
                    style={{ background: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate">{event.title}</p>
                    <p className="text-[10px] text-[#AFAFAF] font-semibold">
                      {client?.company} &middot; {format(event.date, 'EEE, MMM d')}
                    </p>
                  </div>
                  <span
                    className="badge shrink-0 capitalize"
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
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Google Calendar Setup Modal */}
      {showGoogleSetup && (
        <div className="modal-overlay" onClick={() => setShowGoogleSetup(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-black mb-3">Connect Google Calendar</h2>
            <div className="space-y-3">
              <div className="bg-[#E8F0FE] rounded-xl p-3">
                <p className="font-bold text-xs text-[#4285F4] mb-2">How to connect:</p>
                <ol className="text-xs font-semibold text-[#3C3C3C] space-y-1.5">
                  <li className="flex gap-1.5">
                    <span className="bg-[#4285F4] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">1</span>
                    Go to Google Cloud Console and enable the Calendar API
                  </li>
                  <li className="flex gap-1.5">
                    <span className="bg-[#4285F4] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">2</span>
                    Create OAuth 2.0 credentials for your app
                  </li>
                  <li className="flex gap-1.5">
                    <span className="bg-[#4285F4] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">3</span>
                    Add your Client ID and Secret below
                  </li>
                </ol>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">GOOGLE CLIENT ID</label>
                <input
                  type="text"
                  className="w-full p-2.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                  placeholder="your-client-id.apps.googleusercontent.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">CALENDAR ID</label>
                <input
                  type="text"
                  className="w-full p-2.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                  placeholder="primary"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowGoogleSetup(false)}
                  className="btn-secondary flex-1 !text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowGoogleSetup(false)}
                  className="btn-primary btn-green flex-1 flex items-center justify-center gap-1.5 !text-xs"
                >
                  <ExternalLink size={14} />
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
