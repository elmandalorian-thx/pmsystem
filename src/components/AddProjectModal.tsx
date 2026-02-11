'use client';

import { useState } from 'react';
import { X, Flame, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { clients } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AddProjectModalProps {
  onClose: () => void;
  onAdd: (project: {
    title: string;
    description: string;
    clientId: string;
    priority: string;
    startDate: string;
    endDate: string;
    tasks?: string[];
  }) => void;
  preselectedClientId?: string;
  prefilledTitle?: string;
  prefilledDescription?: string;
  meetingActionItems?: string[];
  meetingSource?: string;
}

export default function AddProjectModal({
  onClose,
  onAdd,
  preselectedClientId,
  prefilledTitle,
  prefilledDescription,
  meetingActionItems,
  meetingSource,
}: AddProjectModalProps) {
  const [title, setTitle] = useState(prefilledTitle || '');
  const [description, setDescription] = useState(prefilledDescription || '');
  const [clientId, setClientId] = useState(preselectedClientId || '');
  const [priority, setPriority] = useState('medium');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedActions, setSelectedActions] = useState<Set<number>>(
    new Set(meetingActionItems?.map((_, i) => i) || [])
  );
  const [customTasks, setCustomTasks] = useState<string[]>([]);
  const [newTaskInput, setNewTaskInput] = useState('');

  const isFromMeeting = !!meetingActionItems;

  const toggleAction = (index: number) => {
    setSelectedActions(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const addCustomTask = () => {
    if (!newTaskInput.trim()) return;
    setCustomTasks(prev => [...prev, newTaskInput.trim()]);
    setNewTaskInput('');
  };

  const removeCustomTask = (index: number) => {
    setCustomTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientId || !startDate || !endDate) return;
    const tasks: string[] = [];
    if (meetingActionItems) {
      meetingActionItems.forEach((item, i) => {
        if (selectedActions.has(i)) tasks.push(item);
      });
    }
    tasks.push(...customTasks);
    onAdd({ title, description, clientId, priority, startDate, endDate, tasks: tasks.length > 0 ? tasks : undefined });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black">
              {isFromMeeting ? 'Create Project from Meeting' : 'New Project'}
            </h2>
            {meetingSource && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Flame size={12} className="text-[#F9A825]" />
                <p className="text-[10px] text-muted-foreground font-semibold">
                  From: {meetingSource}
                </p>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[10px] font-bold mb-1 text-muted-foreground">PROJECT NAME</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Website Redesign"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold mb-1 text-muted-foreground">DESCRIPTION</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors resize-none"
              rows={2}
              placeholder="Brief project description..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold mb-1 text-muted-foreground">CLIENT</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full p-2.5 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors bg-card"
              required
            >
              <option value="">Select a client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold mb-1 text-muted-foreground">PRIORITY</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border-2 transition-all capitalize ${
                    priority === p
                      ? p === 'high' ? 'bg-[#EA4335] text-white border-[#EA4335]'
                        : p === 'medium' ? 'bg-[#FBBC04] text-white border-[#FBBC04]'
                        : 'bg-[#34A853] text-white border-[#34A853]'
                      : 'bg-card border-border text-muted-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold mb-1 text-muted-foreground">START DATE</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full p-2.5 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-1 text-muted-foreground">END DATE</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full p-2.5 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Meeting Action Items as Tasks */}
          {isFromMeeting && meetingActionItems && meetingActionItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <Flame size={10} className="text-[#F9A825]" />
                  TASKS FROM MEETING ({selectedActions.size}/{meetingActionItems.length} selected)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedActions.size === meetingActionItems.length) {
                      setSelectedActions(new Set());
                    } else {
                      setSelectedActions(new Set(meetingActionItems.map((_, i) => i)));
                    }
                  }}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  {selectedActions.size === meetingActionItems.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div className="space-y-1 bg-muted rounded-xl p-2">
                {meetingActionItems.map((actionItem, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleAction(i)}
                    className={`w-full flex items-start gap-2 p-2 rounded-lg text-left transition-colors ${
                      selectedActions.has(i)
                        ? 'bg-card shadow-sm'
                        : 'opacity-50 hover:opacity-75'
                    }`}
                  >
                    <CheckCircle2
                      size={14}
                      className={`shrink-0 mt-0.5 ${
                        selectedActions.has(i) ? 'text-[#34A853]' : 'text-border'
                      }`}
                    />
                    <span className="text-xs font-semibold">{actionItem}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Additional Custom Tasks */}
          {isFromMeeting && (
            <div>
              <label className="block text-[10px] font-bold mb-1 text-muted-foreground">ADD MORE TASKS</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={e => setNewTaskInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTask(); } }}
                  className="flex-1 p-2 border-2 border-border rounded-xl text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
                  placeholder="Add a task..."
                />
                <Button type="button" variant="outline" size="icon-sm" className="rounded-xl" onClick={addCustomTask}>
                  <Plus size={14} />
                </Button>
              </div>
              {customTasks.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  {customTasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <CheckCircle2 size={13} className="text-[#34A853] shrink-0" />
                      <span className="flex-1 text-xs font-semibold">{task}</span>
                      <button type="button" onClick={() => removeCustomTask(i)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full mt-1 rounded-xl gap-1.5 bg-[#34A853] hover:bg-[#2D9649]">
            {isFromMeeting && <Flame size={14} />}
            {isFromMeeting
              ? `Create Project with ${selectedActions.size + customTasks.length} Task${selectedActions.size + customTasks.length !== 1 ? 's' : ''}`
              : 'Create Project'
            }
          </Button>
        </form>
      </div>
    </div>
  );
}
