import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { education } from '../data/experience';
import { GraduationCap } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="section bg-white" aria-label="About Dr. Swati V. Shinde" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT */}
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={0}>
            <p className="section-eyebrow mb-3">About</p>
            <h2
              className="heading-xl mb-6"
              style={{ fontFamily: 'Manrope, sans-serif', lineHeight: 1.1 }}
            >
              Researcher.<br />
              Educator.<br />
              Academic&nbsp;Leader.
            </h2>
            {/* Specializations */}
            <div className="flex flex-wrap gap-2">
              {['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Soft Computing', 'Medical AI', 'Computer Vision'].map((s) => (
                <span key={s} className="badge badge-blue">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={1}>
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-[#475569] text-[1rem] leading-relaxed mb-4">
                Dr. Swati V. Shinde is a Professor in the Department of Computer Engineering and Dean – Management
                Information System at <strong className="text-[#0F172A]">Pimpri Chinchwad College of Engineering (PCCOE), Pune</strong>.
                She holds a Ph.D. in Computer Science and Engineering from SGGS Institute of Engineering and Technology,
                Nanded, and brings over <strong className="text-[#0F172A]">25 years of academic and research experience</strong>.
              </p>
              <p className="text-[#475569] text-[1rem] leading-relaxed mb-4">
                Her research spans Artificial Intelligence, Machine Learning, Deep Learning and Soft Computing,
                with particular focus on <strong className="text-[#0F172A]">AI for medical imaging</strong>, cervical cancer detection,
                explainable AI, federated learning, and intelligent edge systems. She is the Principal Investigator of
                the DST-funded <strong className="text-[#0F172A]">CerviTester</strong> project — a portable AI-assisted screening
                device for cervical cancer diagnosis.
              </p>
              <p className="text-[#475569] text-[1rem] leading-relaxed">
                An <strong className="text-[#0F172A]">NVIDIA DLI Certified Instructor and University Ambassador</strong>,
                she has guided 2 doctoral scholars to completion with 4 ongoing, mentored 16 postgraduate researchers,
                and served in academic leadership roles including Dean R&D, Institute-level NBA Coordinator, and Head of Department.
                She has authored 7 books, 13 book chapters, 54 international journal publications, and 82 conference papers.
              </p>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <p className="text-[12px] font-semibold text-[#2563EB] uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap size={14} /> Education
              </p>
              {education.map((edu, i) => (
                <motion.div
                  key={i}
                  className="card p-4 hover:shadow-card-hover"
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  custom={2 + i}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#0F172A] text-[0.9rem]" style={{ fontFamily: 'Manrope' }}>
                        {edu.degree}
                      </p>
                      <p className="text-[#475569] text-[0.8rem]">{edu.institution}</p>
                      {edu.note && (
                        <p className="text-[#475569] text-[0.75rem] mt-0.5 italic">{edu.note}</p>
                      )}
                      <span className="badge badge-slate mt-1">{edu.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
