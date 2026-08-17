import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Download, ArrowRight } from 'lucide-react';

// Minimal SVG neural-network background
function NeuralSVG() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-[0.12]"
      fill="none"
    >
      {/* Nodes */}
      {[
        [60,80],[60,180],[60,280],
        [180,40],[180,140],[180,240],[180,340],
        [300,80],[300,180],[300,280],
        [360,140],[360,240],
      ].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="#2563EB" />
      ))}
      {/* Edges layer 1→2 */}
      {[[60,80,180,40],[60,80,180,140],[60,180,180,40],[60,180,180,140],[60,180,180,240],[60,280,180,140],[60,280,180,240],[60,280,180,340]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2563EB" strokeWidth="1.2" />
      ))}
      {/* Edges layer 2→3 */}
      {[[180,40,300,80],[180,140,300,80],[180,140,300,180],[180,240,300,180],[180,240,300,280],[180,340,300,280]].map(([x1,y1,x2,y2],i)=>(
        <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2563EB" strokeWidth="1.2" />
      ))}
      {/* Edges layer 3→4 */}
      {[[300,80,360,140],[300,180,360,140],[300,180,360,240],[300,280,360,240]].map(([x1,y1,x2,y2],i)=>(
        <line key={`c${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2563EB" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

const researchTags = [
  'Artificial Intelligence',
  'Machine Learning',
  'Deep Learning',
  'Soft Computing',
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/swati-shinde.jpg';
    img.onload = () => setHasPhoto(true);
  }, []);

  const handleScroll = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 pb-12 bg-[#F8FAFC] overflow-hidden"
      aria-label="Hero — Introduction"
    >
      {/* Subtle top border gradient */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #2563EB44, transparent)' }}
      />

      <div className="container mx-auto px-6 max-w-[1280px] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Text */}
          <div>
            <motion.p
              className="section-eyebrow mb-4"
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
            >
              Academic Portfolio
            </motion.p>

            <motion.h1
              className="font-heading text-[2.8rem] lg:text-[3.5rem] font-extrabold leading-[1.1] text-[#0F172A] mb-4"
              style={{ fontFamily: 'Manrope, sans-serif' }}
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
            >
              Dr. Swati&nbsp;V.&nbsp;Shinde
            </motion.h1>

            <motion.div
              className="mb-5"
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
            >
              <p className="text-[#2563EB] font-semibold text-[1rem] mb-1">
                Professor • Researcher • Academic Leader
              </p>
              <p className="text-[#475569] text-[0.95rem] leading-relaxed">
                Dean – Management Information System<br />
                <span className="text-[#0F172A] font-medium">Pimpri Chinchwad College of Engineering, Pune</span>
              </p>
            </motion.div>

            <motion.blockquote
              className="text-[1.2rem] text-[#0F172A] font-medium leading-snug mb-6 pl-4 border-l-2 border-[#2563EB]"
              style={{ fontFamily: 'Manrope, sans-serif' }}
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
            >
              Advancing Artificial Intelligence through Research, Innovation and Academic Leadership.
            </motion.blockquote>

            {/* Research tags */}
            <motion.div
              className="flex flex-wrap gap-2 mb-8"
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
            >
              {researchTags.map((tag) => (
                <span key={tag} className="research-tag">{tag}</span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-3"
              variants={fadeUp} initial="hidden" animate="visible" custom={5}
            >
              <a
                href="#research"
                onClick={(e) => handleScroll(e, '#research')}
                className="btn-primary"
                aria-label="Explore Research"
              >
                Explore Research <ArrowRight size={16} />
              </a>
              <a
                href="https://scholar.google.com/citations?user=8RoLEssAAAAJ"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                aria-label="View Google Scholar profile (opens in new tab)"
              >
                <BookOpen size={16} />
                Google Scholar
                <ExternalLink size={13} />
              </a>
              <a
                href="/swati-shinde-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-[#475569] hover:text-[#2563EB] transition-colors duration-150"
                aria-label="Download CV (PDF)"
              >
                <Download size={15} />
                Download CV
              </a>
            </motion.div>
          </div>

          {/* RIGHT — Portrait */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Neural network background */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-[380px] h-[380px] lg:w-[440px] lg:h-[440px]">
                <NeuralSVG />
              </div>
            </div>

            {/* Portrait card */}
            <div className="relative z-10">
              {hasPhoto ? (
                <img
                  src="/swati-shinde.jpg"
                  alt="Dr. Swati V. Shinde — Professor and Dean, PCCOE Pune"
                  className="w-[260px] h-[320px] lg:w-[300px] lg:h-[370px] object-cover rounded-2xl shadow-2xl border-4 border-white"
                  style={{ boxShadow: '0 24px 80px rgba(37,99,235,0.18)' }}
                />
              ) : (
                <div
                  className="w-[260px] h-[320px] lg:w-[300px] lg:h-[370px] rounded-2xl border-4 border-white flex flex-col items-center justify-center bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]"
                  style={{ boxShadow: '0 24px 80px rgba(37,99,235,0.18)' }}
                  role="img"
                  aria-label="Profile photo placeholder — add swati-shinde.jpg to public/"
                >
                  <div className="w-20 h-20 rounded-full bg-[#2563EB]/15 flex items-center justify-center mb-4">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <circle cx="20" cy="15" r="8" fill="#2563EB" fillOpacity="0.4" />
                      <ellipse cx="20" cy="33" rx="14" ry="8" fill="#2563EB" fillOpacity="0.25" />
                    </svg>
                  </div>
                  <p className="text-[#475569] text-xs text-center px-4 leading-relaxed">
                    Add <code className="text-[#2563EB] bg-[#EFF6FF] px-1 py-0.5 rounded text-[10px]">swati-shinde.jpg</code>
                    <br />to <code className="text-[#2563EB] bg-[#EFF6FF] px-1 py-0.5 rounded text-[10px]">public/</code>
                  </p>
                </div>
              )}

              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -left-6 bg-white rounded-xl px-4 py-2.5 shadow-lg border border-[#E2E8F0] flex items-center gap-2"
                aria-hidden="true"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[12px] font-semibold text-[#0F172A]">25+ Years</span>
                <span className="text-[12px] text-[#475569]">of Academic Excellence</span>
              </div>

              {/* Top badge */}
              <div
                className="absolute -top-4 -right-4 bg-[#2563EB] rounded-xl px-3 py-2 shadow-lg flex flex-col items-center"
                aria-hidden="true"
              >
                <span className="text-white font-bold text-lg leading-none" style={{ fontFamily: 'Manrope' }}>1040+</span>
                <span className="text-blue-200 text-[10px] font-medium">Citations</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
