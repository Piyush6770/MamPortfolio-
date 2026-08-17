import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { collaborations } from '../data/awards';
import { Building2, Microscope, Landmark } from 'lucide-react';

const labs = [
  { name: 'FOSS Centre', desc: 'Recognized by IIT Bombay. Free and Open Source Software Centre supporting open-source AI research tools.', year: 'Est. 2012', color: '#2563EB' },
  { name: 'IBM Centre of Excellence', desc: 'Industry-academia collaboration centre for AI, Cloud, and Data Science in partnership with IBM India.', year: 'Est. 2016', color: '#0F172A' },
  { name: 'NVIDIA Deep Learning Lab', desc: 'GPU-powered lab certified by NVIDIA DLI for deep learning research and certified instructor training.', year: 'Est. 2019', color: '#76B900' },
  { name: 'Robotics & AI Lab', desc: 'AICTE MODROB-funded lab for robotics, embedded systems, and AI student innovation projects.', year: 'Est. 2021', color: '#7C3AED' },
];

function catIcon(cat) {
  if (cat === 'Industry') return Building2;
  if (cat === 'Academic') return Microscope;
  return Landmark;
}

function catColor(cat) {
  if (cat === 'Industry') return 'badge-blue';
  if (cat === 'Academic') return 'badge-green';
  return 'badge-amber';
}

export default function Collaborations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="collaborations" className="section bg-alt" aria-label="Collaborations and Research Ecosystem" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow mb-3">Ecosystem</p>
          <h2 className="heading-xl mb-3" style={{ fontFamily: 'Manrope' }}>Collaborations & Academic Ecosystem</h2>
          <p className="text-[#475569] max-w-2xl text-[0.95rem]">
            A broad network of industry, government, and academic collaborations fostering research excellence and industry-readiness.
          </p>
        </motion.div>

        {/* Labs */}
        <div className="mb-10">
          <h3 className="heading-md mb-5 flex items-center gap-2 text-[1rem]" style={{ fontFamily: 'Manrope' }}>
            <Microscope size={16} className="text-[#2563EB]" aria-hidden="true" />
            Research Laboratories & Centres
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {labs.map((lab, i) => (
              <motion.article
                key={lab.name}
                className="card p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                aria-label={`Lab: ${lab.name}`}
              >
                <div
                  className="w-3 h-3 rounded-full mb-3"
                  style={{ background: lab.color }}
                  aria-hidden="true"
                />
                <h4 className="font-bold text-[#0F172A] text-[0.9rem] mb-1.5 leading-snug" style={{ fontFamily: 'Manrope' }}>
                  {lab.name}
                </h4>
                <p className="text-[#475569] text-[0.78rem] leading-relaxed mb-2">{lab.desc}</p>
                <span className="badge badge-slate text-[10px]">{lab.year}</span>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Collaborating organizations */}
        <div>
          <h3 className="heading-md mb-5 flex items-center gap-2 text-[1rem]" style={{ fontFamily: 'Manrope' }}>
            <Building2 size={16} className="text-[#2563EB]" aria-hidden="true" />
            Collaborating Organizations
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {collaborations.map((org, i) => {
              const Icon = catIcon(org.category);
              return (
                <motion.div
                  key={org.name}
                  className="card p-4 text-center flex flex-col items-center gap-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
                >
                  <Icon size={20} className="text-[#2563EB]" aria-hidden="true" />
                  <p className="font-semibold text-[#0F172A] text-[0.82rem] leading-tight text-center" style={{ fontFamily: 'Manrope' }}>
                    {org.name}
                  </p>
                  <span className={`badge ${catColor(org.category)} text-[10px]`}>{org.type}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
