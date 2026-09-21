import React from 'react';
import { Menu, ExternalLink, Eye, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminData } from '../context/AdminDataContext';

export const AdminNavbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isPreviewMode, togglePreviewMode } = useAdminData();

  const handleOpenLiveSite = () => {
    const publicUrl = import.meta.env.VITE_PUBLIC_PORTFOLIO_URL || 'http://localhost:5173/';
    window.open(publicUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="h-16 bg-black border-b border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left items */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-200 border border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
            Admin CMS
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Preview Mode Toggle */}
        <button
          onClick={togglePreviewMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
            isPreviewMode
              ? 'bg-amber-500 text-black border-amber-400 shadow-xs font-black'
              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
          }`}
          title="Toggle Draft Preview Mode across public pages"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preview Mode:</span> {isPreviewMode ? 'ACTIVE' : 'OFF'}
        </button>

        {/* View Live Portfolio Site */}
        <button
          onClick={handleOpenLiveSite}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
          title="View Public Portfolio"
        >
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline">View Public Website</span>
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
          <div className="hidden lg:block text-right">
            <div className="text-xs font-bold text-zinc-100 leading-tight">
              {user?.user_metadata?.name || 'Piyush Patel'}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">
              {user?.email || 'admin'}
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer border border-zinc-800 hover:border-rose-900/50"
            title="Sign out of Admin CMS"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
