import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ReadMoreModal } from '../components/ReadMoreModal';
import { facultyData } from '../data/facultyData';
import { GraduationCap, Award, BookOpen, ChevronRight, CheckCircle2, Building2 } from 'lucide-react';

export const AboutSection = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="about" className="pt-6 pb-10 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="About Dr. Swati Vijay Shinde"
          subtitle="Key academic credentials, institutional responsibilities, research direction, and 25 years of leadership."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Profile Card */}
          <div className="lg:col-span-4">
            <div className="glass-card rounded-xl overflow-hidden shadow-md">
              <div className="bg-[#1e3a5f] dark:bg-[#162d4a] py-8 px-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/90 shadow shrink-0">
                  <img src="/dr-swati-shinde.jpg" alt={facultyData.name} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white" style={{fontFamily: "'Merriweather', serif"}}>
                    {facultyData.name}
                  </h3>
                  <p className="text-xs text-blue-200 font-medium mt-0.5">
                    {facultyData.primaryDesignation}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                {[
                  ['Department', 'Computer Engineering'],
                  ['Institute', 'PCCoE Pune'],
                  ['Experience', '25 Years (21 Approved)'],
                  ['Doctoral Guide', 'SPPU Recognized'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3">
                    <span className="text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{value}</span>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-primary w-full justify-center"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Full Professional Bio
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="lg:col-span-8 space-y-5">
            
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2" style={{fontFamily: "'Merriweather', serif"}}>
                25 Years of Academic & Research Leadership
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {facultyData.bio}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: '54', label: "Int'l Journals" },
                { value: '82', label: 'Conferences' },
                { value: '11', label: 'Patents' },
                { value: '7', label: 'Books Authored' },
              ].map((m) => (
                <div key={m.label} className="glass-card rounded-lg p-4 text-center border-t-2 border-blue-600 hover-lift">
                  <div className="text-2xl font-bold text-[#1e3a5f] dark:text-blue-300">{m.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="glass-card rounded-xl p-6">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
                Key Research & Governance Highlights
              </h4>
              <ul className="space-y-3">
                {[
                  [CheckCircle2, 'Principal Investigator: DST-funded "CerviTester" project (₹35.7 Lakhs) developing portable AI screening devices.'],
                  [Building2, 'Infrastructure Builder: Established FOSS Centre (IIT Bombay), IBM CoE, Bennett/NVIDIA AI Lab, Robotics & AI Lab.'],
                  [Award, 'Research Mentorship: Supervised 16 M.Tech scholars and 6 Ph.D. scholars (2 awarded, 4 ongoing) with Best Paper Awards.'],
                ].map(([Icon, text], i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      <ReadMoreModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};
