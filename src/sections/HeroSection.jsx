import { ArrowRight, BookOpen, ExternalLink, Mail, GraduationCap, Cpu, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';

export const HeroSection = ({ setActivePage }) => {
  const { faculty, hero } = usePortfolioData();

  const navigateTo = (pageId) => {
    if (setActivePage) {
      setActivePage(pageId);
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.location.hash = `#/${pageId}`;
    }
  };

  const features = [
    { icon: Cpu, title: 'AI & Deep Learning', desc: 'Soft Computing, Computer Vision, Fuzzy Min-Max Neural Networks.' },
    { icon: ShieldCheck, title: 'DST Principal Investigator', desc: 'CerviTester AI medical device project (₹35.70 Lakhs).' },
    { icon: FileCheck, title: '136+ Publications & 15 Patents', desc: '7 Books, 11 Patents, 4 Copyrights, 1040+ Citations.' },
    { icon: Layers, title: 'Academic Leadership', desc: '25 years as Dean MIS, Dean R&D, and HOD.' },
  ];

  const metrics = [
    { value: faculty.totalExperience || '25 Yrs', label: 'Experience' },
    { value: `${faculty.citationsGoogleScholar || 1040}+`, label: 'Citations' },
    { value: `${faculty.totalScopusPubs || 73}+`, label: 'Scopus Papers' },
    { value: '₹54L+', label: 'Grants' },
  ];

  return (
    <section id="home" className="pt-6 pb-10 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-5">

            {/* Identity */}
            <div>
              <span className="badge-accent mb-4 inline-block">
                {hero?.badge_text || 'SPPU Recognized Ph.D. Guide • NVIDIA Ambassador'}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e3a5f] dark:text-blue-100 tracking-tight leading-tight" style={{fontFamily: "'Merriweather', Georgia, serif"}}>
                {hero?.name || faculty.name}
              </h1>
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-400 mt-2">
                {hero?.title || faculty.primaryDesignation}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                {hero?.subtitle || `${faculty.department} • ${faculty.institution}`}
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="p-4 glass-card rounded-lg hover-lift flex items-start gap-3">
                  <div className="p-2 rounded bg-blue-600 text-white shrink-0">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{f.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-3">
              {metrics.map((m, i) => (
                <div key={i} className="glass-card rounded-lg p-4 text-center border-t-2 border-blue-600">
                  <div className="text-2xl font-bold text-[#1e3a5f] dark:text-blue-300">{m.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons + Profile Links combined */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => navigateTo('research')} className="btn-primary">
                  {hero?.primary_cta_text || 'Explore Research'} <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigateTo('publications')} className="btn-outline">
                  <BookOpen className="w-4 h-4" /> Publications
                </button>
                <button onClick={() => navigateTo('contact')} className="btn-outline">
                  Contact
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profiles:</span>
                {[
                  [faculty.socialLinks.googleScholar, 'Google Scholar'],
                  [faculty.socialLinks.scopus, 'Scopus'],
                  [faculty.socialLinks.linkedIn, 'LinkedIn'],
                  [`mailto:${faculty.emails[0]}`, 'Email'],
                ].map(([href, label]) => (
                  <a key={label} href={href} target={href?.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold glass-card rounded text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                    {label} {!href?.startsWith('mailto') && <ExternalLink className="w-3 h-3" />}
                    {href?.startsWith('mailto') && <Mail className="w-3 h-3" />}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column – Profile Card */}
          <div className="lg:col-span-4">
            <div className="glass-card rounded-xl overflow-hidden shadow-lg">
              {/* Navy header */}
              <div className="bg-[#1e3a5f] dark:bg-[#162d4a] py-10 px-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-white/90 shadow-xl mb-3 shrink-0">
                  <img src={hero?.hero_image_url || "/dr-swati-shinde.jpg"} alt={faculty.name} className="w-full h-full object-cover object-top" />
                </div>
                <h3 className="text-lg font-bold text-white" style={{fontFamily: "'Merriweather', serif"}}>{faculty.name}</h3>
                <p className="text-xs text-blue-200 font-semibold mt-1">Ph.D. (CSE), M.E., B.E.</p>
                <p className="text-xs text-blue-300 mt-0.5">Professor, Computer Engineering</p>
                <span className="mt-3 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[11px] font-bold">
                  NVIDIA Certified Ambassador
                </span>
              </div>
              {/* Stats table */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                {[
                  ['Ph.D. Guide', 'SPPU Approved'],
                  ['Books Authored', '7 Books'],
                  ['Patents & IP', '15 (11 Patents, 4 Copyrights)'],
                  ['Total Experience', faculty.totalExperience || '25 Years'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3">
                    <span className="text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
