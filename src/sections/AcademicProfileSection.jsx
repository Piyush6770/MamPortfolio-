import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { facultyData } from '../data/facultyData';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export const AcademicProfileSection = () => {
  const [activeSubTab, setActiveSubTab] = useState('admin');
  const tabs = [
    ['admin', `Admin Leadership (${facultyData.adminExperience.length})`],
    ['experience', 'Work Experience (25 Yrs)'],
    ['education', `Education (${facultyData.education.length})`],
    ['certifications', `Certifications (${facultyData.certifications.length})`],
    ['courses', `Courses Taught (${facultyData.coursesTaught.length})`],
  ];

  return (
    <section id="academic" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader badge="QUALIFICATIONS & GOVERNANCE" title="Academic & Leadership Profile"
          subtitle="Educational degrees, teaching positions, administrative governance, and certifications." />

        <div className="flex flex-wrap gap-x-6 gap-y-0 border-b border-slate-200 dark:border-slate-700 mb-8 text-sm font-semibold overflow-x-auto">
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setActiveSubTab(id)}
              className={`pb-3 border-b-2 whitespace-nowrap transition-all cursor-pointer ${activeSubTab === id ? 'tab-active' : 'tab-inactive'}`}>
              {label}
            </button>
          ))}
        </div>

        {activeSubTab === 'admin' && (
          <div className="space-y-3">
            {facultyData.adminExperience.map((item, i) => (
              <div key={i} className="glass-card rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.designation}</span>
                    <span className="text-xs text-slate-400 font-mono">({item.duration})</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.duties}</p>
                </div>
                <span className="text-xs font-mono text-slate-500 shrink-0">{item.period}</span>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'experience' && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 glass-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1e3a5f] text-white">
                <tr>{['Designation', 'Organization', 'From', 'To', 'Period'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {facultyData.workExperience.map((exp, i) => (
                  <tr key={i} className="hover:bg-blue-50 dark:hover:bg-slate-800/60">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100 text-xs">{exp.role}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">{exp.organization}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{exp.fromDate}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{exp.toDate}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100 text-xs">{exp.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'education' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {facultyData.education.map((edu, i) => (
              <div key={i} className="glass-card rounded-xl p-5 border-t-2 border-blue-600 hover-lift">
                <div className="flex justify-between items-center mb-2">
                  <span className="badge-accent">{edu.degree} ({edu.year})</span>
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2" style={{fontFamily: "'Merriweather', serif"}}>{edu.field}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{edu.institution}</p>
                {edu.details && <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">{edu.details}</p>}
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'certifications' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facultyData.certifications.map((cert, i) => (
              <div key={i} className="glass-card rounded-lg p-4 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{cert}</span>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'courses' && (
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4" style={{fontFamily: "'Merriweather', serif"}}>UG & PG Courses Taught</h3>
            <div className="flex flex-wrap gap-2">
              {facultyData.coursesTaught.map((course, i) => (
                <span key={i} className="badge-accent">{course}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
