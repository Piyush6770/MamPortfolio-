import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Network, Cpu, Zap, FlaskConical, Eye, Leaf, Server, Car } from 'lucide-react';

const coreAreas = [
  {
    icon: Brain,
    title: 'Artificial Intelligence',
    description: 'Intelligent computational systems, applied AI for real-world problems, and AI-driven decision-making systems.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: Network,
    title: 'Machine Learning',
    description: 'Predictive modelling, classification, regression, and intelligent learning systems across diverse domains.',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: Cpu,
    title: 'Deep Learning',
    description: 'Modern deep learning architectures — CNN, RNN, Transformers, GANs — and their biomedical applications.',
    color: '#0891B2',
    bg: '#ECFEFF',
  },
  {
    icon: Zap,
    title: 'Soft Computing',
    description: 'Fuzzy systems, neural networks, and intelligent computational approaches for uncertain and imprecise domains.',
    color: '#D97706',
    bg: '#FFFBEB',
  },
];

const themes = [
  { label: 'Medical AI', icon: FlaskConical },
  { label: 'Computer Vision', icon: Eye },
  { label: 'Biomedical Image Analysis', icon: FlaskConical },
  { label: 'Explainable AI', icon: Brain },
  { label: 'Edge Computing', icon: Server },
  { label: 'Federated Learning', icon: Network },
  { label: 'Agriculture AI', icon: Leaf },
  { label: 'Intelligent Systems', icon: Cpu },
  { label: 'Autonomous Systems', icon: Car },
  { label: 'Natural Language Processing', icon: Brain },
  { label: 'Large Language Models', icon: Brain },
  { label: 'Foundation Models', icon: Network },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: 'easeOut' },
  }),
};

export default function ResearchAreas() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="research" className="section bg-alt" aria-label="Research Areas" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="text-center mb-12"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={0}
        >
          <p className="section-eyebrow justify-center mb-3">Research</p>
          <h2 className="heading-xl mb-4" style={{ fontFamily: 'Manrope' }}>Research Interests</h2>
          <p className="text-[#475569] max-w-xl mx-auto text-[0.95rem]">
            Core research specializations and cross-disciplinary research themes derived from documented work.
          </p>
        </motion.div>

        {/* Core areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {coreAreas.map((area, i) => (
            <motion.div
              key={area.title}
              className="card p-6"
              variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={i + 1}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: area.bg }}
              >
                <area.icon size={22} style={{ color: area.color }} aria-hidden="true" />
              </div>
              <h3 className="heading-md mb-2" style={{ fontFamily: 'Manrope', fontSize: '1.05rem' }}>{area.title}</h3>
              <p className="text-[#475569] text-[0.85rem] leading-relaxed">{area.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Research themes */}
        <motion.div
          className="bg-white rounded-2xl border border-[#E2E8F0] p-8"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={5}
        >
          <p className="text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-4">
            Research Themes — Derived from Documented Work
          </p>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <span key={t.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[0.8rem] font-medium text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-150">
                <t.icon size={12} aria-hidden="true" />
                {t.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
