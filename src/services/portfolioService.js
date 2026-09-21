import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { facultyData } from '../data/facultyData';
import { projectsData } from '../data/projects';
import { achievementsData } from '../data/achievements';
import { patentsData, copyrightsData } from '../data/patents';
import { booksData, bookChaptersData } from '../data/books';
import { phdScholars, pgScholars } from '../data/guidance';
import { expertTalksData, organizedEventsData } from '../data/talksAndEvents';
import { galleryData } from '../data/galleryData';
import { journalPublications, conferencePublications } from '../data/publications';

// Helper to run a promise with a timeout
const withTimeout = (promise, timeoutMs = 6000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Backend request timeout')), timeoutMs)),
  ]);
};

// Default seed generators for each table
const getDefaultDataForTable = (tableName) => {
  switch (tableName) {
    case 'site_settings':
      return {
        id: 'current',
        site_name: facultyData.name,
        owner_name: facultyData.name,
        title: facultyData.title,
        tagline: facultyData.primaryDesignation,
        profile_image_url: '/dr-swati-shinde.jpg',
        email: facultyData.emails[0] || '',
        phone_office: facultyData.phoneOffice,
        phone_mobile: facultyData.phoneMobile,
        department: facultyData.department,
        institution: facultyData.institution,
        address: facultyData.address,
        availability_status: 'Available for Keynotes & Research Mentorship',
        publish_status: 'published',
      };
    case 'hero_section':
      return {
        id: 'current',
        greeting: 'Welcome to the Academic Portfolio of',
        name: facultyData.name,
        title: facultyData.primaryDesignation,
        subtitle: `${facultyData.department}, ${facultyData.institution}`,
        description: facultyData.bio,
        badge_text: 'DST PI · NVIDIA DLI Ambassador · Ph.D. Guide',
        primary_cta_text: 'Explore Research',
        primary_cta_url: '#/research',
        secondary_cta_text: 'Academic Journey',
        secondary_cta_url: '#/journey',
        hero_image_url: '/dr-swati-shinde.jpg',
        is_visible: true,
        publish_status: 'published',
      };
    case 'about_section':
      return {
        id: 'current',
        heading: `About ${facultyData.name}`,
        bio: facultyData.bio,
        full_bio_paragraphs: facultyData.fullBioParagraphs || [],
        research_interests: facultyData.researchInterests || [],
        courses_taught: facultyData.coursesTaught || [],
        total_experience: facultyData.totalExperience,
        approved_experience: facultyData.approvedExperience,
        citations_count: facultyData.citationsGoogleScholar,
        h_index: facultyData.hIndexGoogleScholar,
        i10_index: facultyData.i10IndexGoogleScholar,
        scopus_pubs: facultyData.totalScopusPubs,
        scopus_citations: facultyData.scopusCitations,
        scopus_h_index: facultyData.scopusHIndex,
        is_visible: true,
        publish_status: 'published',
      };
    case 'contact_info':
      return {
        id: 'current',
        email_primary: facultyData.emails[0],
        email_secondary: facultyData.emails[1],
        phone_office: facultyData.phoneOffice,
        phone_mobile: facultyData.phoneMobile,
        address: facultyData.address,
        office_location: `${facultyData.department}, ${facultyData.institution}`,
        enable_contact_form: true,
        publish_status: 'published',
      };
    case 'seo_settings':
      return {
        id: 'current',
        meta_title: 'Dr. Swati Vijay Shinde | Dean MIS & Professor | PCCOE Pune',
        meta_description: 'Official academic portfolio of Dr. Swati Vijay Shinde. Dean - Management Information System, Professor in Computer Engineering at Pimpri Chinchwad College of Engineering (PCCoE), Pune.',
        keywords: 'Dr. Swati Vijay Shinde, Swati Shinde, PCCoE Pune, Dean MIS, Computer Engineering Professor, Artificial Intelligence, Machine Learning, Deep Learning, CerviTester, SPPU',
        og_title: 'Dr. Swati Vijay Shinde | Academic & Research Portfolio',
        og_description: 'Dean - MIS & Professor in Computer Engineering at PCCoE Pune. 25 years experience, Principal Investigator for DST CerviTester.',
        og_image_url: '/dr-swati-shinde.jpg',
        twitter_title: 'Dr. Swati Vijay Shinde | Academic Portfolio',
        twitter_description: 'Dean - MIS & Professor in Computer Engineering at PCCoE Pune.',
        canonical_url: 'https://swatishinde.vercel.app/',
        publish_status: 'published',
      };
    case 'skills':
      return (facultyData.skills || [
        { category: 'AI & Machine Learning', items: ['Deep Learning', 'Neural Networks', 'Computer Vision', 'Medical Diagnostics'] },
        { category: 'Programming Languages', items: ['Python', 'C++', 'Java', 'MATLAB'] },
        { category: 'Frameworks & Libraries', items: ['PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'Scikit-learn'] },
        { category: 'Academic Leadership', items: ['MIS Administration', 'Curriculum Design', 'DST Grant Management', 'Ph.D. Mentorship'] },
      ]).map((cat, idx) => ({
        id: `skill-cat-${idx + 1}`,
        category: cat.category,
        skills_list: cat.items || [],
        proficiency_level: 90,
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
    case 'projects':
      return projectsData.map((p, idx) => ({
        id: p.id || `proj-${idx + 1}`,
        title: p.title,
        funding_agency: p.fundingAgency || p.grantAgency || p.agency || 'DST, Govt of India',
        grant_amount: p.grantAmount || p.amount || '₹ 45.00 Lakhs',
        duration: p.duration || p.period || p.year || '2023 - Present',
        status: p.status || 'Ongoing',
        role: p.role || 'Principal Investigator',
        description: p.description || p.abstract || '',
        outcomes: p.outcomes || [],
        category: p.category || 'Government Funded',
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
    case 'experience':
      return [
        ...(facultyData.workExperience || []).map((exp, idx) => ({
          id: `exp-work-${idx + 1}`,
          role: exp.designation || exp.role,
          organization: exp.organization || exp.institution,
          period: exp.period,
          duties: exp.responsibilities || exp.duties || '',
          type: 'work',
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...(facultyData.adminExperience || []).map((exp, idx) => ({
          id: `exp-admin-${idx + 1}`,
          role: exp.role || exp.designation,
          organization: exp.organization || exp.institution,
          period: exp.period,
          duties: exp.responsibilities || exp.duties || '',
          type: 'admin',
          display_order: idx + 50,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
    case 'education':
      return (facultyData.education || []).map((edu, idx) => ({
        id: `edu-${idx + 1}`,
        degree: edu.degree,
        specialization: edu.specialization || edu.field,
        institution: edu.institution || edu.university,
        year: edu.year || edu.period,
        grade: edu.grade || edu.percentage || 'First Class with Distinction',
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
    case 'achievements':
      return achievementsData.map((a, idx) => ({
        id: a.id || `ach-${idx + 1}`,
        title: a.title,
        description: a.description || a.details,
        category: a.category || 'Academic & Research',
        year: a.year || '2024',
        organization: a.organization || 'PCCoE / SPPU',
        award_level: a.level || 'National',
        badge_text: a.badge || '',
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
    case 'certifications':
      return [
        ...(facultyData.certifications || []).map((c, idx) => ({
          id: `cert-${idx + 1}`,
          title: typeof c === 'string' ? c : c.title,
          issuer: typeof c === 'string' ? 'NVIDIA / Professional Body' : (c.issuer || 'NVIDIA'),
          issue_date: '2023',
          type: 'certification',
          credential_url: '',
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...(facultyData.memberships || []).map((m, idx) => ({
          id: `mem-${idx + 1}`,
          title: typeof m === 'string' ? m : m.title,
          issuer: 'Professional Societies (IEEE / ACM / CSI / ISTE)',
          issue_date: 'Life Member',
          type: 'membership',
          credential_url: '',
          display_order: idx + 50,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
    case 'publications':
      return [
        ...journalPublications.map((p, idx) => ({
          id: `pub-j-${idx + 1}`,
          title: p.title,
          authors: p.authors,
          journal_or_conference: p.journal,
          year: p.year,
          volume_issue_pages: `${p.volume || ''} ${p.issue || ''} ${p.pages || ''}`.trim(),
          doi_or_url: p.doi || '',
          indexing: p.indexing || 'Scopus',
          impact_factor: p.impactFactor || '',
          type: 'Journal',
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...conferencePublications.map((p, idx) => ({
          id: `pub-c-${idx + 1}`,
          title: p.title,
          authors: p.authors,
          journal_or_conference: p.conference,
          year: p.year,
          volume_issue_pages: p.location || '',
          doi_or_url: p.doi || '',
          indexing: 'Scopus / IEEE',
          type: 'Conference',
          display_order: idx + 100,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
    case 'patents':
      return [
        ...patentsData.map((p, idx) => ({
          id: `pat-${idx + 1}`,
          title: p.title,
          application_no: p.applicationNumber,
          status: p.status,
          filing_date: p.filingDate,
          grant_date: p.grantDate || '',
          inventors: p.inventors,
          country: p.country || 'India',
          type: p.status?.includes('Granted') ? 'Granted Patent' : 'Published Patent',
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...copyrightsData.map((c, idx) => ({
          id: `cr-${idx + 1}`,
          title: c.title,
          application_no: c.registrationNumber || c.diaryNumber,
          status: 'Registered',
          filing_date: c.year,
          inventors: c.authors,
          country: 'India',
          type: 'Copyright',
          display_order: idx + 50,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
    case 'books':
      return [
        ...booksData.map((b, idx) => ({
          id: `book-${idx + 1}`,
          title: b.title,
          authors: b.authors,
          publisher: b.publisher,
          year: b.year,
          isbn: b.isbn || '',
          type: 'Textbook',
          cover_image_url: b.coverImage || '',
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...bookChaptersData.map((b, idx) => ({
          id: `chap-${idx + 1}`,
          title: b.chapterTitle || b.title,
          authors: b.authors,
          publisher: `${b.bookTitle || ''} (${b.publisher || ''})`.trim(),
          year: b.year,
          isbn: b.isbn || '',
          type: 'Book Chapter',
          display_order: idx + 50,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
    case 'guidance':
      return [
        ...phdScholars.map((s, idx) => ({
          id: `guide-phd-${idx + 1}`,
          scholar_name: s.name,
          research_topic: s.topic,
          degree: 'Ph.D.',
          status: s.status,
          year: s.year || s.registrationYear || '2023',
          university: s.university || 'SPPU Pune',
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...pgScholars.map((s, idx) => ({
          id: `guide-pg-${idx + 1}`,
          scholar_name: s.name,
          research_topic: s.topic,
          degree: 'M.Tech / M.E.',
          status: s.status,
          year: s.year || '2023',
          university: 'PCCoE / SPPU',
          display_order: idx + 50,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
    case 'talks_and_events':
      return [
        ...expertTalksData.map((t, idx) => ({
          id: `talk-${idx + 1}`,
          title: t.topic,
          event_name: t.event,
          organization: t.institution,
          date: t.date || t.year,
          location: t.location || 'Pune',
          type: 'Keynote Talk',
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...organizedEventsData.map((e, idx) => ({
          id: `event-${idx + 1}`,
          title: e.title,
          event_name: e.role,
          organization: e.sponsor || facultyData.institution,
          date: e.period || e.year,
          type: 'Conference / STTP',
          display_order: idx + 50,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
    case 'gallery':
      return galleryData.map((g, idx) => ({
        id: g.id || `gal-${idx + 1}`,
        title: g.title,
        category: g.category || 'Research',
        description: g.description,
        date: g.date || '2023',
        image_url: g.imageUrl || '',
        gradient: g.gradient || 'from-zinc-800 to-zinc-950',
        icon_name: g.iconName || 'Award',
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
    case 'social_links':
      return [
        { id: 'social-1', platform: 'Google Scholar', url: facultyData.socialLinks.googleScholar, icon_name: 'GraduationCap', display_order: 1, is_visible: true, publish_status: 'published' },
        { id: 'social-2', platform: 'Scopus', url: facultyData.socialLinks.scopus, icon_name: 'BookOpen', display_order: 2, is_visible: true, publish_status: 'published' },
        { id: 'social-3', platform: 'LinkedIn', url: facultyData.socialLinks.linkedIn, icon_name: 'Linkedin', display_order: 3, is_visible: true, publish_status: 'published' },
        { id: 'social-4', platform: 'YouTube', url: facultyData.socialLinks.youtube, icon_name: 'Youtube', display_order: 4, is_visible: true, publish_status: 'published' },
      ];
    case 'resume_files':
      return [
        {
          id: 'res-1',
          file_name: 'Dr_Swati_Shinde_CV_2026.pdf',
          file_url: '/resume.pdf',
          file_size_kb: 340,
          version_label: 'Official Profile CV (v2.4)',
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ];
    case 'sections_config':
      return [
        { id: 'sec-1', section_key: 'hero', section_title: 'Hero Introduction', is_visible: true, display_order: 1 },
        { id: 'sec-2', section_key: 'about', section_title: 'About & Bio', is_visible: true, display_order: 2 },
        { id: 'sec-3', section_key: 'achievements', section_title: 'Key Achievements', is_visible: true, display_order: 3 },
        { id: 'sec-4', section_key: 'journey', section_title: 'Career Journey', is_visible: true, display_order: 4 },
        { id: 'sec-5', section_key: 'research', section_title: 'Research & Labs', is_visible: true, display_order: 5 },
        { id: 'sec-6', section_key: 'publications', section_title: 'Publications', is_visible: true, display_order: 6 },
        { id: 'sec-7', section_key: 'patents', section_title: 'Patents & IPR', is_visible: true, display_order: 7 },
        { id: 'sec-8', section_key: 'projects', section_title: 'Projects & Grants', is_visible: true, display_order: 8 },
        { id: 'sec-9', section_key: 'guidance', section_title: 'Ph.D. Guidance', is_visible: true, display_order: 9 },
        { id: 'sec-10', section_key: 'academic', section_title: 'Academic Profile', is_visible: true, display_order: 10 },
        { id: 'sec-11', section_key: 'books', section_title: 'Books & Textbooks', is_visible: true, display_order: 11 },
        { id: 'sec-12', section_key: 'talks', section_title: 'Talks & Events', is_visible: true, display_order: 12 },
        { id: 'sec-13', section_key: 'gallery', section_title: 'Gallery Highlights', is_visible: true, display_order: 13 },
        { id: 'sec-14', section_key: 'contact', section_title: 'Contact & Collaboration', is_visible: true, display_order: 14 },
      ];
    default:
      return [];
  }
};

// Generic Collection CRUD Helper for Public Website
const createTableService = (tableName, defaultSort = 'display_order') => {
  return {
    async getAll(includeDrafts = false) {
      // 1. Try Supabase if configured (primary live source)
      if (isSupabaseConfigured && supabase) {
        try {
          let query = supabase.from(tableName).select('*');
          if (!includeDrafts) {
            query = query.eq('publish_status', 'published').eq('is_visible', true);
          }
          if (defaultSort) {
            query = query.order(defaultSort, { ascending: true });
          }

          const { data, error } = await withTimeout(query, 5000);
          if (!error && Array.isArray(data) && data.length > 0) {
            localStorage.setItem(`portfolio_${tableName}`, JSON.stringify(data));
            return {
              data: includeDrafts ? data : data.filter((i) => i.publish_status === 'published' && i.is_visible !== false),
              error: null,
            };
          }
        } catch (err) {
          console.warn(`[Supabase Public Fetch Notice] ${tableName}:`, err.message || err);
        }
      }

      // 2. Check local storage cache
      const local = localStorage.getItem(`portfolio_${tableName}`);
      let currentItems = null;

      if (local) {
        try {
          currentItems = JSON.parse(local);
        } catch (_) {}
      }

      // 3. Fallback to default faculty data
      if (!currentItems || currentItems.length === 0) {
        const defaults = getDefaultDataForTable(tableName);
        if (Array.isArray(defaults) && defaults.length > 0) {
          currentItems = defaults;
          localStorage.setItem(`portfolio_${tableName}`, JSON.stringify(defaults));
        }
      }

      const filtered = (currentItems || []).filter(
        (i) => includeDrafts || (i.publish_status === 'published' && i.is_visible !== false)
      );
      return { data: filtered, error: null };
    },

    async getById(id) {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from(tableName).select('*').eq('id', id).maybeSingle();
          if (!error && data) return { data, error: null };
        } catch (_) {}
      }
      const local = JSON.parse(localStorage.getItem(`portfolio_${tableName}`) || '[]');
      const item = local.find((i) => String(i.id) === String(id));
      return { data: item || null, error: null };
    },
  };
};

// Singleton Table Service Helper (Hero, About, SEO, Site Settings, Contact Info)
const createSingletonService = (tableName) => {
  return {
    async get(includeDrafts = false) {
      // 1. Query Supabase directly
      if (isSupabaseConfigured && supabase) {
        try {
          let query = supabase.from(tableName).select('*').eq('id', 'current');
          if (!includeDrafts) {
            query = query.eq('publish_status', 'published');
          }
          const { data, error } = await withTimeout(query.maybeSingle(), 5000);
          if (!error && data) {
            localStorage.setItem(`portfolio_${tableName}`, JSON.stringify(data));
            return { data, error: null };
          }
        } catch (err) {
          console.warn(`[Supabase Public Singleton Notice] ${tableName}:`, err.message || err);
        }
      }

      // 2. Check local storage cache
      const local = localStorage.getItem(`portfolio_${tableName}`);
      let currentItem = null;

      if (local) {
        try {
          currentItem = JSON.parse(local);
        } catch (_) {}
      }

      // 3. Fallback to default singleton data
      if (!currentItem) {
        const defaults = getDefaultDataForTable(tableName);
        if (defaults) {
          currentItem = defaults;
          localStorage.setItem(`portfolio_${tableName}`, JSON.stringify(defaults));
        }
      }

      return { data: currentItem, error: null };
    },
  };
};

export const portfolioService = {
  // Singletons
  siteSettings: createSingletonService('site_settings'),
  hero: createSingletonService('hero_section'),
  about: createSingletonService('about_section'),
  contactInfo: createSingletonService('contact_info'),
  seo: createSingletonService('seo_settings'),

  // Collections
  sections: createTableService('sections_config', 'display_order'),
  skills: createTableService('skills', 'display_order'),
  projects: createTableService('projects', 'display_order'),
  experience: createTableService('experience', 'display_order'),
  education: createTableService('education', 'display_order'),
  achievements: createTableService('achievements', 'display_order'),
  certifications: createTableService('certifications', 'display_order'),
  publications: createTableService('publications', 'display_order'),
  patents: createTableService('patents', 'display_order'),
  books: createTableService('books', 'display_order'),
  guidance: createTableService('guidance', 'display_order'),
  talksAndEvents: createTableService('talks_and_events', 'display_order'),
  gallery: createTableService('gallery', 'display_order'),
  socialLinks: createTableService('social_links', 'display_order'),
  resumes: createTableService('resume_files', 'created_at'),
};
