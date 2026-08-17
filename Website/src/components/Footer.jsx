import { BookOpen, Linkedin, ExternalLink, Mail } from 'lucide-react';

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Research', href: '#research' },
  { label: 'Publications', href: '#publications' },
  { label: 'Projects', href: '#projects' },
  { label: 'Books', href: '#books' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=8RoLEssAAAAJ', icon: BookOpen },
  { label: 'Scopus', href: 'https://bit.ly/3d7dFAx', icon: ExternalLink },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prof-dr-swati-vijay-shinde-67670634', icon: Linkedin },
  { label: 'Email', href: 'mailto:swaatii.shinde@gmail.com', icon: Mail },
];

export default function Footer() {
  const handleNav = (e, href) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="bg-[#0A0F1A] text-white" role="contentinfo">
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-14 border-b border-white/10">

          {/* Brand */}
          <div>
            <p className="font-extrabold text-[1.1rem] mb-1 tracking-tight" style={{ fontFamily: 'Manrope' }}>
              Dr. Swati V. Shinde
            </p>
            <p className="text-[#94A3B8] text-[0.82rem] mb-4">Professor • Researcher • Academic Leader</p>
            <p className="text-[#475569] text-[0.78rem] leading-relaxed">
              Department of Computer Engineering<br />
              Pimpri Chinchwad College of Engineering<br />
              Pune, Maharashtra 411044
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-[0.7rem] font-semibold text-[#475569] uppercase tracking-widest mb-4">Quick Links</p>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNav(e, link.href)}
                      className="text-[#94A3B8] hover:text-white text-[0.85rem] transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social */}
          <div>
            <p className="text-[0.7rem] font-semibold text-[#475569] uppercase tracking-widest mb-4">Research & Social</p>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-white text-[0.85rem] transition-colors duration-150"
                    aria-label={`${link.label} (opens in new tab)`}
                  >
                    <link.icon size={14} aria-hidden="true" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#475569] text-[0.78rem]">
            © 2026 Dr. Swati V. Shinde. All rights reserved.
          </p>
          <p className="text-[#475569] text-[0.78rem] text-center">
            Professor, Computer Engineering · PCCOE, Pune
          </p>
        </div>
      </div>
    </footer>
  );
}
