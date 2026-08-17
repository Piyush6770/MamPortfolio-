import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { academicExperience } from '../data/experience';
import { BriefcaseIcon, GraduationCap } from 'lucide-react';

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="section bg-alt" aria-label="Professional Experience" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow mb-3">Career</p>
          <h2 className="heading-xl" style={{ fontFamily: 'Manrope' }}>Professional Experience</h2>
          <p className="text-[#475569] text-[0.95rem] mt-2">25+ years of dedicated academic service in engineering education and research.</p>
        </motion.div>

        <div className="relative pl-8">
          {/* Vertical line */}
          <div
            className="absolute left-3.5 top-2 bottom-2 w-[2px] rounded-full"
            style={{ background: 'linear-gradient(to bottom, #0F172A, #E2E8F0)' }}
            aria-hidden="true"
          />

          <div className="space-y-5">
            {academicExperience.map((exp, i) => (
              <motion.div
                key={exp.id}
                className="relative"
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                {/* Dot */}
                <div
                  className="absolute -left-[26px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white"
                  style={{ background: i === 0 ? '#0F172A' : '#94A3B8' }}
                  aria-hidden="true"
                />

                <article className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        {i === 0 ? (
                          <GraduationCap size={14} className="text-[#0F172A]" aria-hidden="true" />
                        ) : (
                          <BriefcaseIcon size={14} className="text-[#475569]" aria-hidden="true" />
                        )}
                        <h3
                          className="font-bold text-[#0F172A] text-[0.95rem]"
                          style={{ fontFamily: 'Manrope' }}
                        >
                          {exp.role}
                        </h3>
                      </div>
                      <p className="text-[#475569] text-[0.85rem]">{exp.institution}</p>
                      <p className="text-[#475569] text-[0.8rem]">{exp.department}</p>
                    </div>
                    <span
                      className={`badge whitespace-nowrap self-start sm:self-auto flex-shrink-0 ${i === 0 ? 'badge-blue' : 'badge-slate'}`}
                    >
                      {exp.period}
                    </span>
                  </div>
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
