import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, BookOpen, Database, Linkedin, Globe } from 'lucide-react';

const profiles = [
  {
    id: 'gs',
    label: 'Google Scholar',
    desc: '1040+ citations • h-index 16',
    url: 'https://scholar.google.com/citations?user=8RoLEssAAAAJ',
    icon: BookOpen,
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    id: 'scopus',
    label: 'Scopus',
    desc: '73 publications • h-index 11',
    url: 'https://bit.ly/3d7dFAx',
    icon: Database,
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    desc: 'Prof. Dr. Swati Vijay Shinde',
    url: 'https://www.linkedin.com/in/prof-dr-swati-vijay-shinde-67670634',
    icon: Linkedin,
    color: '#0077B5',
    bg: '#EFF6FF',
  },
  {
    id: 'pccoe',
    label: 'PCCOE Faculty Profile',
    desc: 'Official institutional profile',
    url: 'https://www.pccoepune.com',
    icon: Globe,
    color: '#059669',
    bg: '#ECFDF5',
  },
];

export default function ResearchProfiles() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="profiles" className="section bg-white" aria-label="Research Profiles" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow justify-center mb-3">Online Presence</p>
          <h2 className="heading-xl" style={{ fontFamily: 'Manrope' }}>Research Profiles</h2>
          <p className="text-[#475569] mt-3 text-[0.95rem]">
            Connect with Dr. Shinde's academic work across research platforms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {profiles.map((profile, i) => (
            <motion.a
              key={profile.id}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 flex flex-col items-center text-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              aria-label={`${profile.label} (opens in new tab)`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                style={{ background: profile.bg }}
              >
                <profile.icon size={26} style={{ color: profile.color }} aria-hidden="true" />
              </div>
              <h3 className="font-bold text-[#0F172A] text-[0.95rem] mb-1 group-hover:text-[#2563EB] transition-colors duration-150" style={{ fontFamily: 'Manrope' }}>
                {profile.label}
              </h3>
              <p className="text-[#475569] text-[0.8rem] mb-3">{profile.desc}</p>
              <div className="flex items-center gap-1 text-[0.8rem] font-semibold" style={{ color: profile.color }}>
                View Profile <ExternalLink size={12} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
