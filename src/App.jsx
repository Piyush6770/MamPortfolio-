import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { JourneyTimelineSection } from './sections/JourneyTimelineSection';
import { ResearchSection } from './sections/ResearchSection';
import { PublicationsSection } from './sections/PublicationsSection';
import { PatentsSection } from './sections/PatentsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { GuidanceSection } from './sections/GuidanceSection';
import { AcademicProfileSection } from './sections/AcademicProfileSection';
import { AchievementsSection } from './sections/AchievementsSection';
import { BooksSection } from './sections/BooksSection';
import { TalksEventsSection } from './sections/TalksEventsSection';
import { GallerySection } from './sections/GallerySection';
import { CollaborationSection } from './sections/CollaborationSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

function getInitialPage() {
  const hash = window.location.hash.replace(/^#\//, '');
  const validPages = [
    'home', 'about', 'journey', 'research', 'publications',
    'patents', 'projects', 'guidance', 'academic', 'books',
    'talks', 'gallery', 'contact'
  ];
  if (validPages.includes(hash)) {
    return hash;
  }
  return 'home';
}

export function App() {
  const [activePage, setActivePage] = useState(getInitialPage);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(getInitialPage());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <div className="page-container space-y-4">
            <HeroSection setActivePage={setActivePage} />
            <AboutSection />
            <AchievementsSection />
          </div>
        );
      case 'about':
        return (
          <div className="page-container">
            <AboutSection />
          </div>
        );
      case 'journey':
        return (
          <div className="page-container space-y-4">
            <JourneyTimelineSection />
            <AchievementsSection />
          </div>
        );
      case 'research':
        return (
          <div className="page-container">
            <ResearchSection />
          </div>
        );
      case 'publications':
        return (
          <div className="page-container">
            <PublicationsSection />
          </div>
        );
      case 'patents':
        return (
          <div className="page-container">
            <PatentsSection />
          </div>
        );
      case 'projects':
        return (
          <div className="page-container">
            <ProjectsSection />
          </div>
        );
      case 'guidance':
        return (
          <div className="page-container">
            <GuidanceSection />
          </div>
        );
      case 'academic':
        return (
          <div className="page-container">
            <AcademicProfileSection />
          </div>
        );
      case 'books':
        return (
          <div className="page-container">
            <BooksSection />
          </div>
        );
      case 'talks':
        return (
          <div className="page-container">
            <TalksEventsSection />
          </div>
        );
      case 'gallery':
        return (
          <div className="page-container">
            <GallerySection />
          </div>
        );
      case 'contact':
        return (
          <div className="page-container space-y-4">
            <CollaborationSection />
            <ContactSection />
          </div>
        );
      default:
        return <HeroSection setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="flex-grow pt-16">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Floating Scroll To Top */}
      <ScrollToTop />
    </div>
  );
}

export default App;
