import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { facultyData } from '../../data/facultyData';
import { projectsData } from '../../data/projects';
import { achievementsData } from '../../data/achievements';
import { patentsData, copyrightsData } from '../../data/patents';
import { booksData, bookChaptersData } from '../../data/books';
import { guidanceStats, phdScholars, pgScholars } from '../../data/guidance';
import { expertTalksData, organizedEventsData, establishedLabsData } from '../../data/talksAndEvents';
import { galleryData } from '../../data/galleryData';
import { journalPublications } from '../../data/publications';
import { auditService } from './auditService';

export const seedService = {
  async seedAllData(onProgress) {
    if (onProgress) onProgress('Starting data synchronization...');

    try {
      // 1. Site Settings
      if (onProgress) onProgress('Syncing Site Settings...');
      const siteSettingsPayload = {
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
      if (isSupabaseConfigured && supabase) {
        await supabase.from('site_settings').upsert(siteSettingsPayload);
      } else {
        localStorage.setItem('portfolio_site_settings', JSON.stringify(siteSettingsPayload));
      }

      // 2. Hero Section
      if (onProgress) onProgress('Syncing Hero Section...');
      const heroPayload = {
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
      if (isSupabaseConfigured && supabase) {
        await supabase.from('hero_section').upsert(heroPayload);
      } else {
        localStorage.setItem('portfolio_hero_section', JSON.stringify(heroPayload));
      }

      // 3. About Section
      if (onProgress) onProgress('Syncing About Section...');
      const aboutPayload = {
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
      if (isSupabaseConfigured && supabase) {
        await supabase.from('about_section').upsert(aboutPayload);
      } else {
        localStorage.setItem('portfolio_about_section', JSON.stringify(aboutPayload));
      }

      // 4. Projects
      if (onProgress) onProgress('Syncing Projects...');
      const projectsPayload = projectsData.map((p, idx) => ({
        id: p.id.includes('-') ? undefined : p.id,
        title: p.title,
        agency: p.agency,
        amount: p.amount,
        period: p.period,
        status: p.status || 'Completed',
        role: p.role || 'Principal Investigator',
        category: p.category || 'Government Funded',
        description: `${p.agency} funded project (${p.amount}) during ${p.period}.`,
        is_featured: idx < 3,
        is_visible: true,
        display_order: idx + 1,
        publish_status: 'published',
      }));
      if (isSupabaseConfigured && supabase) {
        for (const proj of projectsPayload) {
          await supabase.from('projects').upsert(proj);
        }
      } else {
        localStorage.setItem('portfolio_projects', JSON.stringify(projectsPayload.map((p, i) => ({ ...p, id: `proj-${i+1}` }))));
      }

      // 5. Skills
      if (onProgress) onProgress('Syncing Skills...');
      const skillsPayload = (facultyData.researchInterests || []).map((skill, idx) => ({
        name: skill,
        category: 'Research & AI/ML',
        icon_name: 'Cpu',
        proficiency_level: 95 - (idx * 3),
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      if (isSupabaseConfigured && supabase) {
        for (const sk of skillsPayload) {
          await supabase.from('skills').upsert(sk);
        }
      } else {
        localStorage.setItem('portfolio_skills', JSON.stringify(skillsPayload.map((s, i) => ({ ...s, id: `skill-${i+1}` }))));
      }

      // 6. Experience (Work & Admin)
      if (onProgress) onProgress('Syncing Experience...');
      const workExp = (facultyData.workExperience || []).map((w, idx) => ({
        type: 'work',
        role: w.role,
        organization: w.organization,
        period: w.period,
        from_date: w.fromDate,
        to_date: w.toDate,
        description: `Served as ${w.role} at ${w.organization}.`,
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      const adminExp = (facultyData.adminExperience || []).map((a, idx) => ({
        type: 'admin',
        role: a.designation,
        organization: facultyData.institution,
        duties: a.duties,
        period: a.period,
        duration: a.duration,
        description: a.duties,
        display_order: workExp.length + idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      const allExp = [...workExp, ...adminExp];
      if (isSupabaseConfigured && supabase) {
        for (const exp of allExp) {
          await supabase.from('experience').upsert(exp);
        }
      } else {
        localStorage.setItem('portfolio_experience', JSON.stringify(allExp.map((e, i) => ({ ...e, id: `exp-${i+1}` }))));
      }

      // 7. Education
      if (onProgress) onProgress('Syncing Education...');
      const eduPayload = (facultyData.education || []).map((e, idx) => ({
        degree: e.degree,
        field: e.field,
        institution: e.institution,
        year: e.year,
        details: e.details,
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      if (isSupabaseConfigured && supabase) {
        for (const edu of eduPayload) {
          await supabase.from('education').upsert(edu);
        }
      } else {
        localStorage.setItem('portfolio_education', JSON.stringify(eduPayload.map((e, i) => ({ ...e, id: `edu-${i+1}` }))));
      }

      // 8. Achievements
      if (onProgress) onProgress('Syncing Achievements...');
      const achPayload = achievementsData.map((a, idx) => ({
        title: a.title,
        organization: a.organization,
        year: a.year,
        category: a.category || 'Award',
        description: a.description,
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      if (isSupabaseConfigured && supabase) {
        for (const ach of achPayload) {
          await supabase.from('achievements').upsert(ach);
        }
      } else {
        localStorage.setItem('portfolio_achievements', JSON.stringify(achPayload.map((a, i) => ({ ...a, id: `ach-${i+1}` }))));
      }

      // 9. Certifications & Memberships
      if (onProgress) onProgress('Syncing Certifications & Memberships...');
      const certsPayload = (facultyData.certifications || []).map((c, idx) => ({
        type: 'certification',
        title: c,
        organization: c.includes('NVIDIA') ? 'NVIDIA DLI' : c.includes('NPTEL') ? 'NPTEL' : 'Professional',
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      const memsPayload = (facultyData.memberships || []).map((m, idx) => ({
        type: 'membership',
        title: m,
        organization: 'Professional Body',
        display_order: certsPayload.length + idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      const allCerts = [...certsPayload, ...memsPayload];
      if (isSupabaseConfigured && supabase) {
        for (const crt of allCerts) {
          await supabase.from('certifications').upsert(crt);
        }
      } else {
        localStorage.setItem('portfolio_certifications', JSON.stringify(allCerts.map((c, i) => ({ ...c, id: `cert-${i+1}` }))));
      }

      // 10. Publications
      if (onProgress) onProgress('Syncing Publications...');
      const pubsPayload = journalPublications.slice(0, 30).map((pub, idx) => ({
        type: pub.type || 'journal',
        title: pub.title,
        authors: pub.authors,
        venue: pub.venue,
        year: pub.year,
        indexing: pub.indexing || [],
        impact_factor: pub.impactFactor || '',
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      if (isSupabaseConfigured && supabase) {
        for (const p of pubsPayload) {
          await supabase.from('publications').upsert(p);
        }
      } else {
        localStorage.setItem('portfolio_publications', JSON.stringify(pubsPayload.map((p, i) => ({ ...p, id: `pub-${i+1}` }))));
      }

      // 11. Patents & Copyrights
      if (onProgress) onProgress('Syncing Patents & Copyrights...');
      const patsPayload = [
        ...patentsData.map((p, idx) => ({
          type: p.type || 'Patent',
          title: p.title,
          author_number: p.authorNumber,
          application_no: p.applicationNo,
          patent_no: p.patentNo || '',
          status: p.status || 'Granted',
          year: p.year || '',
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...copyrightsData.map((c, idx) => ({
          type: 'Copyright',
          title: c.title,
          author_number: c.authorNumber,
          application_no: c.applicationNo,
          patent_no: '',
          status: c.status || 'Granted',
          year: c.year || '2021',
          display_order: patentsData.length + idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
      if (isSupabaseConfigured && supabase) {
        for (const pat of patsPayload) {
          await supabase.from('patents').upsert(pat);
        }
      } else {
        localStorage.setItem('portfolio_patents', JSON.stringify(patsPayload.map((p, i) => ({ ...p, id: `pat-${i+1}` }))));
      }

      // 12. Books & Book Chapters
      if (onProgress) onProgress('Syncing Books & Chapters...');
      const booksPayload = booksData.map((b, idx) => ({
        title: b.title,
        authors: b.authors,
        publisher: b.publisher,
        year: b.year,
        isbn: b.isbn || '',
        role: b.role || 'Editor / Author',
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      if (isSupabaseConfigured && supabase) {
        for (const bk of booksPayload) {
          await supabase.from('books').upsert(bk);
        }
      } else {
        localStorage.setItem('portfolio_books', JSON.stringify(booksPayload.map((b, i) => ({ ...b, id: `bk-${i+1}` }))));
      }

      // 13. Guidance (PhD & PG)
      if (onProgress) onProgress('Syncing Guidance Scholars...');
      const guidancePayload = [
        ...phdScholars.map((phd, idx) => ({
          type: 'phd',
          name: phd.name,
          joining_date: phd.joiningDate,
          thesis_title: phd.thesisTitle,
          status: phd.status || 'Completed',
          outcome: phd.outcome,
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...pgScholars.map((pg, idx) => ({
          type: 'pg',
          name: pg.name,
          viva_date: pg.vivaDate,
          thesis_title: pg.thesisTitle,
          status: 'Completed',
          outcome: pg.outcome,
          display_order: phdScholars.length + idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
      if (isSupabaseConfigured && supabase) {
        for (const g of guidancePayload) {
          await supabase.from('guidance').upsert(g);
        }
      } else {
        localStorage.setItem('portfolio_guidance', JSON.stringify(guidancePayload.map((g, i) => ({ ...g, id: `guide-${i+1}` }))));
      }

      // 14. Talks, Events & Labs
      if (onProgress) onProgress('Syncing Talks, Events & Labs...');
      const talksPayload = [
        ...expertTalksData.map((t, idx) => ({
          type: 'talk',
          topic_or_title: t.topic,
          event_or_equipment: t.event,
          venue_or_sponsor: t.venue,
          date_or_period: t.date,
          role_or_objective: t.role,
          display_order: idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...organizedEventsData.map((e, idx) => ({
          type: 'organized_event',
          topic_or_title: e.title,
          event_or_equipment: e.type,
          venue_or_sponsor: e.sponsoringAgency,
          date_or_period: e.date,
          role_or_objective: e.role,
          display_order: expertTalksData.length + idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
        ...establishedLabsData.map((l, idx) => ({
          type: 'established_lab',
          topic_or_title: l.name,
          event_or_equipment: l.equipment,
          venue_or_sponsor: l.sponsoringAgency,
          date_or_period: 'Institutional Establishment',
          role_or_objective: l.objective,
          display_order: expertTalksData.length + organizedEventsData.length + idx + 1,
          is_visible: true,
          publish_status: 'published',
        })),
      ];
      if (isSupabaseConfigured && supabase) {
        for (const t of talksPayload) {
          await supabase.from('talk_and_events').upsert(t).catch(() => {});
        }
      } else {
        localStorage.setItem('portfolio_talks_and_events', JSON.stringify(talksPayload.map((t, i) => ({ ...t, id: `tlk-${i+1}` }))));
      }

      // 15. Gallery
      if (onProgress) onProgress('Syncing Gallery Highlights...');
      const galPayload = galleryData.map((g, idx) => ({
        title: g.title,
        category: g.category,
        description: g.description,
        date: g.date,
        gradient: g.gradient || 'from-teal-600 to-emerald-800',
        icon_name: g.iconName || 'Award',
        display_order: idx + 1,
        is_visible: true,
        publish_status: 'published',
      }));
      if (isSupabaseConfigured && supabase) {
        for (const g of galPayload) {
          await supabase.from('gallery').upsert(g);
        }
      } else {
        localStorage.setItem('portfolio_gallery', JSON.stringify(galPayload.map((g, i) => ({ ...g, id: `gal-${i+1}` }))));
      }

      // 16. Social Links
      if (onProgress) onProgress('Syncing Social Links...');
      const socialPayload = [
        { platform: 'Google Scholar', url: facultyData.socialLinks.googleScholar, label: 'Citations & Papers', icon_name: 'GraduationCap', display_order: 1, is_visible: true, publish_status: 'published' },
        { platform: 'Scopus', url: facultyData.socialLinks.scopus, label: 'Scopus Author ID', icon_name: 'BookOpen', display_order: 2, is_visible: true, publish_status: 'published' },
        { platform: 'LinkedIn', url: facultyData.socialLinks.linkedIn, label: 'Professional Profile', icon_name: 'Linkedin', display_order: 3, is_visible: true, publish_status: 'published' },
        { platform: 'YouTube', url: facultyData.socialLinks.youtube, label: 'Lectures & Talks', icon_name: 'Youtube', display_order: 4, is_visible: true, publish_status: 'published' },
      ];
      if (isSupabaseConfigured && supabase) {
        for (const s of socialPayload) {
          await supabase.from('social_links').upsert(s);
        }
      } else {
        localStorage.setItem('portfolio_social_links', JSON.stringify(socialPayload.map((s, i) => ({ ...s, id: `soc-${i+1}` }))));
      }

      // 17. Contact Info
      if (onProgress) onProgress('Syncing Contact Info...');
      const contactPayload = {
        id: 'current',
        email_primary: facultyData.emails[0] || 'swati.shinde@pccoepune.org',
        email_secondary: facultyData.emails[1] || 'swaatii.shinde@gmail.com',
        phone_office: facultyData.phoneOffice,
        phone_mobile: facultyData.phoneMobile,
        address: facultyData.address,
        whatsapp_number: '+917350318050',
        form_enabled: true,
        contact_cta_text: 'Get in Touch for Research, Keynotes & Academic Collaborations',
        publish_status: 'published',
      };
      if (isSupabaseConfigured && supabase) {
        await supabase.from('contact_info').upsert(contactPayload);
      } else {
        localStorage.setItem('portfolio_contact_info', JSON.stringify(contactPayload));
      }

      // 18. Sections Config
      if (onProgress) onProgress('Syncing Sections Config...');
      const defaultSections = [
        { id: 'hero', section_key: 'hero', label: 'Hero Header', display_order: 1, is_visible: true, title: 'Hero' },
        { id: 'about', section_key: 'about', label: 'About & Bio', display_order: 2, is_visible: true, title: 'About' },
        { id: 'journey', section_key: 'journey', label: 'Journey & CV', display_order: 3, is_visible: true, title: 'Career Journey' },
        { id: 'research', section_key: 'research', label: 'Research Areas & Labs', display_order: 4, is_visible: true, title: 'Research Ecosystem' },
        { id: 'publications', section_key: 'publications', label: 'Publications', display_order: 5, is_visible: true, title: 'Scholarly Publications' },
        { id: 'patents', section_key: 'patents', label: 'Patents & IPR', display_order: 6, is_visible: true, title: 'Patents & Copyrights' },
        { id: 'projects', section_key: 'projects', label: 'Projects & Grants', display_order: 7, is_visible: true, title: 'Funded Research Projects' },
        { id: 'guidance', section_key: 'guidance', label: 'Ph.D. Mentorship', display_order: 8, is_visible: true, title: 'Research Scholars Guidance' },
        { id: 'academic', section_key: 'academic', label: 'Academic Leadership', display_order: 9, is_visible: true, title: 'Academic Profile' },
        { id: 'books', section_key: 'books', label: 'Books & Chapters', display_order: 10, is_visible: true, title: 'Published Books & Volumes' },
        { id: 'talks', section_key: 'talks', label: 'Talks & Events', display_order: 11, is_visible: true, title: 'Expert Talks & Events' },
        { id: 'gallery', section_key: 'gallery', label: 'Gallery Highlights', display_order: 12, is_visible: true, title: 'Moments & Highlights' },
        { id: 'contact', section_key: 'contact', label: 'Contact', display_order: 13, is_visible: true, title: 'Contact & Collaboration' },
      ];
      if (isSupabaseConfigured && supabase) {
        for (const sec of defaultSections) {
          await supabase.from('sections_config').upsert(sec);
        }
      } else {
        localStorage.setItem('portfolio_sections_config', JSON.stringify(defaultSections));
      }

      await auditService.log('SYNC_DATA', 'all_tables', 'all', { message: 'Synced default faculty data' });
      if (onProgress) onProgress('Data synchronization complete!');
      return { success: true };
    } catch (err) {
      console.error('Data seeding failed:', err);
      return { success: false, error: err };
    }
  },
};
