'use client';

import { useState, useMemo } from 'react';
import { meetings, clients, projects } from '@/lib/data';
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

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);

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

    const deadlineEvents = projects.map(p => ({
      id: `deadline-${p.id}`,
      title: `${p.title} — Deadline`,
      date: parseISO(p.endDate),
      type: 'deadline' as const,
      color: p.color,
      clientId: p.clientId,
      duration: 0,
    }));

    const taskEvents = projects.flatMap(p =>
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
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#3C3C3C]">Calendar</h1>
          <p className="text-[#AFAFAF] font-semibold mt-1">Meetings, deadlines, and tasks</p>
        </div>
        <button
          onClick={() => setShowGoogleSetup(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <Calendar size={18} />
          Connect Google Calendar
        </button>
      </div>

      {/* Google Calendar Integration Banner */}
      <div className="duo-card !p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] flex items-center justify-center">
            <Calendar size={20} className="text-[#4285F4]" />
          </div>
          <div>
            <p className="font-bold text-sm">Google Calendar</p>
            <p className="text-xs text-[#AFAFAF] font-semibold">Sync your meetings and events</p>
          </div>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <span className="badge" style={{ background: '#FEF7E0', color: '#F9A825' }}>
            Setup Required
          </span>
          <button
            onClick={() => setShowGoogleSetup(true)}
            className="badge cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
            style={{ background: '#E8F0FE', color: '#4285F4' }}
          >
            <Settings size={12} />
            Configure
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="duo-card !p-0 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b-2 border-[#E5E5E5]">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-[#F0F0F0] rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-black">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-[#F0F0F0] rounded-xl transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[#E5E5E5]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-xs font-bold text-[#AFAFAF] uppercase">
              {day}
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
                className={`min-h-[100px] sm:min-h-[120px] p-2 border-b border-r border-[#F0F0F0] transition-colors ${
                  !inMonth ? 'bg-[#FAFAFA]' : 'hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  <span
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
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

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => {
                    const client = clients.find(c => c.id === event.clientId);
                    return (
                      <div
                        key={event.id}
                        className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-lg truncate cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ background: event.color + '20', color: event.color }}
                        title={`${event.title}${client ? ` — ${client.company}` : ''}`}
                      >
                        {event.type === 'meeting' && '📅 '}
                        {event.type === 'deadline' && '🎯 '}
                        {event.type === 'task' && '✓ '}
                        <span className="hidden sm:inline">{event.title}</span>
                        <span className="sm:hidden">{event.title.slice(0, 8)}</span>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <p className="text-[10px] font-bold text-[#AFAFAF] text-center">
                      +{dayEvents.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-6">
        <h2 className="text-lg font-black mb-4">Upcoming</h2>
        <div className="space-y-3">
          {events
            .filter(e => e.date >= new Date(2026, 1, 11))
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 6)
            .map(event => {
              const client = clients.find(c => c.id === event.clientId);
              return (
                <div key={event.id} className="duo-card flex items-center gap-3 !p-4">
                  <div
                    className="w-2 h-10 rounded-full shrink-0"
                    style={{ background: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{event.title}</p>
                    <p className="text-xs text-[#AFAFAF] font-semibold">
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
            <h2 className="text-xl font-black mb-4">Connect Google Calendar</h2>
            <div className="space-y-4">
              <div className="bg-[#E8F0FE] rounded-xl p-4">
                <p className="font-bold text-[#4285F4] mb-2">How to connect:</p>
                <ol className="text-sm font-semibold text-[#3C3C3C] space-y-2">
                  <li className="flex gap-2">
                    <span className="bg-[#4285F4] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    Go to Google Cloud Console and enable the Calendar API
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-[#4285F4] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    Create OAuth 2.0 credentials for your app
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-[#4285F4] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    Add your Client ID and Secret below
                  </li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-[#AFAFAF]">GOOGLE CLIENT ID</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-[#E5E5E5] rounded-xl font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                  placeholder="your-client-id.apps.googleusercontent.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-[#AFAFAF]">CALENDAR ID</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-[#E5E5E5] rounded-xl font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                  placeholder="primary"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowGoogleSetup(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowGoogleSetup(false)}
                  className="btn-primary btn-green flex-1 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} />
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
