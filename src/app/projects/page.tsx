'use client';

import { useState } from 'react';
import { getActiveProjects } from '@/lib/data';
import KanbanBoard from '@/components/KanbanBoard';
import GanttChart from '@/components/GanttChart';
import AddProjectModal from '@/components/AddProjectModal';
import AddTaskModal from '@/components/AddTaskModal';
import { Plus, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function ProjectsPage() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const activeProjects = getActiveProjects();

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">Projects</h1>
          <p className="text-muted-foreground font-semibold text-xs sm:text-sm mt-0.5">Manage your projects and tasks</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddTask(true)}
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl"
          >
            <ListTodo size={15} />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Task</span>
          </Button>
          <Button
            onClick={() => setShowAddProject(true)}
            size="sm"
            className="gap-1.5 rounded-xl"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">Project</span>
          </Button>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <motion.div variants={item} className="mb-8">
        <KanbanBoard projects={activeProjects} />
      </motion.div>

      {/* Gantt Chart */}
      <motion.div variants={item}>
        <GanttChart projects={activeProjects} />
      </motion.div>

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
    </motion.div>
  );
}
