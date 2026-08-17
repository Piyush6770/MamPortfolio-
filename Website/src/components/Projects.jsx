import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import { ArrowRight, Building2, Calendar } from 'lucide-react';

function statusBadge(status) {
  if (status === 'Completed') return 'badge-green';
  if (status === 'Ongoing') return 'badge-blue';
  return 'badge-slate';
}

function roleBadge(role) {
  if (!role) return null;
  return role === 'Principal Investigator' ? 'badge-purple' : 'badge-slate';
}

const SHOW_INITIAL = 6;

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? projects : projects.slice(0, SHOW_INITIAL);

  return (
    <section id="projects" className="section bg-alt" aria-label="Research Projects" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="section-eyebrow mb-3">Funded Research</p>
            <h2 className="heading-xl" style={{ fontFamily: 'Manrope' }}>Research Projects</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-blue">{projects.filter(p => p.status === 'Ongoing').length} Ongoing</span>
            <span className="badge badge-green">{projects.filter(p => p.status === 'Completed').length} Completed</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {displayed.map((project, i) => (
              <motion.article
                key={project.id}
                className="card p-6 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.07 }}
                aria-label={`Project: ${project.shortTitle}`}
              >
                {/* Status + role */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className={`badge ${statusBadge(project.status)}`}>{project.status}</span>
                  {project.role && (
                    <span className={`badge ${roleBadge(project.role)}`}>{project.role}</span>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-[#0F172A] text-[0.95rem] leading-snug mb-2 flex-1"
                  style={{ fontFamily: 'Manrope' }}
                >
                  {project.shortTitle}
                </h3>

                {/* Description */}
                <p className="text-[#475569] text-[0.82rem] leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                <hr className="divider mb-4" />

                {/* Meta */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[0.8rem] text-[#475569]">
                    <Building2 size={13} className="text-[#2563EB] flex-shrink-0" aria-hidden="true" />
                    <span className="font-medium text-[#0F172A]">{project.agency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.8rem] text-[#475569]">
                    <Calendar size={13} className="text-[#2563EB] flex-shrink-0" aria-hidden="true" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="text-[0.9rem] font-bold text-[#2563EB]" style={{ fontFamily: 'Manrope' }}>
                    {project.amount}
                  </div>
                </div>

                {/* Tags */}
                {project.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="badge badge-slate text-[10px]">{tag}</span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Show more / less */}
        {projects.length > SHOW_INITIAL && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => setShowAll((v) => !v)}
              className="btn-outline"
              aria-label={showAll ? 'Show fewer projects' : 'View all projects'}
            >
              {showAll ? 'Show Less' : `View All ${projects.length} Projects`}
              <ArrowRight size={16} className={`transition-transform duration-200 ${showAll ? 'rotate-90' : ''}`} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
