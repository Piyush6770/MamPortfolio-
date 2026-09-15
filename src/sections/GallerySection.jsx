import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { LightboxModal } from '../components/LightboxModal';
import { galleryData } from '../data/galleryData';
import { Stethoscope, Award, Users, Cpu, Trophy, BookOpen, Terminal, FileCheck, GraduationCap } from 'lucide-react';

const iconMap = { Stethoscope, Award, Users, Cpu, Trophy, BookOpen, Terminal, FileCheck, GraduationCap };

export const GallerySection = () => {
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const filtered = galleryData.filter(item => filter !== 'all' ? item.category === filter : true);

  return (
    <section id="gallery" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader badge="ACADEMIC HIGHLIGHTS" title="Media & Gallery"
          subtitle="Visual record of research demonstrations, conference chairing, award ceremonies, and institutional milestones." />

        <div className="flex flex-wrap gap-2 mb-8 text-xs font-semibold">
          {['all', 'Research', 'Conferences', 'Awards', 'Workshops', 'Institutional'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#1e3a5f] text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}>
              {cat === 'all' ? 'All Highlights' : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const Icon = iconMap[item.iconName] || Award;
            return (
              <div key={item.id} onClick={() => setSelectedItem(item)}
                className="glass-card rounded-xl p-5 cursor-pointer hover-lift flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-10 h-10 rounded bg-blue-50 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="badge-accent">{item.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-1" style={{fontFamily: "'Merriweather', serif"}}>{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mt-3 flex justify-between text-xs">
                  <span className="font-mono text-slate-400">{item.date}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">View →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
};
