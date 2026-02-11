'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Users, Calendar, Mic, X, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/meetings', label: 'Meetings', icon: Mic },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 p-1.5 bg-white rounded-xl border-2 border-[#E5E5E5] shadow-sm"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[220px] bg-white border-r-2 border-[#E5E5E5]
          flex flex-col p-3 z-50 transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4285F4] flex items-center justify-center">
              <span className="text-white font-black text-base">PM</span>
            </div>
            <span className="font-black text-lg text-[#3C3C3C]">FlowPM</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map(item => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="duo-card !p-3 mt-3">
          <div className="flex items-center gap-2.5">
            <div className="avatar" style={{ background: '#4285F4', width: 32, height: 32, fontSize: 12 }}>
              U
            </div>
            <div>
              <p className="font-bold text-xs">Your Workspace</p>
              <p className="text-[10px] text-[#AFAFAF]">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
