import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { label: 'Google Scholar Citations', value: 1040, suffix: '+', highlight: true },
  { label: 'Google Scholar h-index', value: 16, suffix: '', highlight: false },
  { label: 'Scopus Publications', value: 73, suffix: '', highlight: false },
  { label: 'Scopus Citations', value: 460, suffix: '', highlight: false },
  { label: 'Scopus h-index', value: 11, suffix: '', highlight: false },
  { label: 'Books Authored / Edited', value: 7, suffix: '', highlight: false },
  { label: 'Book Chapters', value: 13, suffix: '', highlight: false },
  { label: 'Years Experience', value: 25, suffix: '+', highlight: true },
];

function CountUp({ target, duration = 1500, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref} aria-label={`${target}${suffix}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function ImpactStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id="stats"
      className="bg-[#0F172A] py-14"
      aria-label="Research Impact Statistics"
      ref={ref}
    >
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-white/10 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`flex flex-col items-center justify-center py-8 px-3 text-center ${
                stat.highlight ? 'bg-[#2563EB]' : 'bg-[#1E293B]'
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.06, ease: 'easeOut' }}
            >
              <p
                className="text-white font-extrabold text-[2rem] leading-none mb-1.5"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className={`text-[11px] font-medium leading-tight ${stat.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
