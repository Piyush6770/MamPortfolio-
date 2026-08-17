import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { awards } from '../data/awards';
import { Trophy, FileText, Medal, Star } from 'lucide-react';

const categoryConfig = {
  Awards: { icon: Trophy, color: '#D97706', bg: '#FEF3C7', label: 'Awards' },
  'Best Papers': { icon: FileText, color: '#2563EB', bg: '#EFF6FF', label: 'Best Paper Awards' },
  Certifications: { icon: Medal, color: '#7C3AED', bg: '#F5F3FF', label: 'Certifications' },
  Recognition: { icon: Star, color: '#059669', bg: '#ECFDF5', label: 'Recognition' },
};

const categories = ['Awards', 'Certifications', 'Best Papers', 'Recognition'];

export default function Awards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="awards" className="section bg-white" aria-label="Awards and Recognition" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow mb-3">Recognition</p>
          <h2 className="heading-xl" style={{ fontFamily: 'Manrope' }}>Awards & Recognition</h2>
        </motion.div>

        <div className="space-y-10">
          {categories.map((cat, ci) => {
            const cfg = categoryConfig[cat];
            const CatIcon = cfg.icon;
            const catAwards = awards.filter((a) => a.category === cat);
            if (catAwards.length === 0) return null;
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: cfg.bg }}
                  >
                    <CatIcon size={16} style={{ color: cfg.color }} aria-hidden="true" />
                  </div>
                  <h3 className="heading-md text-[1rem]" style={{ fontFamily: 'Manrope' }}>{cfg.label}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catAwards.map((award, i) => (
                    <motion.article
                      key={award.id}
                      className="card p-5"
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: ci * 0.1 + i * 0.06 }}
                      aria-label={`${award.category}: ${award.title}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: cfg.bg }}
                          aria-hidden="true"
                        >
                          {award.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="badge badge-slate text-[10px]">{award.year}</span>
                          </div>
                          <h4 className="font-semibold text-[#0F172A] text-[0.88rem] leading-snug mb-1" style={{ fontFamily: 'Manrope' }}>
                            {award.title}
                          </h4>
                          <p className="text-[0.78rem]" style={{ color: cfg.color, fontWeight: 500 }}>{award.body}</p>
                          {award.description && (
                            <p className="text-[#475569] text-[0.78rem] mt-1 leading-relaxed">{award.description}</p>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
