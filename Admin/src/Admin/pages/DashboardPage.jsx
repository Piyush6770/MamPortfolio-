import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  BookOpen,
  FileCode2,
  Briefcase,
  Trophy,
  Users2,
  Sparkles,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { auditService } from '../services/auditService';
import { useAdminData } from '../context/AdminDataContext';
import { seedService } from '../services/seedService';

export const DashboardPage = () => {
  const { setActiveAdminTab, showToast, refreshTick } = useAdminData();
  const [metrics, setMetrics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    const [m, logs] = await Promise.all([
      portfolioService.getDashboardMetrics(),
      auditService.getRecentLogs(8),
    ]);
    setMetrics(m);
    setRecentLogs(logs.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [refreshTick]);

  const handleSyncData = async () => {
    if (!window.confirm('This will synchronize the initial portfolio faculty data with your database. Continue?')) {
      return;
    }
    setSyncing(true);
    const res = await seedService.seedAllData((status) => setSyncStatus(status));
    setSyncing(false);
    setSyncStatus('');
    if (res.success) {
      showToast('Portfolio data synchronized successfully!');
      loadDashboardData();
    } else {
      showToast('Failed to sync data: ' + (res.error?.message || 'Error'), 'error');
    }
  };

  const statCards = [
    {
      title: 'Publications',
      value: metrics?.totalPublications || 54,
      desc: 'SCI/Scopus Journals & Conferences',
      icon: BookOpen,
      tab: 'publications',
    },
    {
      title: 'Patents & IPR',
      value: metrics?.totalPatents || 15,
      desc: 'Granted & Published Patents',
      icon: FileCode2,
      tab: 'patents',
    },
    {
      title: 'Projects & Grants',
      value: metrics?.totalProjects || 11,
      desc: 'DST, Industry & Funded Projects',
      icon: FolderGit2,
      tab: 'projects',
    },
    {
      title: 'PhD/PG Guidance',
      value: metrics?.totalScholars || 24,
      desc: 'Doctoral & PG Dissertations',
      icon: Users2,
      tab: 'guidance',
    },
    {
      title: 'Authored Books',
      value: metrics?.totalBooks || 7,
      desc: 'Textbooks & Book Chapters',
      icon: BookOpen,
      tab: 'books',
    },
    {
      title: 'Achievements',
      value: metrics?.totalAchievements || 15,
      desc: 'National & Global Recognitions',
      icon: Trophy,
      tab: 'achievements',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 p-6 sm:p-8 shadow-sm dark:shadow-xl transition-colors duration-150">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Administrative Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, Dr. Swati Vijay Shinde
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Dean - MIS & Professor in Computer Engineering. Manage research projects, grants, publications, patents, student mentorship, and public website content in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncData}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? syncStatus || 'Syncing...' : '1-Click Data Sync'}
            </button>
            <a
              href={import.meta.env.VITE_PUBLIC_PORTFOLIO_URL || 'https://swatishinde.vercel.app/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-xs font-black rounded-xl transition-all shadow-md active:scale-98"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Website
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => setActiveAdminTab(card.tab)}
              className="group bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 p-6 rounded-2xl shadow-xs hover:shadow-lg dark:shadow-sm dark:hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="p-1 text-slate-400 dark:text-zinc-600 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? '...' : card.value}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-zinc-300 mt-1">{card.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5">{card.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access & Recent Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs dark:shadow-md space-y-4 transition-colors duration-150">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Frequent CMS Tasks
          </h2>

          <div className="space-y-2">
            {[
              ['hero', 'Edit Hero Header & Designations', 'Update greetings, tagline, and portrait image'],
              ['about', 'Update Bio & Scholar Citations', 'Edit Google Scholar metrics and research interests'],
              ['publications', 'Add Research Publication', 'Create journal paper or conference record with DOI'],
              ['patents', 'Manage Patents & IPR', 'Add granted or published patents & copyrights'],
              ['gallery', 'Upload Gallery Moments', 'Add event photos, awards, and DST demonstrations'],
              ['resume', 'Update PDF Resume', 'Upload or set active CV for public download'],
              ['seo', 'SEO & Meta Tags', 'Edit Google search snippet, OG image, and title'],
            ].map(([tab, label, desc]) => (
              <button
                key={tab}
                onClick={() => setActiveAdminTab(tab)}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-white flex items-center justify-between">
                  <span>{label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs dark:shadow-md space-y-4 transition-colors duration-150">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 dark:text-zinc-400" /> Recent Content Audit Trail
            </h2>
            <button
              onClick={() => setActiveAdminTab('audit-log')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
            >
              View All Logs →
            </button>
          </div>

          <div className="space-y-2">
            {recentLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 dark:text-zinc-500">
                No recent activity recorded yet. Edits will show here.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase font-mono ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60'
                          : log.action === 'DELETE'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60'
                          : log.action === 'REORDER'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-400 border border-purple-200 dark:border-purple-900/60'
                          : log.action === 'SYNC_DATA' || log.action === 'INITIAL_SEED'
                          ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/60'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                      }`}
                    >
                      {log.action?.replace('_SINGLETON', '')}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">
                      {log.entity || log.entity_type || 'System'}
                      {log.entity_id && <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-normal ml-1">({log.entity_id})</span>}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono">
                    {new Date(log.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
