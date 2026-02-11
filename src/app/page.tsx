'use client';

import { useState } from 'react';
import { clients, meetings, getActiveProjectsByClient, getActiveProjects } from '@/lib/data';
import { Users, FolderKanban, CheckCircle2, Clock, Plus, ArrowRight, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import AddProjectModal from '@/components/AddProjectModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function Dashboard() {
  const [showAddProject, setShowAddProject] = useState(false);

  const activeClients = clients.filter(c => c.status === 'active');
  const activeProjects = getActiveProjects();
  const totalTasks = activeProjects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = activeProjects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'done').length, 0);
  const inProgressProjects = activeProjects.filter(p => p.status === 'in-progress').length;

  const stats = [
    { label: 'Active Clients', value: activeClients.length, icon: Users, color: '#4285F4', bg: '#E8F0FE', href: '/clients' },
    { label: 'Projects', value: activeProjects.length, icon: FolderKanban, color: '#34A853', bg: '#E6F4EA', href: '/projects' },
    { label: 'In Progress', value: inProgressProjects, icon: Clock, color: '#FBBC04', bg: '#FEF7E0', href: '/projects' },
    { label: 'Tasks Done', value: `${completedTasks}/${totalTasks}`, icon: CheckCircle2, color: '#EA4335', bg: '#FCE8E6', href: '/projects' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
            Dashboard
            <Sparkles size={20} className="text-primary" />
          </h1>
          <p className="text-muted-foreground font-semibold text-xs sm:text-sm mt-0.5">Welcome back! Here&apos;s your overview.</p>
        </div>
        <Button onClick={() => setShowAddProject(true)} size="sm" className="w-fit gap-1.5 rounded-xl">
          <Plus size={16} />
          New Project
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="glass-card group cursor-pointer !py-0 !gap-0 border-transparent hover:border-primary/20">
              <CardContent className="!px-3 !py-3 sm:!px-4 sm:!py-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: stat.bg }}
                  >
                    <stat.icon size={16} style={{ color: stat.color }} />
                  </div>
                  <TrendingUp size={12} style={{ color: stat.color }} className="ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-lg sm:text-xl font-black">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-bold">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* Active Clients */}
      <motion.div variants={item} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-black">Active Clients</h2>
          <Link href="/clients" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeClients.map((client, i) => {
            const clientProjects = getActiveProjectsByClient(client.id);
            const activeProjectCount = clientProjects.length;
            const totalClientTasks = clientProjects.reduce((a, p) => a + p.tasks.length, 0);
            const doneClientTasks = clientProjects.reduce((a, p) => a + p.tasks.filter(t => t.status === 'done').length, 0);
            const progress = totalClientTasks > 0 ? Math.round((doneClientTasks / totalClientTasks) * 100) : 0;
            return (
              <Link key={client.id} href={`/clients/${client.id}`} className="block group">
                <Card className="glass-card !py-0 !gap-0 border-transparent hover:border-primary/20 h-full">
                  <CardContent className="!px-3.5 !py-3.5 sm:!px-4 sm:!py-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <Avatar className="size-9">
                        <AvatarFallback
                          className="text-white font-bold text-xs"
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          {client.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{client.name}</p>
                        <p className="text-xs text-muted-foreground font-semibold truncate">{client.company}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mb-3">
                      <Badge variant="secondary" className="text-[10px] font-semibold" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                        {activeProjectCount} project{activeProjectCount !== 1 ? 's' : ''}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] font-semibold" style={{ background: '#E6F4EA', color: '#34A853' }}>
                        {totalClientTasks} tasks
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-[10px] font-bold text-muted-foreground">{progress}% complete</p>
                      <ArrowRight size={12} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Meetings */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-black">Recent Meetings</h2>
          <Link href="/meetings" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {meetings.slice(0, 4).map(meeting => {
            const client = clients.find(c => c.id === meeting.clientId);
            return (
              <Link key={meeting.id} href="/meetings" className="block">
                <Card className="glass-card !py-0 !gap-0 border-transparent hover:border-primary/20">
                  <CardContent className="!px-3 !py-2.5 flex items-center gap-2.5">
                    <Avatar className="size-8">
                      <AvatarFallback
                        className="text-white font-bold text-[11px]"
                        style={{ background: AVATAR_COLORS[clients.indexOf(client!) % AVATAR_COLORS.length] }}
                      >
                        {client?.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate">{meeting.title}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold truncate flex items-center gap-1">
                        <Calendar size={9} />
                        {client?.company} &middot; {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px] font-semibold" style={{ background: '#FEF7E0', color: '#F9A825' }}>
                      {meeting.actionItems.length} actions
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onAdd={(p) => console.log('New project:', p)}
        />
      )}
    </motion.div>
  );
}
