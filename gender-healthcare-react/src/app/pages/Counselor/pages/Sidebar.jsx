import React from 'react';
import {
  Home,
  CalendarDays,
  FileText,
  Users,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { key: 'schedule', label: 'Schedule', icon: <CalendarDays size={18} /> },
  { key: 'blog', label: 'Blog', icon: <FileText size={18} /> },
  { key: 'users', label: 'Users', icon: <Users size={18} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-300 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="p-6 text-xl font-bold flex items-center gap-2">
          <CalendarDays size={22} />
          <span>Counselor</span>
        </div>

        {/* Navigation */}
        <nav className="px-2 space-y-1">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={clsx(
                'flex items-center w-full px-4 py-2 rounded-lg transition-all',
                activeTab === key
                  ? 'bg-gray-100 text-black font-semibold'
                  : 'hover:bg-gray-100 text-gray-600'
              )}
            >
              {icon}
              <span className="ml-3">{label}</span>
            </button>
          ))}
        </nav>
      </div>

     
    </aside>
  );
}
