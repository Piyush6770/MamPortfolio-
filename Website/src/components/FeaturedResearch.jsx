import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, FlaskConical, Calendar, IndianRupee } from 'lucide-react';

// Abstract medical-AI illustration using SVG
function MedicalAIIllustration() {
  return (
    <svg viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Background */}
      <rect width="360" height="260" rx="16" fill="#EFF6FF" />
      {/* Screen panel */}
      <rect x="40" y="30" width="200" height="150" rx="8" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
      {/* Cell grid */}
      {[0,1,2,3].map(row => [0,1,2,3].map(col => (
        <circle key={`${row}-${col}`}
          cx={64 + col * 44} cy={54 + row * 36} r={14}
          fill={['#DBEAFE','#BFDBFE','#93C5FD','#60A5FA'][(row+col)%4]}
          stroke="#93C5FD" strokeWidth="1"
        />
      )))}
      {/* Scanning line */}
      <rect x="40" y="102" width="200" height="2" fill="#2563EB" opacity="0.5" rx="1" />
      {/* AI output panel */}
      <rect x="256" y="30" width="84" height="150" rx="8" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
      <text x="265" y="55" fontSize="8" fontWeight="600" fill="#2563EB" fontFamily="Inter,sans-serif">DIAGNOSIS</text>
      {[
        { label: 'Normal', pct: 12, color: '#93C5FD' },
        { label: 'LSIL', pct: 8, color: '#60A5FA' },
        { label: 'HSIL', pct: 78, color: '#2563EB' },
        { label: 'SCC', pct: 2, color: '#1E40AF' },
      ].map((item, i) => (
        <g key={item.label}>
          <text x="265" y={73 + i * 26} fontSize="7" fill="#475569" fontFamily="Inter,sans-serif">{item.label}</text>
          <rect x="265" y={76 + i * 26} width={item.pct * 0.65} height="6" rx="3" fill={item.color} />
          <text x={268 + item.pct * 0.65} y={83 + i * 26} fontSize="6" fill="#475569" fontFamily="Inter,sans-serif">{item.pct}%</text>
        </g>
      ))}
      {/* Confidence badge */}
      <rect x="265" y="152" width="64" height="20" rx="6" fill="#DBEAFE" />
      <text x="297" y="165" fontSize="7" fontWeight="700" fill="#1D4ED8" fontFamily="Inter,sans-serif" textAnchor="middle">
        97.3% Conf.
      </text>
      {/* Device outline */}
      <rect x="40" y="195" width="300" height="45" rx="10" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
      <rect x="52" y="205" width="80" height="25" rx="5" fill="#EFF6FF" />
      <text x="92" y="222" fontSize="8" fontWeight="700" fill="#2563EB" fontFamily="Manrope,sans-serif" textAnchor="middle">CerviTester</text>
      <circle cx="185" cy="217" r="9" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5" />
      <path d="M181 217 L184 220 L189 214" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="205" y="213" fontSize="7" fill="#0F172A" fontFamily="Inter,sans-serif" fontWeight="600">DST Funded</text>
      <text x="205" y="223" fontSize="7" fill="#475569" fontFamily="Inter,sans-serif">₹35,70,576</text>
    </svg>
  );
}

export default function FeaturedResearch() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="featured-research" className="section bg-white" aria-label="Featured Research Project" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow mb-3">Featured Research</p>
          <h2 className="heading-xl" style={{ fontFamily: 'Manrope' }}>Flagship Project</h2>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] overflow-hidden"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: content */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="badge badge-blue">
                  <FlaskConical size={11} className="mr-1" aria-hidden="true" />
                  DST Funded
                </span>
                <span className="badge badge-green">Completed</span>
                <span className="badge badge-slate">Principal Investigator</span>
              </div>

              <h3
                className="text-[1.7rem] lg:text-[2rem] font-extrabold text-[#0F172A] leading-tight mb-4"
                style={{ fontFamily: 'Manrope' }}
              >
                CerviTester
              </h3>

              <p className="text-[#475569] text-[0.95rem] leading-relaxed mb-6">
                A Smart and Portable Screening Device for AI-Assisted Automated Diagnosis of Cervical Cancer in Low Resource Settings.
                Integrates deep learning-powered image analysis with portable medical hardware to enable cost-effective,
                accurate cervical cancer screening in under-resourced clinical environments.
              </p>

              {/* Key facts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: IndianRupee, label: 'Grant Amount', value: '₹35,70,576' },
                  { icon: Calendar, label: 'Duration', value: 'Jul 2021 – Jun 2023' },
                  { icon: FlaskConical, label: 'Funding Agency', value: 'DST – SERB' },
                ].map((fact) => (
                  <div key={fact.label} className="bg-white rounded-xl border border-[#E2E8F0] p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <fact.icon size={13} className="text-[#2563EB]" aria-hidden="true" />
                      <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wide">{fact.label}</span>
                    </div>
                    <p className="font-bold text-[#0F172A] text-[0.9rem]" style={{ fontFamily: 'Manrope' }}>{fact.value}</p>
                  </div>
                ))}
              </div>

              {/* Research areas */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['Medical AI', 'Computer Vision', 'Deep Learning', 'Biomedical Imaging', 'Portable Diagnostics'].map((tag) => (
                  <span key={tag} className="research-tag text-[0.75rem]">{tag}</span>
                ))}
              </div>

              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-primary self-start"
                aria-label="View all research projects"
              >
                Explore All Projects <ArrowRight size={16} />
              </a>
            </div>

            {/* Right: illustration */}
            <div className="relative flex items-center justify-center p-10 lg:p-14 bg-[#EFF6FF]/50">
              <div className="w-full max-w-[380px]">
                <MedicalAIIllustration />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
