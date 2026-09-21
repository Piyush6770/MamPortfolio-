import { SectionHeader } from '../components/SectionHeader';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { CheckCircle } from 'lucide-react';

export const ProjectsSection = () => {
  const { projects } = usePortfolioData();

  return (
    <section id="projects" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader
          badge="GRANTS & SPONSORSHIPS"
          title="Research Projects & Funding"
          subtitle="Competitive research grants, sponsored industrial projects, and consultancy outcomes totaling over ₹ 54+ Lakhs."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project.id} className="glass-card rounded-xl p-5 hover-lift flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="badge-accent">{project.category}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    {project.status || 'Completed'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-2" style={{ fontFamily: "'Merriweather', serif" }}>
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Agency:</strong> {project.agency}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mt-4 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">{project.amount}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Role:</span>
                  <span className="font-medium">{project.role} ({project.period})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
