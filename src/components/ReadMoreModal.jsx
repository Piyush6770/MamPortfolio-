import { useEffect } from 'react';
import { X, Award, GraduationCap, Building2, BookOpen, CheckCircle, ShieldCheck } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';

export const ReadMoreModal = ({ isOpen, onClose }) => {
  const { faculty } = usePortfolioData();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{faculty.name}</h3>
              <p className="text-xs text-teal-300 font-medium">{faculty.primaryDesignation}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Biography"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed custom-scrollbar">
          {/* Biography Paragraphs */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Full Professional Biography
            </h4>
            <div className="space-y-4 text-slate-600 dark:text-slate-300">
              {(faculty.fullBioParagraphs || []).map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          </div>

          {/* Academic Profile Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-500" />
                Institutional Affiliation
              </h5>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                <strong>Department:</strong> {faculty.department}<br />
                <strong>Institute:</strong> {faculty.institution}<br />
                <strong>Location:</strong> {faculty.address}
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-500" />
                Experience Summary
              </h5>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                <strong>Total Experience:</strong> {faculty.totalExperience}<br />
                <strong>Approved Experience:</strong> {faculty.approvedExperience}<br />
                <strong>Ph.D. Guide Status:</strong> Recognized SPPU Doctoral Guide
              </p>
            </div>
          </div>

          {/* Major Certifications */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Global Certifications & Credentials
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              {(faculty.certifications || []).map((cert, index) => (
                <li key={index} className="flex items-start gap-2 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                  <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span className="text-slate-800 dark:text-slate-200">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Biography
          </button>
        </div>
      </div>
    </div>
  );
};
