import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImpactStats from './components/ImpactStats';
import About from './components/About';
import ResearchAreas from './components/ResearchAreas';
import FeaturedResearch from './components/FeaturedResearch';
import Projects from './components/Projects';
import Publications from './components/Publications';
import Patents from './components/Patents';
import Books from './components/Books';
import Scholars from './components/Scholars';
import Experience from './components/Experience';
import Leadership from './components/Leadership';
import Awards from './components/Awards';
import Collaborations from './components/Collaborations';
import ResearchProfiles from './components/ResearchProfiles';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#2563EB] focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <ImpactStats />
        <About />
        <ResearchAreas />
        <FeaturedResearch />
        <Projects />
        <Publications />
        <Patents />
        <Books />
        <Scholars />
        <Experience />
        <Leadership />
        <Awards />
        <Collaborations />
        <ResearchProfiles />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
