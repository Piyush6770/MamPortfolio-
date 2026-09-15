import { useState, useRef, useEffect } from 'react';
import { Menu, X, Sun, Moon, ChevronDown, GraduationCap, Mail } from 'lucide-react';
import { facultyData } from '../data/facultyData';

const navGroups = [
  { label: 'Home', id: 'home', single: true },
  { label: 'About', id: 'about', single: true },
  {
    label: 'Research',
    children: [
      { label: 'Research Areas & Labs', id: 'research' },
      { label: 'Publications', id: 'publications' },
      { label: 'Patents & Copyrights', id: 'patents' },
      { label: 'Projects & Grants', id: 'projects' },
    ],
  },
  {
    label: 'Academic',
    children: [
      { label: 'Journey & CV', id: 'journey' },
      { label: 'Research Mentorship', id: 'guidance' },
      { label: 'Academic Profile', id: 'academic' },
      { label: 'Books & Chapters', id: 'books' },
    ],
  },
  {
    label: 'Activities',
    children: [
      { label: 'Talks & Events', id: 'talks' },
      { label: 'Gallery', id: 'gallery' },
    ],
  },
  { label: 'Contact', id: 'contact', single: true },
];

function DropdownMenu({ group, activePage, onNav, closeAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = group.children?.some(c => c.id === activePage);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer
          ${isActive
            ? 'bg-[#1e3a5f] text-white'
            : 'text-slate-600 hover:text-[#1e3a5f] hover:bg-slate-100'
          }`}
      >
        {group.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
          {group.children.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNav(item.id); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer
                ${activePage === item.id
                  ? 'bg-slate-100 text-[#1e3a5f] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#1e3a5f]'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const Navbar = ({ activePage, setActivePage, darkMode, setDarkMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const handleNav = (pageId) => {
    setActivePage(pageId);
    setMobileOpen(false);
    setMobileExpanded(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.location.hash = `#/${pageId}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm shrink-0">
              <img src="/dr-swati-shinde.jpg" alt={facultyData.name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-sm font-bold text-[#1e3a5f] dark:text-white">Dr. Swati V. Shinde</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Dean MIS · Professor · PCCoE</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navGroups.map((group) =>
              group.single ? (
                <button
                  key={group.id}
                  onClick={() => handleNav(group.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer
                    ${activePage === group.id
                      ? 'bg-[#1e3a5f] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#1e3a5f] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  {group.label}
                </button>
              ) : (
                <DropdownMenu
                  key={group.label}
                  group={group}
                  activePage={activePage}
                  onNav={handleNav}
                />
              )
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1e3a5f] dark:hover:text-white transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleNav('contact')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" /> Contact
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 py-3 space-y-1">
            {navGroups.map((group) =>
              group.single ? (
                <button
                  key={group.id}
                  onClick={() => handleNav(group.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                    ${activePage === group.id
                      ? 'bg-[#1e3a5f] text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {group.label}
                </button>
              ) : (
                <div key={group.label}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === group.label ? null : group.label)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {group.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === group.label ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded === group.label && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                      {group.children.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNav(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer
                            ${activePage === item.id
                              ? 'text-[#1e3a5f] dark:text-blue-400 font-semibold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-[#1e3a5f] dark:hover:text-blue-300'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </header>
  );
};
