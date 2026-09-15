import { SectionHeader } from '../components/SectionHeader';
import { GraduationCap, Briefcase, Award, Building2, Layers, Sparkles } from 'lucide-react';

const milestones = [
  { type: "Education", icon: GraduationCap, period: "2001–2015", title: "Educational Qualifications & Ph.D.", institution: "MGM Nanded → BVCOE Pune → SGGS IET Nanded", desc: "Graduated B.E. (CSE) 2001, M.E. (1st Rank Entrance) 2006, Ph.D. in CSE April 2015 (1st Rank in PET-2011)." },
  { type: "Experience", icon: Briefcase, period: "2001–2012", title: "Teaching & Early HOD Role", institution: "BVCOEW Pune → PCCOE Pune", desc: "Joined PCCOE Pune in 2007. Served as HOD for 5 years (2007–2012) and Institute NBA Coordinator for 6 years." },
  { type: "Leadership", icon: Building2, period: "2015–2018", title: "Professorship & General Chair ICCUBEA", institution: "PCCOE Pune & IEEE Pune Section", desc: "Promoted to Professor 2015. PG Coordinator (3 yrs), HOD (2017–18), General Chair for IEEE ICCUBEA-2018 (₹5 Lakhs, 1042 papers)." },
  { type: "Research", icon: Layers, period: "2018–2021", title: "Research Coordination & Innovation Labs", institution: "PCCOE, IIT Bombay, NVIDIA", desc: "Established FOSS Centre (IIT Bombay), NVIDIA AI Lab (Bennett University), Robotics & AI Lab (SVR Infotech). Research Coordinator." },
  { type: "Achievement", icon: Award, period: "2021–2024", title: "Dean R&D & DST Principal Investigator", institution: "DST Govt. of India & PCCOE Pune", desc: "Appointed Dean R&D (2.6 yrs). Secured DST ₹35.70 Lakhs for CerviTester AI device. 7 books published, multiple patents granted." },
  { type: "Current", icon: Sparkles, period: "May 2024–Present", title: "Dean – Management Information System (MIS)", institution: "Pimpri Chinchwad College of Engineering, Pune", desc: "Leading ERP, hardware/software systems, and digital transformation as Dean MIS while continuing research guidance and professorship." },
];

const typeColor = { Education: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', Experience: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300', Leadership: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300', Research: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300', Achievement: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', Current: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' };

export const JourneyTimelineSection = () => (
  <section id="journey" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader badge="CAREER MILESTONES" title="Academic & Professional Journey"
        subtitle="Chronological record of degrees, teaching experience, leadership roles, research projects, and current position." />
      <div className="space-y-4 max-w-5xl">
        {milestones.map((item, i) => (
          <div key={i} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover-lift">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-600 text-white rounded shrink-0 mt-0.5">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{fontFamily: "'Merriweather', serif"}}>{item.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${typeColor[item.type]}`}>{item.type}</span>
                </div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">{item.institution}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 shrink-0 md:text-right">{item.period}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
