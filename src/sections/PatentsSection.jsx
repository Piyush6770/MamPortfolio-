import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { patentsData, copyrightsData } from '../data/patents';
import { ShieldCheck, FileCheck } from 'lucide-react';

export const PatentsSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const grantedCount = patentsData.filter(p => p.status === 'Granted').length;
  const filtered = activeTab === 'granted' ? patentsData.filter(p => p.status === 'Granted') : patentsData;

  return (
    <section id="patents" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader badge="INTELLECTUAL PROPERTY" title="Patents & Copyrights" subtitle="Official patent grants, design registrations, and copyrights filed and granted." />

        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-700 mb-8 text-sm font-semibold">
          {[['all', `All Patents (${patentsData.length})`], ['granted', `Granted (${grantedCount})`], ['copyrights', `Copyrights (${copyrightsData.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === id ? 'tab-active' : 'tab-inactive'}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab !== 'copyrights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filtered.map((item) => (
              <div key={item.id} className="glass-card rounded-xl p-5 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.status === 'Granted' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                    item.status === 'Published' ? 'badge-accent' :
                    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                    {item.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{item.authorNumber}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-3" style={{fontFamily: "'Merriweather', serif"}}>{item.title}</h3>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <span>App: {item.applicationNo}</span>
                  {item.patentNo && <span className="font-bold text-blue-700 dark:text-blue-400">{item.patentNo}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {(activeTab === 'copyrights' || activeTab === 'all') && (
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2" style={{fontFamily: "'Merriweather', serif"}}>
              <FileCheck className="w-4 h-4 text-blue-600" /> Copyright Registrations ({copyrightsData.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {copyrightsData.map((cpr) => (
                <div key={cpr.id} className="glass-card rounded-lg p-4 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-400">Granted Copyright</span>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">{cpr.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{cpr.authorNumber} • Granted {cpr.year}</p>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
