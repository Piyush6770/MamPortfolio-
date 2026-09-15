import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { expertTalksData, organizedEventsData } from '../data/talksAndEvents';
import { Mic, MapPin } from 'lucide-react';

export const TalksEventsSection = () => {
  const [activeTab, setActiveTab] = useState('talks');

  return (
    <section id="talks-events" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader badge="ACADEMIC OUTREACH" title="Talks & Academic Events"
          subtitle="Keynote sessions at premier institutes and major international conferences organized as General Chair & Convenor." />

        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-700 mb-8 text-sm font-semibold">
          {[['talks', `Expert Talks (${expertTalksData.length})`], ['organized', `Organized Events (${organizedEventsData.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === id ? 'tab-active' : 'tab-inactive'}`}>{label}</button>
          ))}
        </div>

        {activeTab === 'talks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expertTalksData.map((talk) => (
              <div key={talk.id} className="glass-card rounded-xl p-5 hover-lift flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge-accent">{talk.role}</span>
                    <Mic className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-1" style={{fontFamily: "'Merriweather', serif"}}>{talk.topic}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{talk.event}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mt-3 flex justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" />{talk.venue}</span>
                  <span className="font-mono">{talk.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'organized' && (
          <div className="space-y-3">
            {organizedEventsData.map((ev) => (
              <div key={ev.id} className="glass-card rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{ev.role}</span>
                    <span className="text-xs text-slate-400">({ev.type})</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100" style={{fontFamily: "'Merriweather', serif"}}>{ev.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sponsor: {ev.sponsoringAgency}</p>
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0">{ev.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
