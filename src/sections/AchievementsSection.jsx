import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Award } from 'lucide-react';

export const AchievementsSection = () => {
  const { achievements } = usePortfolioData();
  const [filter, setFilter] = useState('all');
  const filtered = achievements.filter(item => filter !== 'all' ? item.category === filter : true);

  return (
    <section id="achievements" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader badge="HONORS & RECOGNITION" title="Achievements & Recognitions"
          subtitle="National awards, 5 Best Paper Awards, academic ranks, and student achievements." />

        <div className="flex flex-wrap gap-2 mb-8 text-xs font-semibold">
          {['all', 'Award', 'Best Paper', 'Academic Rank', 'Recognition', 'Student Success'].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#1e3a5f] text-white font-bold shadow'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300'}`}>
              {cat === 'all' ? `All (${achievements.length})` : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card rounded-xl p-5 hover-lift flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-accent">{item.category}</span>
                  <span className="text-xs font-mono font-bold text-slate-400">{item.year}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-1" style={{fontFamily: "'Merriweather', serif"}}>{item.title}</h3>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">{item.organization}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <Award className="w-3.5 h-3.5 text-blue-500" />
                <span>Verified Record</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
