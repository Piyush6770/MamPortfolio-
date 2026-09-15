import { GraduationCap, Mail, MapPin, Phone, ExternalLink, ChevronRight } from 'lucide-react';
import { facultyData } from '../data/facultyData';

export const Footer = ({ setActivePage }) => {
  const navigateTo = (pageId) => {
    if (setActivePage) {
      setActivePage(pageId);
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.location.hash = `#/${pageId}`;
    }
  };

  return (
    <footer className="bg-[#1e3a5f] text-white text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-left">
          
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-400/40 shrink-0">
                <img src="/dr-swati-shinde.jpg" alt={facultyData.name} className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="text-base font-bold text-white" style={{fontFamily: "'Merriweather', serif"}}>
                Dr. Swati Vijay Shinde
              </h3>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed">
              {facultyData.primaryDesignation}. Specialized in Artificial Intelligence, Machine Learning, Deep Learning, and Medical Diagnostics.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-3">
              Website Pages
            </h4>
            <ul className="space-y-1.5 text-xs text-blue-100">
              {[
                ['about', 'About & Bio'],
                ['research', 'Research Areas & Labs'],
                ['publications', 'Research Publications'],
                ['patents', 'Patents & Copyrights'],
                ['projects', 'Projects & Grants'],
                ['guidance', 'Research Mentorship'],
              ].map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => navigateTo(id)} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                    <ChevronRight className="w-3 h-3 text-blue-400" /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Academic Profiles */}
          <div>
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-3">
              Academic Profiles
            </h4>
            <ul className="space-y-1.5 text-xs text-blue-100">
              {[
                [facultyData.socialLinks.googleScholar, 'Google Scholar (1040+ Citations)'],
                [facultyData.socialLinks.scopus, 'Scopus Profile (73 Pubs)'],
                [facultyData.socialLinks.linkedIn, 'LinkedIn Profile'],
                [facultyData.socialLinks.youtube, 'YouTube Channel'],
              ].map(([href, label]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center justify-between group transition-colors">
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 text-blue-400 group-hover:text-white" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-3">
              Office Information
            </h4>
            <ul className="space-y-2.5 text-xs text-blue-100">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{facultyData.institution}, {facultyData.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${facultyData.emails[0]}`} className="hover:text-white transition-colors">
                  {facultyData.emails[0]}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{facultyData.phoneOffice}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-xs text-blue-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p>© 2026 Dr. Swati Vijay Shinde. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {[['home','Home'],['about','About'],['publications','Publications'],['patents','Patents'],['books','Books'],['contact','Contact']].map(([id, label]) => (
              <button key={id} onClick={() => navigateTo(id)} className="hover:text-white transition-colors cursor-pointer">{label}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
