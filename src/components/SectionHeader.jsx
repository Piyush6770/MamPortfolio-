export const SectionHeader = ({ badge, title, subtitle, centered = false }) => {
  return (
    <div className={`mb-10 ${centered ? 'text-center max-w-2xl mx-auto' : 'text-left max-w-4xl'}`}>
      {badge && (
        <span className="badge-accent mb-3 inline-block">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1e3a5f] dark:text-blue-100 tracking-tight leading-tight mt-1" style={{fontFamily: "'Merriweather', Georgia, serif"}}>
        {title}
      </h2>
      <div className={`h-1 w-12 bg-blue-600 rounded mt-3 mb-3 ${centered ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
