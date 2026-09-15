import { Handshake, Microscope, Building2, BookOpen, ArrowRight, MessageSquare } from 'lucide-react';

export const CollaborationSection = () => {
  const types = [
    { title: "Research Collaboration", icon: Microscope, desc: "Joint research in AI, Deep Learning, Fuzzy Systems, and Medical Image Processing with academic and industrial labs." },
    { title: "Industry Consultancy", icon: Building2, desc: "Data analytics, ML model optimization, prototype validation, and AI solutions for industry partners." },
    { title: "Academic MoUs & Partnerships", icon: Handshake, desc: "Centre of Excellence setups, joint FDPs, student exchange, and research internships." },
    { title: "Keynotes & Expert Lectures", icon: BookOpen, desc: "Resource person for FDPs, STTPs, international conferences, AICTE refresher courses." },
  ];

  return (
    <section id="collaborate" className="py-16 bg-[#1e3a5f] dark:bg-[#0c1e35] border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300 block mb-2">PARTNERSHIPS & OPPORTUNITIES</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{fontFamily: "'Merriweather', serif"}}>
            Academic & Research Collaboration
          </h2>
          <p className="text-sm text-blue-200 mt-2 leading-relaxed">
            Inviting researchers, industry professionals, and institutions to collaborate on high-impact AI research projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {types.map((item, i) => (
            <div key={i} className="bg-white/8 border border-white/10 rounded-xl p-5 flex items-start gap-3 hover:bg-white/12 transition-colors">
              <div className="p-2.5 bg-blue-500 text-white rounded shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1" style={{fontFamily: "'Merriweather', serif"}}>{item.title}</h3>
                <p className="text-xs text-blue-200 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/8 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white" style={{fontFamily: "'Merriweather', serif"}}>Have a Research Proposal?</h3>
            <p className="text-xs text-blue-200 mt-0.5">Reach out to discuss joint proposals, consultancy, or keynote invitations.</p>
          </div>
          <a href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm rounded transition-all shrink-0 cursor-pointer">
            <MessageSquare className="w-4 h-4" /> Send Inquiry <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
