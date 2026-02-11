'use client';

import { useState } from 'react';
import { getActiveProjects } from '@/lib/data';
import KanbanBoard from '@/components/KanbanBoard';
import GanttChart from '@/components/GanttChart';
import AddProjectModal from '@/components/AddProjectModal';
import AddTaskModal from '@/components/AddTaskModal';
import { Plus, ListTodo } from 'lucide-react';

export default function ProjectsPage() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const activeProjects = getActiveProjects();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3C3C3C]">Projects</h1>
          <p className="text-[#AFAFAF] font-semibold text-xs sm:text-sm mt-0.5">Manage your projects and tasks</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddTask(true)}
            className="btn-secondary flex items-center gap-1.5 !py-2 !px-3 !text-xs"
          >
            <ListTodo size={15} />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Task</span>
          </button>
          <button
            onClick={() => setShowAddProject(true)}
            className="btn-primary flex items-center gap-1.5 !py-2 !px-3 !text-xs"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">Project</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="mb-8">
        <KanbanBoard projects={activeProjects} />
      </div>

      {/* Gantt Chart */}
      <GanttChart projects={activeProjects} />

      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onAdd={(p) => console.log('New project:', p)}
        />
      )}

      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAdd={(t) => console.log('New task:', t)}
        />
      )}
    </div>
  );
}
