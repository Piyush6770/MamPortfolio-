import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { phdScholars, pgScholars, pgOngoing } from '../data/scholars';
import { GraduationCap, Users, BookOpen, ArrowRight } from 'lucide-react';

export default function Scholars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const statsData = [
    { label: 'Ph.D. Completed', value: phdScholars.completed.length, icon: GraduationCap, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Ph.D. Ongoing', value: phdScholars.ongoing.length, icon: BookOpen, color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'M.E./M.Tech. Completed', value: pgScholars.length, icon: GraduationCap, color: '#059669', bg: '#ECFDF5' },
    { label: 'M.E./M.Tech. Ongoing', value: pgOngoing.length, icon: Users, color: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <section id="scholars" className="section bg-alt" aria-label="Research Mentorship and Scholars" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow mb-3">Mentorship</p>
          <h2 className="heading-xl mb-3" style={{ fontFamily: 'Manrope' }}>Mentorship & Research Supervision</h2>
          <p className="text-[#475569] max-w-2xl text-[0.95rem]">
            Recognized Ph.D. Research Guide at Savitribai Phule Pune University (SPPU) since 2015.
            Dedicated to fostering the next generation of AI researchers and engineers.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="card p-5 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: stat.bg }}
              >
                <stat.icon size={20} style={{ color: stat.color }} aria-hidden="true" />
              </div>
              <p className="text-[2rem] font-extrabold text-[#0F172A] leading-none mb-1" style={{ fontFamily: 'Manrope', color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[0.78rem] font-medium text-[#475569]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PhD Scholars */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={18} className="text-[#2563EB]" aria-hidden="true" />
              <h3 className="heading-md" style={{ fontFamily: 'Manrope', fontSize: '1.1rem' }}>
                Ph.D. Research Scholars
              </h3>
            </div>

            {/* Completed */}
            <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-3">Completed</p>
            <div className="space-y-3 mb-6">
              {phdScholars.completed.map((scholar, i) => (
                <article
                  key={scholar.name}
                  className="card p-4"
                  aria-label={`PhD Scholar: ${scholar.name}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] font-bold text-sm flex-shrink-0" style={{ fontFamily: 'Manrope' }}>
                      {scholar.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-[#0F172A] text-[0.9rem]" style={{ fontFamily: 'Manrope' }}>{scholar.name}</p>
                        <span className="badge badge-green text-[10px]">Completed {scholar.year}</span>
                      </div>
                      <p className="text-[#475569] text-[0.8rem] italic leading-snug">"{scholar.thesis}"</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Ongoing */}
            <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-3">Ongoing ({phdScholars.ongoing.length})</p>
            <div className="space-y-2">
              {phdScholars.ongoing.map((scholar, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white"
                >
                  <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse flex-shrink-0" />
                  <p className="text-[#475569] text-[0.82rem] italic">{scholar.topic}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* PG Scholars */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} className="text-[#059669]" aria-hidden="true" />
              <h3 className="heading-md" style={{ fontFamily: 'Manrope', fontSize: '1.1rem' }}>
                M.E./M.Tech. Scholars
              </h3>
            </div>
            <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-3">
              {pgScholars.length} Completed
            </p>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 rounded-xl">
              {pgScholars.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-[0.82rem]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#059669] font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-[#0F172A]">{s.name}</p>
                      <span className="badge badge-green text-[9px]">{s.year}</span>
                      <span className="badge badge-slate text-[9px]">{s.outcome}</span>
                    </div>
                    <p className="text-[#475569] italic text-[0.78rem]">{s.thesis}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
