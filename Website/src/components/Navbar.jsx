import { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Publications', href: '#publications' },
  { label: 'Patents', href: '#patents' },
  { label: 'Books', href: '#books' },
  { label: 'Mentorship', href: '#scholars' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Awards', href: '#awards' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] py-2 shadow-sm'
            : 'bg-transparent py-4'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-6 flex items-center justify-between max-w-[1280px]">
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="font-heading font-800 text-[15px] tracking-tight text-[#0F172A] hover:text-[#2563EB] transition-colors duration-150 whitespace-nowrap"
            aria-label="Dr. Swati V. Shinde — Back to top"
          >
            <span className="font-bold" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800 }}>SWATI V. SHINDE</span>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-1.5 text-[13px] font-medium text-[#475569] hover:text-[#2563EB] rounded-md hover:bg-[#EFF6FF] transition-all duration-150 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/swati-shinde-cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1D4ED8] transition-all duration-150 shadow-sm hover:shadow-md"
              aria-label="Download CV (PDF)"
            >
              <Download size={13} />
              Download CV
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors duration-150"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-white flex flex-col pt-20 px-6 pb-8 lg:hidden overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-3 text-[15px] font-medium text-[#0F172A] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/swati-shinde-cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 py-3 bg-[#2563EB] text-white text-[15px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all duration-150"
              aria-label="Download CV (PDF)"
            >
              <Download size={16} />
              Download CV
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
