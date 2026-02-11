'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Project, KanbanColumn, COLUMN_TITLES, COLUMN_COLORS, PRIORITY_COLORS } from '@/lib/types';
import { getClientById } from '@/lib/data';
import { Clock, Flag, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface KanbanBoardProps {
  projects: Project[];
  onProjectsChange?: (projects: Project[]) => void;
}

const columns: KanbanColumn[] = ['todo', 'in-progress', 'review', 'done'];

export default function KanbanBoard({ projects, onProjectsChange }: KanbanBoardProps) {
  const [items, setItems] = useState(projects);

  const getColumnProjects = (status: KanbanColumn) =>
    items.filter(p => p.status === status);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as KanbanColumn;
    const updated = items.map(p =>
      p.id === draggableId ? { ...p, status: newStatus } : p
    );
    setItems(updated);
    onProjectsChange?.(updated);
  };

  const getProgress = (project: Project) => {
    if (project.tasks.length === 0) return 0;
    const done = project.tasks.filter(t => t.status === 'done').length;
    return Math.round((done / project.tasks.length) * 100);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {columns.map(col => (
          <div key={col} className="kanban-column">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: COLUMN_COLORS[col] }}
              />
              <h3 className="font-black text-xs uppercase tracking-wide">
                {COLUMN_TITLES[col]}
              </h3>
              <span className="ml-auto bg-white border-2 border-[#E5E5E5] rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold text-[#AFAFAF]">
                {getColumnProjects(col).length}
              </span>
            </div>

            <Droppable droppableId={col}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[180px] rounded-2xl transition-colors ${
                    snapshot.isDraggingOver ? 'bg-[#E8F0FE]' : ''
                  }`}
                >
                  {getColumnProjects(col).map((project, index) => {
                    const client = getClientById(project.clientId);
                    const progress = getProgress(project);
                    return (
                      <Draggable key={project.id} draggableId={project.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`duo-card mb-2 ${snapshot.isDragging ? '!shadow-lg rotate-2' : ''}`}
                          >
                            <div
                              className="w-full h-1.5 rounded-full mb-2"
                              style={{ background: project.color }}
                            />

                            <h4 className="font-bold text-xs mb-0.5">{project.title}</h4>

                            {client && (
                              <Link
                                href={`/clients/${client.id}`}
                                className="text-[10px] text-[#AFAFAF] font-semibold hover:text-[#4285F4] transition-colors flex items-center gap-0.5 mb-2"
                              >
                                {client.company}
                                <ChevronRight size={10} />
                              </Link>
                            )}

                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-1 text-[10px] text-[#AFAFAF]">
                                <Flag size={10} style={{ color: PRIORITY_COLORS[project.priority] }} />
                                <span className="font-semibold capitalize">{project.priority}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-[#AFAFAF]">
                                <Clock size={10} />
                                <span className="font-semibold">{project.tasks.length} tasks</span>
                              </div>
                            </div>

                            <div className="progress-bar !h-[6px]">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${progress}%`,
                                  background: project.color,
                                }}
                              />
                            </div>
                            <p className="text-[10px] font-bold text-[#AFAFAF] mt-0.5">{progress}%</p>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
