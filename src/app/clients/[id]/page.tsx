'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getClientById, getActiveProjectsByClient, getPastProjectsByClient, getMeetingsByClient, clients } from '@/lib/data';
import { Mail, Phone, Building2, Calendar, ArrowLeft, Plus, Clock, Flag, CheckCircle2, Mic, ChevronDown, ChevronRight, FolderCheck, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import AddProjectModal from '@/components/AddProjectModal';
import { PRIORITY_COLORS, Meeting } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#8E24AA'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const client = getClientById(clientId);
  const activeProjects = getActiveProjectsByClient(clientId);
  const pastProjects = getPastProjectsByClient(clientId);
  const clientMeetings = getMeetingsByClient(clientId);
  const [showAddProject, setShowAddProject] = useState(false);
  const [expandedMeetings, setExpandedMeetings] = useState<Set<string>>(new Set());
  const [pastProjectsOpen, setPastProjectsOpen] = useState(false);
  const [projectFromMeeting, setProjectFromMeeting] = useState<Meeting | null>(null);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-lg font-black mb-2">Client not found</h2>
          <Link href="/clients" className="text-primary font-bold text-sm hover:underline">
            Back to clients
          </Link>
        </div>
      </div>
    );
  }

  const clientIndex = clients.indexOf(client);
  const allProjects = [...activeProjects, ...pastProjects];
  const totalTasks = allProjects.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = allProjects.reduce((a, p) => a + p.tasks.filter(t => t.status === 'done').length, 0);

  const toggleMeeting = (id: string) => {
    setExpandedMeetings(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Back button */}
      <motion.div variants={item}>
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-muted-foreground font-bold text-xs mb-4 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Clients
        </Link>
      </motion.div>

      {/* Client Header */}
      <motion.div variants={item}>
        <Card className="glass-card !py-0 !gap-0 border-transparent mb-4">
          <CardContent className="!px-4 !py-4 sm:!px-5">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Avatar className="size-12">
                <AvatarFallback
                  className="text-white font-black text-lg"
                  style={{ background: AVATAR_COLORS[clientIndex % AVATAR_COLORS.length] }}
                >
                  {client.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5">
                  <h1 className="text-lg sm:text-xl font-black truncate">{client.name}</h1>
                  <Badge variant="secondary" className="w-fit text-[10px]" style={{ background: '#E6F4EA', color: '#34A853' }}>
                    {client.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1"><Building2 size={12} /> {client.company}</span>
                  <span className="flex items-center gap-1"><Mail size={12} /> {client.email}</span>
                  <span className="hidden sm:flex items-center gap-1"><Phone size={12} /> {client.phone}</span>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-3 mt-2 sm:mt-0">
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-black text-primary">{activeProjects.length}</p>
                  <p className="text-[10px] font-bold text-muted-foreground">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-black text-[#34A853]">{doneTasks}/{totalTasks}</p>
                  <p className="text-[10px] font-bold text-muted-foreground">Tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-black text-[#FBBC04]">{clientMeetings.length}</p>
                  <p className="text-[10px] font-bold text-muted-foreground">Meetings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item}>
        <Tabs defaultValue="projects">
          <TabsList className="mb-4 w-fit">
            <TabsTrigger value="projects" className="gap-1.5 text-xs">
              <FolderCheck size={14} />
              Projects ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="meetings" className="gap-1.5 text-xs">
              <Mic size={14} />
              Meetings ({clientMeetings.length})
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black">Active Projects</h2>
              <Button size="xs" className="gap-1 rounded-lg" onClick={() => setShowAddProject(true)}>
                <Plus size={14} />
                Add Project
              </Button>
            </div>
            <div className="space-y-3">
              {activeProjects.map(project => {
                const progress = project.tasks.length > 0
                  ? Math.round((project.tasks.filter(t => t.status === 'done').length / project.tasks.length) * 100)
                  : 0;
                return (
                  <Card key={project.id} className="glass-card !py-0 !gap-0 border-transparent">
                    <CardContent className="!px-4 !py-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: project.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm">{project.title}</h3>
                          <p className="text-xs text-muted-foreground font-semibold truncate">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[10px]">
                            <Flag size={10} style={{ color: PRIORITY_COLORS[project.priority] }} />
                            <span className="font-bold capitalize">{project.priority}</span>
                          </div>
                          <Badge variant="secondary" className="capitalize text-[10px]"
                            style={{
                              background: project.status === 'done' ? '#E6F4EA'
                                : project.status === 'in-progress' ? '#FEF7E0'
                                : project.status === 'review' ? '#FCE8E6'
                                : '#F0F0F0',
                              color: project.status === 'done' ? '#34A853'
                                : project.status === 'in-progress' ? '#F9A825'
                                : project.status === 'review' ? '#EA4335'
                                : '#AFAFAF',
                            }}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Task list */}
                      <div className="space-y-0.5 mb-2">
                        {project.tasks.map(task => (
                          <div
                            key={task.id}
                            className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <CheckCircle2
                              size={15}
                              style={{ color: task.status === 'done' ? '#34A853' : '#E5E5E5' }}
                            />
                            <span className={`flex-1 text-xs font-semibold ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock size={10} />
                              <span className="font-semibold hidden sm:inline">
                                {new Date(task.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <Progress value={progress} className="h-1.5" />
                      <div className="flex justify-between mt-1">
                        <p className="text-[10px] font-bold text-muted-foreground">{progress}% complete</p>
                        <p className="text-[10px] font-bold text-muted-foreground">
                          <Calendar size={9} className="inline mr-0.5" />
                          Due {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Past Projects Collapsible */}
            {pastProjects.length > 0 && (
              <Collapsible open={pastProjectsOpen} onOpenChange={setPastProjectsOpen} className="mt-4">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center gap-2 p-3 bg-card border-2 border-border rounded-xl hover:bg-muted transition-colors">
                    <FolderCheck size={16} className="text-[#34A853]" />
                    <span className="text-xs font-black flex-1 text-left">
                      Past Projects ({pastProjects.length})
                    </span>
                    {pastProjectsOpen
                      ? <ChevronDown size={16} className="text-muted-foreground" />
                      : <ChevronRight size={16} className="text-muted-foreground" />
                    }
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 space-y-1.5">
                    {pastProjects.map(project => (
                      <div
                        key={project.id}
                        className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors"
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: project.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{project.title}</p>
                          <p className="text-[10px] text-muted-foreground font-semibold truncate">{project.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant="secondary" className="text-[9px]" style={{ background: '#E6F4EA', color: '#34A853' }}>
                            Completed
                          </Badge>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                            {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black">Meeting History</h2>
              <Badge variant="secondary" className="text-[10px]" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                Powered by Fireflies.ai
              </Badge>
            </div>
            <div className="space-y-2">
              {clientMeetings.map(meeting => {
                const isExpanded = expandedMeetings.has(meeting.id);
                return (
                  <Card key={meeting.id} className="glass-card !py-0 !gap-0 border-transparent">
                    <CardContent className="!px-3.5 !py-3">
                      <button
                        onClick={() => toggleMeeting(meeting.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                          <Mic size={15} className="text-primary" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xs">{meeting.title}</h3>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold mt-0.5 whitespace-nowrap">
                              <Calendar size={10} />
                              <span>{new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              <span className="text-border">·</span>
                              <Clock size={10} />
                              <span>{meeting.duration}m</span>
                            </div>
                          </div>
                          {meeting.firefliesId && (
                            <Badge variant="secondary" className="shrink-0 text-[9px] hidden sm:flex" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                              🔥 Fireflies
                            </Badge>
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-3 pl-4 sm:pl-8 space-y-3">
                          <Separator />
                          <div>
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Summary</h4>
                            <p className="text-xs font-semibold leading-relaxed bg-muted rounded-xl p-2.5">
                              {meeting.summary}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Action Items</h4>
                            <div className="space-y-1">
                              {meeting.actionItems.map((actionItem, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs font-semibold">
                                  <CheckCircle2 size={13} className="text-border shrink-0" />
                                  {actionItem}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Create Project from Meeting */}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectFromMeeting(meeting);
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
                          >
                            <FolderKanban size={14} />
                            Create Project from Meeting
                            <Badge variant="secondary" className="ml-auto text-[9px]" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                              {meeting.actionItems.length} tasks
                            </Badge>
                          </Button>

                          {meeting.firefliesId && (
                            <div className="bg-[#E8F0FE] rounded-xl p-2.5 flex items-center gap-2">
                              <span className="text-base">🔥</span>
                              <div>
                                <p className="text-xs font-bold text-primary">View transcript on Fireflies</p>
                                <p className="text-[10px] text-muted-foreground font-semibold">ID: {meeting.firefliesId}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Create Project from Meeting Modal */}
      {projectFromMeeting && (
        <AddProjectModal
          onClose={() => setProjectFromMeeting(null)}
          onAdd={(p) => console.log('New project from meeting:', p)}
          preselectedClientId={projectFromMeeting.clientId}
          prefilledTitle={projectFromMeeting.title.replace(/Meeting|Call|Sync|Review/gi, '').trim() + ' — Follow-up'}
          prefilledDescription={projectFromMeeting.summary}
          meetingActionItems={projectFromMeeting.actionItems}
          meetingSource={projectFromMeeting.title}
        />
      )}

      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onAdd={(p) => console.log('New project:', p)}
          preselectedClientId={clientId}
        />
      )}
    </motion.div>
  );
}
