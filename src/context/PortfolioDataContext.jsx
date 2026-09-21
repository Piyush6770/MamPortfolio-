import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { portfolioService } from '../services/portfolioService';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { facultyData as defaultFacultyData } from '../data/facultyData';
import { projectsData as defaultProjectsData } from '../data/projects';
import { achievementsData as defaultAchievementsData } from '../data/achievements';
import { patentsData as defaultPatentsData, copyrightsData as defaultCopyrightsData } from '../data/patents';
import { booksData as defaultBooksData, bookChaptersData as defaultBookChaptersData } from '../data/books';
import { guidanceStats as defaultGuidanceStats, phdScholars as defaultPhdScholars, pgScholars as defaultPgScholars } from '../data/guidance';
import { expertTalksData as defaultExpertTalksData, organizedEventsData as defaultOrganizedEventsData, establishedLabsData as defaultEstablishedLabsData } from '../data/talksAndEvents';
import { galleryData as defaultGalleryData } from '../data/galleryData';
import { journalPublications as defaultJournalPublications } from '../data/publications';

const PortfolioDataContext = createContext(null);

export const PortfolioDataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(() => {
    return localStorage.getItem('portfolio_preview_mode') === 'true';
  });

  // State slices
  const [siteSettings, setSiteSettings] = useState(null);
  const [hero, setHero] = useState(null);
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState(defaultProjectsData);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState(defaultFacultyData.education || []);
  const [achievements, setAchievements] = useState(defaultAchievementsData);
  const [certifications, setCertifications] = useState([]);
  const [publications, setPublications] = useState(defaultJournalPublications);
  const [patents, setPatents] = useState(defaultPatentsData);
  const [copyrights, setCopyrights] = useState(defaultCopyrightsData);
  const [books, setBooks] = useState(defaultBooksData);
  const [guidance, setGuidance] = useState([]);
  const [talksAndEvents, setTalksAndEvents] = useState([]);
  const [gallery, setGallery] = useState(defaultGalleryData);
  const [socialLinks, setSocialLinks] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [sectionsConfig, setSectionsConfig] = useState([]);
  const [activeResumeUrl, setActiveResumeUrl] = useState('');
  const [seo, setSeo] = useState(null);

  const fetchPortfolioData = useCallback(async () => {
    try {
      const includeDrafts = localStorage.getItem('portfolio_preview_mode') === 'true';

      const [
        siteSettingsRes,
        heroRes,
        aboutRes,
        projectsRes,
        skillsRes,
        expRes,
        eduRes,
        achRes,
        certsRes,
        pubsRes,
        patsRes,
        booksRes,
        guideRes,
        talksRes,
        galRes,
        socialRes,
        contactRes,
        sectionsRes,
        resumesRes,
        seoRes,
      ] = await Promise.all([
        portfolioService.siteSettings.get(includeDrafts),
        portfolioService.hero.get(includeDrafts),
        portfolioService.about.get(includeDrafts),
        portfolioService.projects.getAll(includeDrafts),
        portfolioService.skills.getAll(includeDrafts),
        portfolioService.experience.getAll(includeDrafts),
        portfolioService.education.getAll(includeDrafts),
        portfolioService.achievements.getAll(includeDrafts),
        portfolioService.certifications.getAll(includeDrafts),
        portfolioService.publications.getAll(includeDrafts),
        portfolioService.patents.getAll(includeDrafts),
        portfolioService.books.getAll(includeDrafts),
        portfolioService.guidance.getAll(includeDrafts),
        portfolioService.talksAndEvents.getAll(includeDrafts),
        portfolioService.gallery.getAll(includeDrafts),
        portfolioService.socialLinks.getAll(includeDrafts),
        portfolioService.contactInfo.get(includeDrafts),
        portfolioService.sections.getAll(true),
        portfolioService.resumes.getAll(true),
        portfolioService.seo.get(true),
      ]);

      if (siteSettingsRes.data) setSiteSettings(siteSettingsRes.data);
      if (heroRes.data) setHero(heroRes.data);
      if (aboutRes.data) setAbout(aboutRes.data);
      if (projectsRes.data && projectsRes.data.length > 0) setProjects(projectsRes.data);
      if (skillsRes.data && skillsRes.data.length > 0) setSkills(skillsRes.data);
      if (expRes.data && expRes.data.length > 0) setExperience(expRes.data);
      if (eduRes.data && eduRes.data.length > 0) setEducation(eduRes.data);
      if (achRes.data && achRes.data.length > 0) setAchievements(achRes.data);
      if (certsRes.data && certsRes.data.length > 0) setCertifications(certsRes.data);
      if (pubsRes.data && pubsRes.data.length > 0) setPublications(pubsRes.data);
      if (patsRes.data && patsRes.data.length > 0) {
        setPatents(patsRes.data.filter(p => p.type !== 'Copyright'));
        setCopyrights(patsRes.data.filter(p => p.type === 'Copyright'));
      }
      if (booksRes.data && booksRes.data.length > 0) setBooks(booksRes.data);
      if (guideRes.data && guideRes.data.length > 0) setGuidance(guideRes.data);
      if (talksRes.data && talksRes.data.length > 0) setTalksAndEvents(talksRes.data);
      if (galRes.data && galRes.data.length > 0) setGallery(galRes.data);
      if (socialRes.data && socialRes.data.length > 0) setSocialLinks(socialRes.data);
      if (contactRes.data) setContactInfo(contactRes.data);
      if (sectionsRes.data && sectionsRes.data.length > 0) setSectionsConfig(sectionsRes.data);
      if (resumesRes.data && resumesRes.data.length > 0) {
        const active = resumesRes.data.find(r => r.is_active) || resumesRes.data[0];
        if (active) setActiveResumeUrl(active.file_url);
      }
      if (seoRes.data) {
        setSeo(seoRes.data);
        if (seoRes.data.meta_title) {
          document.title = seoRes.data.meta_title;
        }
      }
    } catch (err) {
      console.warn('Portfolio data fetch fallback to local default data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();

    // 1. Supabase Realtime channel for instant live sync across apps
    let channel = null;
    if (isSupabaseConfigured && supabase) {
      try {
        channel = supabase
          .channel('public:portfolio_realtime_sync')
          .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            fetchPortfolioData();
          })
          .subscribe();
      } catch (err) {
        console.warn('Realtime subscription notice:', err);
      }
    }

    // 2. Local custom event listeners for tab sync
    const handleDataUpdate = () => {
      fetchPortfolioData();
    };

    window.addEventListener('portfolio_data_updated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener('portfolio_data_updated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, [fetchPortfolioData]);

  // Combined facultyData computed with dynamic overrides
  const faculty = {
    name: siteSettings?.owner_name || defaultFacultyData.name,
    title: siteSettings?.title || defaultFacultyData.title,
    primaryDesignation: siteSettings?.tagline || defaultFacultyData.primaryDesignation,
    department: siteSettings?.department || defaultFacultyData.department,
    institution: siteSettings?.institution || defaultFacultyData.institution,
    address: siteSettings?.address || contactInfo?.address || defaultFacultyData.address,
    phoneOffice: contactInfo?.phone_office || defaultFacultyData.phoneOffice,
    phoneMobile: contactInfo?.phone_mobile || defaultFacultyData.phoneMobile,
    emails: contactInfo?.email_primary ? [contactInfo.email_primary, contactInfo.email_secondary].filter(Boolean) : defaultFacultyData.emails,
    bio: about?.bio || hero?.description || defaultFacultyData.bio,
    fullBioParagraphs: about?.full_bio_paragraphs && about.full_bio_paragraphs.length > 0 ? about.full_bio_paragraphs : defaultFacultyData.fullBioParagraphs,
    researchInterests: about?.research_interests && about.research_interests.length > 0 ? about.research_interests : defaultFacultyData.researchInterests,
    coursesTaught: about?.courses_taught && about.courses_taught.length > 0 ? about.courses_taught : defaultFacultyData.coursesTaught,
    totalExperience: about?.total_experience || defaultFacultyData.totalExperience,
    approvedExperience: about?.approved_experience || defaultFacultyData.approvedExperience,
    citationsGoogleScholar: about?.citations_count ?? defaultFacultyData.citationsGoogleScholar,
    hIndexGoogleScholar: about?.h_index ?? defaultFacultyData.hIndexGoogleScholar,
    i10IndexGoogleScholar: about?.i10_index ?? defaultFacultyData.i10IndexGoogleScholar,
    totalScopusPubs: about?.scopus_pubs ?? defaultFacultyData.totalScopusPubs,
    scopusCitations: about?.scopus_citations ?? defaultFacultyData.scopusCitations,
    scopusHIndex: about?.scopus_h_index ?? defaultFacultyData.scopusHIndex,
    education: education.length > 0 ? education : defaultFacultyData.education,
    workExperience: experience.filter(e => e.type === 'work').length > 0 ? experience.filter(e => e.type === 'work') : defaultFacultyData.workExperience,
    adminExperience: experience.filter(e => e.type === 'admin').length > 0 ? experience.filter(e => e.type === 'admin') : defaultFacultyData.adminExperience,
    certifications: certifications.filter(c => c.type === 'certification').length > 0 ? certifications.filter(c => c.type === 'certification').map(c => c.title) : defaultFacultyData.certifications,
    memberships: certifications.filter(c => c.type === 'membership').length > 0 ? certifications.filter(c => c.type === 'membership').map(c => c.title) : defaultFacultyData.memberships,
    references: defaultFacultyData.references,
    socialLinks: {
      googleScholar: socialLinks.find(s => s.platform.toLowerCase().includes('scholar'))?.url || defaultFacultyData.socialLinks.googleScholar,
      scopus: socialLinks.find(s => s.platform.toLowerCase().includes('scopus'))?.url || defaultFacultyData.socialLinks.scopus,
      linkedIn: socialLinks.find(s => s.platform.toLowerCase().includes('linkedin'))?.url || defaultFacultyData.socialLinks.linkedIn,
      youtube: socialLinks.find(s => s.platform.toLowerCase().includes('youtube'))?.url || defaultFacultyData.socialLinks.youtube,
    },
  };

  const isSectionVisible = (sectionKey) => {
    const config = sectionsConfig.find(s => s.section_key === sectionKey);
    if (!config) return true;
    return config.is_visible !== false;
  };

  const value = {
    loading,
    isPreviewMode,
    faculty,
    hero,
    about,
    projects,
    skills,
    experience,
    education,
    achievements,
    certifications,
    publications,
    patents,
    copyrights,
    books,
    guidance,
    talksAndEvents,
    gallery,
    socialLinks,
    contactInfo,
    activeResumeUrl,
    seo,
    isSectionVisible,
    refreshPortfolio: fetchPortfolioData,
  };

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};
