import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, MapPin, BookOpen, Linkedin, ExternalLink } from 'lucide-react';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="section bg-[#0F172A]" aria-label="Contact" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <p className="text-[#93C5FD] text-[0.7rem] font-semibold uppercase tracking-widest mb-4">Get in Touch</p>
            <h2
              className="text-[2.5rem] lg:text-[3rem] font-extrabold text-white leading-tight mb-4"
              style={{ fontFamily: 'Manrope' }}
            >
              Let's Connect
            </h2>
            <p className="text-[#94A3B8] text-[1rem] leading-relaxed mb-8 max-w-sm">
              For research collaboration, academic mentoring, funded projects, workshops, invited talks and professional engagements.
            </p>

            {/* Contact details */}
            <div className="space-y-4">
              <a
                href="mailto:swaatii.shinde@gmail.com"
                className="flex items-center gap-3 group"
                aria-label="Send email to Dr. Shinde"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563EB] transition-colors duration-150">
                  <Mail size={18} className="text-[#93C5FD] group-hover:text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[0.7rem] text-[#475569] uppercase tracking-wide font-medium">Email</p>
                  <p className="text-white text-[0.9rem] font-medium group-hover:text-[#93C5FD] transition-colors duration-150">
                    swaatii.shinde@gmail.com
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#93C5FD]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[0.7rem] text-[#475569] uppercase tracking-wide font-medium">Institution</p>
                  <p className="text-white text-[0.9rem] font-medium">
                    Pimpri Chinchwad College of Engineering
                  </p>
                  <p className="text-[#94A3B8] text-[0.82rem]">Sector No. 26, Pradhikaran, Pune 411044</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <p className="text-[#94A3B8] text-[0.82rem] uppercase tracking-wide font-medium mb-4">Research Profiles</p>

            {[
              { label: 'Google Scholar', desc: '1040+ citations • h-index 16', url: 'https://scholar.google.com/citations?user=8RoLEssAAAAJ', icon: BookOpen, color: '#93C5FD' },
              { label: 'Scopus', desc: '73 publications • h-index 11', url: 'https://bit.ly/3d7dFAx', icon: ExternalLink, color: '#FCD34D' },
              { label: 'LinkedIn', desc: 'Prof. Dr. Swati Vijay Shinde', url: 'https://www.linkedin.com/in/prof-dr-swati-vijay-shinde-67670634', icon: Linkedin, color: '#60A5FA' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[#1E293B] hover:bg-[#2563EB] transition-all duration-200 group"
                aria-label={`${link.label} (opens in new tab)`}
              >
                <link.icon size={20} style={{ color: link.color }} className="flex-shrink-0 group-hover:text-white" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-semibold text-white text-[0.9rem]">{link.label}</p>
                  <p className="text-[#94A3B8] text-[0.78rem] group-hover:text-blue-100">{link.desc}</p>
                </div>
                <ExternalLink size={14} className="text-[#475569] group-hover:text-white" aria-hidden="true" />
              </a>
            ))}

            {/* Collaboration CTA */}
            <div className="mt-6 p-6 rounded-2xl border border-[#1E293B] bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
              <p className="text-white font-semibold text-[0.95rem] mb-2" style={{ fontFamily: 'Manrope' }}>
                Interested in Research Collaboration?
              </p>
              <p className="text-[#94A3B8] text-[0.82rem] mb-4 leading-relaxed">
                Dr. Shinde welcomes proposals in AI, ML, Medical Imaging, and related interdisciplinary areas.
              </p>
              <a
                href="mailto:swaatii.shinde@gmail.com?subject=Research Collaboration Enquiry"
                className="btn-primary text-[0.85rem] px-4 py-2"
                aria-label="Send research collaboration email"
              >
                <Mail size={14} />
                Reach Out
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
