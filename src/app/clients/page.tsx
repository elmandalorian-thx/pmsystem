'use client';

import { clients, getActiveProjectsByClient, getMeetingsByClient } from '@/lib/data';
import { Mail, Phone, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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

export default function ClientsPage() {
  const activeClients = clients.filter(c => c.status === 'active');

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">Clients</h1>
          <p className="text-muted-foreground font-semibold text-xs sm:text-sm mt-0.5">{activeClients.length} active clients</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {activeClients.slice(0, 4).map((c, i) => (
              <Avatar key={c.id} className="size-8 border-2 border-white">
                <AvatarFallback
                  className="text-white font-bold text-[11px]"
                  style={{ background: AVATAR_COLORS[i] }}
                >
                  {c.avatar}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          {activeClients.length > 4 && (
            <span className="text-xs font-bold text-muted-foreground">+{activeClients.length - 4}</span>
          )}
        </div>
      </motion.div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {clients.map((client, i) => {
          const clientProjects = getActiveProjectsByClient(client.id);
          const clientMeetings = getMeetingsByClient(client.id);
          const activeProjectCount = clientProjects.length;
          const totalTasks = clientProjects.reduce((a, p) => a + p.tasks.length, 0);
          const doneTasks = clientProjects.reduce((a, p) => a + p.tasks.filter(t => t.status === 'done').length, 0);
          const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

          return (
            <motion.div key={client.id} variants={item}>
              <Link href={`/clients/${client.id}`} className="block group">
                <Card className="glass-card !py-0 !gap-0 border-transparent hover:border-primary/20 h-full">
                  <CardContent className="!px-3.5 !py-3.5 sm:!px-4 sm:!py-4">
                    {/* Client header */}
                    <div className="flex items-start gap-2.5 mb-3">
                      <Avatar className="size-9">
                        <AvatarFallback
                          className="text-white font-bold text-xs"
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          {client.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-sm truncate">{client.name}</p>
                          <Badge variant="secondary" className="ml-auto text-[10px]"
                            style={{
                              background: client.status === 'active' ? '#E6F4EA' : '#F0F0F0',
                              color: client.status === 'active' ? '#34A853' : '#AFAFAF',
                            }}
                          >
                            {client.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                          <Building2 size={12} />
                          {client.company}
                        </div>
                      </div>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-0.5 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail size={12} />
                        <span className="font-semibold truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone size={12} />
                        <span className="font-semibold">{client.phone}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-1.5 mb-2.5">
                      <Badge variant="secondary" className="text-[10px]" style={{ background: '#E8F0FE', color: '#4285F4' }}>
                        {activeProjectCount} projects
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]" style={{ background: '#FEF7E0', color: '#F9A825' }}>
                        {clientMeetings.length} meetings
                      </Badge>
                    </div>

                    {/* Progress */}
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] font-bold text-muted-foreground">{progress}% tasks complete</p>
                      <ArrowRight
                        size={14}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
