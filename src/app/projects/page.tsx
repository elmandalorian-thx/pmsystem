'use client';

import { useState } from 'react';
import { projects } from '@/lib/data';
import KanbanBoard from '@/components/KanbanBoard';
import GanttChart from '@/components/GanttChart';
import AddProjectModal from '@/components/AddProjectModal';
import AddTaskModal from '@/components/AddTaskModal';
import { Plus, ListTodo } from 'lucide-react';

export default function ProjectsPage() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#3C3C3C]">Projects</h1>
          <p className="text-[#AFAFAF] font-semibold mt-1">Manage your projects and tasks</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddTask(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <ListTodo size={18} />
            Add Task
          </button>
          <button
            onClick={() => setShowAddProject(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="mb-10">
        <KanbanBoard projects={projects} />
      </div>

      {/* Gantt Chart */}
      <GanttChart projects={projects} />

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
