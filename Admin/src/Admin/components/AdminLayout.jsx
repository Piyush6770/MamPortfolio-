import React, { useState } from 'react';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';
import { ToastContainer } from './Toast';
import { useAdminData } from '../context/AdminDataContext';

// Admin Page Imports
import { DashboardPage } from '../pages/DashboardPage';
import { HeroManagerPage } from '../pages/HeroManagerPage';
import { AboutManagerPage } from '../pages/AboutManagerPage';
import { SkillsManagerPage } from '../pages/SkillsManagerPage';
import { ProjectsManagerPage } from '../pages/ProjectsManagerPage';
import { ExperienceManagerPage } from '../pages/ExperienceManagerPage';
import { EducationManagerPage } from '../pages/EducationManagerPage';
import { AchievementsManagerPage } from '../pages/AchievementsManagerPage';
import { CertificationsManagerPage } from '../pages/CertificationsManagerPage';
import { PublicationsManagerPage } from '../pages/PublicationsManagerPage';
import { PatentsManagerPage } from '../pages/PatentsManagerPage';
import { BooksManagerPage } from '../pages/BooksManagerPage';
import { GuidanceManagerPage } from '../pages/GuidanceManagerPage';
import { TalksEventsManagerPage } from '../pages/TalksEventsManagerPage';
import { GalleryManagerPage } from '../pages/GalleryManagerPage';
import { SocialLinksManagerPage } from '../pages/SocialLinksManagerPage';
import { ContactManagerPage } from '../pages/ContactManagerPage';
import { ResumeManagerPage } from '../pages/ResumeManagerPage';
import { SectionsManagerPage } from '../pages/SectionsManagerPage';
import { NavigationManagerPage } from '../pages/NavigationManagerPage';
import { SeoManagerPage } from '../pages/SeoManagerPage';
import { SiteSettingsPage } from '../pages/SiteSettingsPage';
import { AuditLogPage } from '../pages/AuditLogPage';

export const AdminLayout = ({ darkMode, setDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeAdminTab } = useAdminData();

  const renderActivePage = () => {
    switch (activeAdminTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'hero':
        return <HeroManagerPage />;
      case 'about':
        return <AboutManagerPage />;
      case 'skills':
        return <SkillsManagerPage />;
      case 'projects':
        return <ProjectsManagerPage />;
      case 'experience':
        return <ExperienceManagerPage />;
      case 'education':
        return <EducationManagerPage />;
      case 'achievements':
        return <AchievementsManagerPage />;
      case 'certifications':
        return <CertificationsManagerPage />;
      case 'publications':
        return <PublicationsManagerPage />;
      case 'patents':
        return <PatentsManagerPage />;
      case 'books':
        return <BooksManagerPage />;
      case 'guidance':
        return <GuidanceManagerPage />;
      case 'talks':
        return <TalksEventsManagerPage />;
      case 'gallery':
        return <GalleryManagerPage />;
      case 'navigation':
        return <NavigationManagerPage />;
      case 'sections':
        return <SectionsManagerPage />;
      case 'social-links':
        return <SocialLinksManagerPage />;
      case 'contact':
        return <ContactManagerPage />;
      case 'resume':
        return <ResumeManagerPage />;
      case 'seo':
        return <SeoManagerPage />;
      case 'settings':
        return <SiteSettingsPage />;
      case 'audit-log':
        return <AuditLogPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-black text-slate-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/20 dark:selection:bg-zinc-700 selection:text-indigo-900 dark:selection:text-white transition-colors duration-150">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-150">
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Toasts */}
      <ToastContainer />
    </div>
  );
};
