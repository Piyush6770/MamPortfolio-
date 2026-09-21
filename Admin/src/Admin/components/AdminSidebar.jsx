import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  UserCheck,
  Code2,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Trophy,
  Award,
  BookOpen,
  FileText,
  FileCode2,
  Users2,
  Mic2,
  Image as ImageIcon,
  MenuSquare,
  Layers,
  Share2,
  Mail,
  FileDown,
  Globe,
  Settings,
  History,
  X,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Core Content',
    items: [
      { id: 'hero', label: 'Hero Header', icon: Sparkles },
      { id: 'about', label: 'About & Bio', icon: UserCheck },
      { id: 'skills', label: 'Skills & Tech', icon: Code2 },
      { id: 'projects', label: 'Projects & Grants', icon: FolderGit2 },
      { id: 'experience', label: 'Work & Admin Exp', icon: Briefcase },
      { id: 'education', label: 'Education', icon: GraduationCap },
      { id: 'achievements', label: 'Achievements', icon: Trophy },
      { id: 'certifications', label: 'Certifications', icon: Award },
    ],
  },
  {
    title: 'Research & Scholarly',
    items: [
      { id: 'publications', label: 'Publications', icon: BookOpen },
      { id: 'patents', label: 'Patents & IPR', icon: FileCode2 },
      { id: 'books', label: 'Books & Chapters', icon: FileText },
      { id: 'guidance', label: 'PhD/PG Guidance', icon: Users2 },
      { id: 'talks', label: 'Talks & Events', icon: Mic2 },
      { id: 'gallery', label: 'Gallery Highlights', icon: ImageIcon },
    ],
  },
  {
    title: 'Website & Configuration',
    items: [
      { id: 'navigation', label: 'Navigation Menu', icon: MenuSquare },
      { id: 'sections', label: 'Section Visibility', icon: Layers },
      { id: 'social-links', label: 'Social Links', icon: Share2 },
      { id: 'contact', label: 'Contact Info', icon: Mail },
      { id: 'resume', label: 'Resume / CV', icon: FileDown },
      { id: 'seo', label: 'SEO & Metadata', icon: Globe },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'Site Settings & Sync', icon: Settings },
      { id: 'audit-log', label: 'Audit Logs', icon: History },
    ],
  },
];

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { activeAdminTab, setActiveAdminTab } = useAdminData();

  const handleSelectTab = (tabId) => {
    setActiveAdminTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

        {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-black text-slate-800 dark:text-zinc-200 flex flex-col border-r border-slate-200 dark:border-zinc-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-zinc-800/80 flex items-center justify-between bg-white dark:bg-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-zinc-900 border border-slate-800 dark:border-zinc-700 flex items-center justify-center text-white font-black text-xs shadow-inner">
              CMS
            </div>
            <div>
              <div className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white">Portfolio Admin</div>
              <div className="text-[10px] text-slate-500 dark:text-zinc-400">Dr. Swati Shinde</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeAdminTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-zinc-800 dark:text-white font-bold border border-slate-900 dark:border-zinc-700 shadow-sm'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900/90'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-zinc-100' : 'text-slate-400 dark:text-zinc-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 text-[10px] text-slate-500 dark:text-zinc-500 flex items-center justify-between">
          <span className="font-mono">CMS Pro v2.4</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Active" />
        </div>
      </aside>
    </>
  );
};
