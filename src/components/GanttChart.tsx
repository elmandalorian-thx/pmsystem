'use client';

import { useState, useMemo } from 'react';
import { Project } from '@/lib/types';
import { getClientById } from '@/lib/data';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { differenceInDays, parseISO, format, eachWeekOfInterval, startOfWeek, addDays } from 'date-fns';

interface GanttChartProps {
  projects: Project[];
}

export default function GanttChart({ projects }: GanttChartProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (id: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { chartStart, chartEnd, totalDays, weeks } = useMemo(() => {
    const allDates = projects.flatMap(p => [
      parseISO(p.startDate),
      parseISO(p.endDate),
      ...p.tasks.flatMap(t => [parseISO(t.startDate), parseISO(t.endDate)]),
    ]);
    const min = new Date(Math.min(...allDates.map(d => d.getTime())));
    const max = new Date(Math.max(...allDates.map(d => d.getTime())));
    const chartStart = startOfWeek(addDays(min, -7));
    const chartEnd = addDays(max, 14);
    const totalDays = differenceInDays(chartEnd, chartStart);
    const weeks = eachWeekOfInterval({ start: chartStart, end: chartEnd });
    return { chartStart, chartEnd, totalDays, weeks };
  }, [projects]);

  const getBarStyle = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const left = (differenceInDays(start, chartStart) / totalDays) * 100;
    const width = (differenceInDays(end, start) / totalDays) * 100;
    return { left: `${Math.max(0, left)}%`, width: `${Math.max(1, width)}%` };
  };

  const today = new Date();
  const todayPosition = (differenceInDays(today, chartStart) / totalDays) * 100;

  return (
    <div className="duo-card !p-0 overflow-hidden">
      <div className="p-5 border-b-2 border-[#E5E5E5]">
        <h3 className="font-black text-lg">Timeline</h3>
        <p className="text-sm text-[#AFAFAF] font-semibold">Project and task schedule overview</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header with weeks */}
          <div className="flex border-b-2 border-[#E5E5E5]">
            <div className="w-[250px] shrink-0 p-3 bg-[#FAFAFA] border-r-2 border-[#E5E5E5]">
              <span className="text-xs font-bold text-[#AFAFAF] uppercase">Project / Task</span>
            </div>
            <div className="flex-1 relative">
              <div className="flex">
                {weeks.map((week, i) => (
                  <div
                    key={i}
                    className="flex-1 p-2 text-center border-r border-[#F0F0F0] min-w-[80px]"
                  >
                    <span className="text-[10px] font-bold text-[#AFAFAF] uppercase">
                      {format(week, 'MMM d')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rows */}
          {projects.map(project => {
            const client = getClientById(project.clientId);
            const isExpanded = expandedProjects.has(project.id);

            return (
              <div key={project.id}>
                {/* Project row */}
                <div className="flex border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors">
                  <div className="w-[250px] shrink-0 p-3 border-r-2 border-[#E5E5E5] flex items-center gap-2">
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="p-1 hover:bg-[#E5E5E5] rounded-lg transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: project.color }}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{project.title}</p>
                      <p className="text-[10px] text-[#AFAFAF] font-semibold truncate">
                        {client?.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 relative py-3 px-2">
                    {/* Today marker */}
                    {todayPosition > 0 && todayPosition < 100 && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-[#EA4335] z-10"
                        style={{ left: `${todayPosition}%` }}
                      >
                        <div className="absolute -top-0 left-1/2 -translate-x-1/2 bg-[#EA4335] text-white text-[8px] font-bold px-1 rounded">
                          TODAY
                        </div>
                      </div>
                    )}
                    <div
                      className="gantt-bar absolute"
                      style={{
                        ...getBarStyle(project.startDate, project.endDate),
                        background: project.color,
                        opacity: 0.9,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <span className="text-[10px] text-white font-bold px-2 leading-[32px] truncate block">
                        {project.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task rows */}
                {isExpanded && project.tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex border-b border-[#F0F0F0] bg-[#FAFAFA] hover:bg-[#F0F0F0] transition-colors"
                  >
                    <div className="w-[250px] shrink-0 p-3 pl-12 border-r-2 border-[#E5E5E5] flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          background: task.status === 'done' ? '#34A853'
                            : task.status === 'in-progress' ? '#FBBC04'
                            : task.status === 'review' ? '#EA4335'
                            : '#AFAFAF',
                        }}
                      />
                      <p className="text-sm font-semibold truncate">{task.title}</p>
                    </div>
                    <div className="flex-1 relative py-3 px-2">
                      <div
                        className="gantt-bar absolute"
                        style={{
                          ...getBarStyle(task.startDate, task.endDate),
                          background: task.status === 'done' ? '#34A853'
                            : task.status === 'in-progress' ? '#FBBC04'
                            : task.status === 'review' ? '#EA4335'
                            : '#AFAFAF',
                          opacity: 0.7,
                          height: 24,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      >
                        <span className="text-[9px] text-white font-bold px-2 leading-[24px] truncate block">
                          {task.title}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
