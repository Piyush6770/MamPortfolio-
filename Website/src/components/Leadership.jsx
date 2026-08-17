import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { leadershipRoles } from '../data/experience';
import { Briefcase } from 'lucide-react';

export default function Leadership() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="leadership" className="section bg-white" aria-label="Academic Leadership" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow mb-3">Leadership</p>
          <h2 className="heading-xl" style={{ fontFamily: 'Manrope' }}>Academic Leadership</h2>
        </motion.div>

        <div className="relative pl-8">
          {/* Vertical line */}
          <div
            className="absolute left-3.5 top-2 bottom-2 w-[2px] rounded-full"
            style={{ background: 'linear-gradient(to bottom, #2563EB, #BFDBFE)' }}
            aria-hidden="true"
          />

          <div className="space-y-6">
            {leadershipRoles.map((role, i) => (
              <motion.div
                key={role.id}
                className="relative"
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                {/* Dot */}
                <div
                  className="absolute -left-[26px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white"
                  style={{ background: i === 0 ? '#2563EB' : '#93C5FD' }}
                  aria-hidden="true"
                />

                <article className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase size={14} className="text-[#2563EB]" aria-hidden="true" />
                        <h3
                          className="font-bold text-[#0F172A] text-[0.95rem]"
                          style={{ fontFamily: 'Manrope' }}
                        >
                          {role.role}
                        </h3>
                      </div>
                      <p className="text-[#475569] text-[0.85rem] mb-1">{role.institution}</p>
                      {role.responsibility && (
                        <p className="text-[#475569] text-[0.8rem] leading-relaxed">{role.responsibility}</p>
                      )}
                    </div>
                    <span className="badge badge-blue whitespace-nowrap self-start sm:self-auto flex-shrink-0">
                      {role.period}
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
