import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { patents, copyrights } from '../data/patents';
import { ShieldCheck, Clock, FileClock, Lightbulb } from 'lucide-react';

function statusConfig(status) {
  if (status === 'granted') return { label: 'Granted', cls: 'badge-green', icon: ShieldCheck };
  if (status === 'published') return { label: 'Published', cls: 'badge-blue', icon: FileClock };
  return { label: 'Filed', cls: 'badge-amber', icon: Clock };
}

function typeConfig(type) {
  if (type === 'copyright') return { label: 'Copyright', cls: 'badge-purple' };
  if (type === 'design') return { label: 'Design Patent', cls: 'badge-slate' };
  return { label: 'Patent', cls: 'badge-slate' };
}

export default function Patents() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="patents" className="section bg-alt" aria-label="Patents and Copyrights" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="section-eyebrow mb-3">Innovation</p>
            <h2 className="heading-xl" style={{ fontFamily: 'Manrope' }}>Patents & Innovation</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-green">{patents.filter(p => p.status === 'granted').length} Granted</span>
            <span className="badge badge-blue">{patents.filter(p => p.status === 'published').length} Published</span>
            <span className="badge badge-amber">{patents.filter(p => p.status === 'filed').length} Filed</span>
          </div>
        </motion.div>

        {/* Patents */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-[#2563EB]" aria-hidden="true" />
            <h3 className="heading-md text-[1rem]" style={{ fontFamily: 'Manrope' }}>Patents ({patents.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patents.map((pat, i) => {
              const sc = statusConfig(pat.status);
              const tc = typeConfig(pat.type);
              const StatusIcon = sc.icon;
              return (
                <motion.article
                  key={pat.id}
                  className={`card p-5 ${pat.status === 'granted' ? 'border-green-200 bg-green-50/30' : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: Math.min(i, 9) * 0.05 }}
                  aria-label={`Patent: ${pat.title} — ${sc.label}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${pat.status === 'granted' ? 'bg-green-100' : 'bg-[#EFF6FF]'}`}>
                      <StatusIcon size={15} className={pat.status === 'granted' ? 'text-green-600' : 'text-[#2563EB]'} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className={`badge ${sc.cls}`}>{sc.label}</span>
                        <span className={`badge ${tc.cls}`}>{tc.label}</span>
                        <span className="badge badge-slate">{pat.filingDate}</span>
                      </div>
                      <h4 className="font-semibold text-[#0F172A] text-[0.88rem] leading-snug mb-1.5" style={{ fontFamily: 'Manrope' }}>
                        {pat.title}
                      </h4>
                      <div className="text-[0.75rem] text-[#475569] space-y-0.5">
                        <p><span className="font-medium">Application No.:</span> {pat.applicationNo}</p>
                        <p><span className="font-medium">Inventors:</span> {pat.inventors}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Copyrights */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-[#7C3AED]" aria-hidden="true" />
            <h3 className="heading-md text-[1rem]" style={{ fontFamily: 'Manrope' }}>Software Copyrights ({copyrights.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {copyrights.map((cr, i) => (
              <motion.article
                key={cr.id}
                className="card p-5 border-purple-100 bg-purple-50/20"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                aria-label={`Copyright: ${cr.title}`}
              >
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="badge badge-purple">Copyright</span>
                  <span className="badge badge-green">Granted</span>
                  <span className="badge badge-slate">{cr.filingDate}</span>
                </div>
                <h4 className="font-semibold text-[#0F172A] text-[0.88rem] leading-snug mb-1.5" style={{ fontFamily: 'Manrope' }}>
                  {cr.title}
                </h4>
                <div className="text-[0.75rem] text-[#475569] space-y-0.5">
                  <p><span className="font-medium">Reg. No.:</span> {cr.applicationNo}</p>
                  <p><span className="font-medium">Authors:</span> {cr.authors}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
