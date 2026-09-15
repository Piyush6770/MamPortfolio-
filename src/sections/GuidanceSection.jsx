import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { phdScholars, pgScholars, guidanceStats } from '../data/guidance';
import { GraduationCap } from 'lucide-react';

export const GuidanceSection = () => {
  const [activeTab, setActiveTab] = useState('pg');

  return (
    <section id="guidance" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader badge="RESEARCH MENTORSHIP" title="Research Guidance & Mentorship"
          subtitle="Doctoral scholars supervised, M.Tech postgraduates guided, and final year projects mentored." />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { value: guidanceStats.phdCompleted, label: `Ph.D. Awarded (${guidanceStats.phdOngoing} Ongoing)` },
            { value: guidanceStats.pgCompleted, label: `M.Tech Guided (${guidanceStats.pgOngoing} Ongoing)` },
            { value: guidanceStats.ugProjects, label: 'UG Final Year Projects' },
            { value: 'SPPU', label: 'Approved Doctoral Guide' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-lg p-4 text-center border-t-2 border-blue-600 hover-lift">
              <div className="text-2xl font-bold text-[#1e3a5f] dark:text-blue-300">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-700 mb-8 text-sm font-semibold">
          {[['pg', `M.Tech Scholars (${pgScholars.length})`], ['phd', `Ph.D. Scholars (${phdScholars.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === id ? 'tab-active' : 'tab-inactive'}`}>{label}</button>
          ))}
        </div>

        {activeTab === 'phd' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phdScholars.map((s) => (
              <div key={s.id} className="glass-card rounded-xl p-5 hover-lift">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-500">Ph.D. Awarded ({s.joiningDate})</span>
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{fontFamily: "'Merriweather', serif"}}>{s.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 my-2">Thesis: "{s.thesisTitle}"</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">{s.outcome}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pg' && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 glass-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1e3a5f] text-white">
                <tr>
                  {['Scholar Name', 'Year', 'M.Tech Thesis Title', 'Key Outcomes'].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {pgScholars.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50 dark:hover:bg-slate-800/60">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap text-xs">{s.name}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">{s.vivaDate}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">{s.thesisTitle}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">{s.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
