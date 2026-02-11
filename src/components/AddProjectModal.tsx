'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { clients } from '@/lib/data';

interface AddProjectModalProps {
  onClose: () => void;
  onAdd: (project: {
    title: string;
    description: string;
    clientId: string;
    priority: string;
    startDate: string;
    endDate: string;
  }) => void;
  preselectedClientId?: string;
}

export default function AddProjectModal({ onClose, onAdd, preselectedClientId }: AddProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState(preselectedClientId || '');
  const [priority, setPriority] = useState('medium');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientId || !startDate || !endDate) return;
    onAdd({ title, description, clientId, priority, startDate, endDate });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black">New Project</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[#F0F0F0] rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">PROJECT NAME</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
              placeholder="e.g. Website Redesign"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">DESCRIPTION</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors resize-none"
              rows={2}
              placeholder="Brief project description..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">CLIENT</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full p-2.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors bg-white"
              required
            >
              <option value="">Select a client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">PRIORITY</label>
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
                      : 'bg-white border-[#E5E5E5] text-[#AFAFAF]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">START DATE</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full p-2.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-1 text-[#AFAFAF]">END DATE</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full p-2.5 border-2 border-[#E5E5E5] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#4285F4] transition-colors"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-green mt-1 w-full text-center !text-xs">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
