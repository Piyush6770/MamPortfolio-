import { useEffect } from 'react';
import { X, Calendar, Tag, Stethoscope, Award, Users, Cpu, Trophy, BookOpen, Terminal, FileCheck, GraduationCap } from 'lucide-react';

export const LightboxModal = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const renderIcon = (iconName) => {
    const props = { className: "w-16 h-16 text-white drop-shadow-md" };
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Terminal': return <Terminal {...props} />;
      case 'FileCheck': return <FileCheck {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Visual Banner */}
        <div className={`relative h-64 bg-gradient-to-br ${item.gradient} flex flex-col items-center justify-center p-6 text-center shadow-inner`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs mb-3 border border-white/20">
            {renderIcon(item.iconName)}
          </div>
          <span className="px-3 py-1 bg-black/30 backdrop-blur-md text-white rounded-full text-xs font-semibold uppercase tracking-wider">
            {item.category}
          </span>
        </div>

        {/* Content Details */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Tag className="w-3.5 h-3.5 text-teal-500" />
              Category: {item.category}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-teal-500" />
              {item.date}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
            {item.title}
          </h3>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
