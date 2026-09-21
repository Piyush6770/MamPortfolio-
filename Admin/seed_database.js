import { createClient } from '@supabase/supabase-js';
import { facultyData } from './src/data/facultyData.js';
import { projectsData } from './src/data/projects.js';
import { achievementsData } from './src/data/achievements.js';
import { patentsData, copyrightsData } from './src/data/patents.js';
import { booksData } from './src/data/books.js';
import { phdScholars, pgScholars } from './src/data/guidance.js';
import { expertTalksData, organizedEventsData, establishedLabsData } from './src/data/talksAndEvents.js';
import { galleryData } from './src/data/galleryData.js';
import { journalPublications, conferencePublications } from './src/data/publications.js';

const url = 'https://rfsfrhmnuaovxaipcfcv.supabase.co';
const key = 'sb_publishable_E3EhiSLwbyRiy6WLxdHQag_rLxLefRF';
const supabase = createClient(url, key);

async function seed() {
  console.log('🚀 Starting Full Database Seed to Supabase...');

  // 1. Site Settings
  console.log('Seeding site_settings...');
  await supabase.from('site_settings').upsert({
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
    publish_status: 'published'
  });

  // 2. Hero Section
  console.log('Seeding hero_section...');
  await supabase.from('hero_section').upsert({
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
    publish_status: 'published'
  });

  // 3. About Section
  console.log('Seeding about_section...');
  await supabase.from('about_section').upsert({
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
    publish_status: 'published'
  });

  // 4. Contact Info
  console.log('Seeding contact_info...');
  await supabase.from('contact_info').upsert({
    id: 'current',
    email_primary: facultyData.emails[0],
    email_secondary: facultyData.emails[1],
    phone_office: facultyData.phoneOffice,
    phone_mobile: facultyData.phoneMobile,
    address: facultyData.address,
    office_location: `${facultyData.department}, ${facultyData.institution}`,
    enable_contact_form: true,
    publish_status: 'published'
  });

  // 5. SEO Settings
  console.log('Seeding seo_settings...');
  await supabase.from('seo_settings').upsert({
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
    publish_status: 'published'
  });

  console.log('✅ Singletons successfully updated!');
}

seed().catch(console.error);
