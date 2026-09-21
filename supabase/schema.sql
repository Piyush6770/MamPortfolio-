-- ==============================================================================
-- PRODUCTION SUPABASE DATABASE SCHEMA FOR PORTFOLIO CMS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. SITE SETTINGS TABLE (Singleton)
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'current',
    site_name TEXT NOT NULL DEFAULT 'Dr. Swati Vijay Shinde',
    owner_name TEXT NOT NULL DEFAULT 'Dr. Swati Vijay Shinde',
    title TEXT NOT NULL DEFAULT 'Professor & Academic Leader',
    tagline TEXT DEFAULT 'Dean - Management Information System & Professor in Computer Engineering',
    profile_image_url TEXT DEFAULT '/dr-swati-shinde.jpg',
    email TEXT DEFAULT 'swati.shinde@pccoepune.org',
    phone_office TEXT DEFAULT '+91-020-27653166',
    phone_mobile TEXT DEFAULT '+91 7350318050',
    department TEXT DEFAULT 'Department of Computer Engineering',
    institution TEXT DEFAULT 'Pimpri Chinchwad College of Engineering (PCCoE), Pune',
    address TEXT DEFAULT 'Sector No. 26, Pradhikaran, Nigdi, Pune – 411044, Maharashtra, India',
    availability_status TEXT DEFAULT 'Open for Research Collaboration & Keynotes',
    favicon_url TEXT DEFAULT '',
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HERO SECTION TABLE (Singleton)
CREATE TABLE IF NOT EXISTS hero_section (
    id TEXT PRIMARY KEY DEFAULT 'current',
    greeting TEXT DEFAULT 'Welcome to the Academic Portfolio of',
    name TEXT NOT NULL DEFAULT 'Dr. Swati Vijay Shinde',
    title TEXT NOT NULL DEFAULT 'Dean – Management Information System & Professor',
    subtitle TEXT DEFAULT 'Department of Computer Engineering, PCCoE Pune',
    description TEXT DEFAULT 'Distinguished academician and researcher with 25 years of experience in AI, Machine Learning, Deep Learning, and Medical Diagnostics. Principal Investigator for DST-funded CerviTester.',
    badge_text TEXT DEFAULT 'DST PI · NVIDIA DLI Ambassador · Ph.D. Guide',
    primary_cta_text TEXT DEFAULT 'Explore Research',
    primary_cta_url TEXT DEFAULT '#/research',
    secondary_cta_text TEXT DEFAULT 'Download CV',
    secondary_cta_url TEXT DEFAULT '#/journey',
    hero_image_url TEXT DEFAULT '/dr-swati-shinde.jpg',
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ABOUT SECTION TABLE (Singleton)
CREATE TABLE IF NOT EXISTS about_section (
    id TEXT PRIMARY KEY DEFAULT 'current',
    heading TEXT DEFAULT 'About Dr. Swati V. Shinde',
    bio TEXT DEFAULT 'Dr. Swati Vijay Shinde is Dean - Management Information System and Professor in the Department of Computer Engineering at Pimpri Chinchwad College of Engineering (PCCoE), Pune.',
    full_bio_paragraphs JSONB DEFAULT '[]'::jsonb,
    research_interests JSONB DEFAULT '[]'::jsonb,
    courses_taught JSONB DEFAULT '[]'::jsonb,
    total_experience TEXT DEFAULT '25 Years',
    approved_experience TEXT DEFAULT '21 Years',
    citations_count INT DEFAULT 1040,
    h_index INT DEFAULT 16,
    i10_index INT DEFAULT 27,
    scopus_pubs INT DEFAULT 73,
    scopus_citations INT DEFAULT 460,
    scopus_h_index INT DEFAULT 11,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SECTIONS CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS sections_config (
    id TEXT PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    title TEXT,
    subtitle TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Programming',
    icon_name TEXT DEFAULT 'Code',
    proficiency_level INT DEFAULT 90,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT,
    agency TEXT,
    amount TEXT,
    period TEXT,
    status TEXT DEFAULT 'Completed',
    role TEXT DEFAULT 'Principal Investigator',
    category TEXT DEFAULT 'Government Funded',
    description TEXT,
    cover_image_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    technologies JSONB DEFAULT '[]'::jsonb,
    github_url TEXT,
    live_url TEXT,
    demo_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EXPERIENCE TABLE (Work & Administrative Experience)
CREATE TABLE IF NOT EXISTS experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL DEFAULT 'work', -- 'work' or 'admin'
    role TEXT NOT NULL,
    organization TEXT NOT NULL,
    period TEXT NOT NULL,
    from_date TEXT,
    to_date TEXT,
    duration TEXT,
    duties TEXT,
    description TEXT,
    company_logo_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree TEXT NOT NULL,
    field TEXT NOT NULL,
    institution TEXT NOT NULL,
    year TEXT NOT NULL,
    details TEXT,
    logo_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    year TEXT NOT NULL,
    category TEXT DEFAULT 'Award',
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CERTIFICATIONS & MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL DEFAULT 'certification', -- 'certification' or 'membership'
    title TEXT NOT NULL,
    organization TEXT,
    issue_date TEXT,
    expiry_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PUBLICATIONS TABLE
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL DEFAULT 'journal', -- 'journal', 'conference', 'chapter'
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    venue TEXT,
    publisher TEXT,
    year INT NOT NULL,
    indexing JSONB DEFAULT '[]'::jsonb,
    impact_factor TEXT,
    doi_url TEXT,
    pdf_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PATENTS & COPYRIGHTS TABLE
CREATE TABLE IF NOT EXISTS patents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL DEFAULT 'Patent', -- 'Patent', 'Design', 'Copyright'
    title TEXT NOT NULL,
    author_number TEXT,
    application_no TEXT,
    patent_no TEXT,
    status TEXT DEFAULT 'Granted', -- 'Granted', 'Published', 'Filed'
    year TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. BOOKS TABLE
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    publisher TEXT NOT NULL,
    year TEXT NOT NULL,
    isbn TEXT,
    role TEXT DEFAULT 'Editor / Author',
    cover_image_url TEXT,
    buy_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. GUIDANCE TABLE (Ph.D. / PG Scholars)
CREATE TABLE IF NOT EXISTS guidance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL DEFAULT 'phd', -- 'phd' or 'pg'
    name TEXT NOT NULL,
    joining_date TEXT,
    viva_date TEXT,
    thesis_title TEXT NOT NULL,
    status TEXT DEFAULT 'Completed',
    outcome TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TALKS, EVENTS & LABS TABLE
CREATE TABLE IF NOT EXISTS talks_and_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL DEFAULT 'talk', -- 'talk', 'organized_event', 'established_lab'
    topic_or_title TEXT NOT NULL,
    event_or_equipment TEXT,
    venue_or_sponsor TEXT,
    date_or_period TEXT,
    role_or_objective TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Research',
    description TEXT,
    date TEXT,
    image_url TEXT,
    gradient TEXT DEFAULT 'from-teal-600 to-emerald-800',
    icon_name TEXT DEFAULT 'Award',
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    label TEXT,
    icon_name TEXT DEFAULT 'Globe',
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. CONTACT INFO TABLE (Singleton)
CREATE TABLE IF NOT EXISTS contact_info (
    id TEXT PRIMARY KEY DEFAULT 'current',
    email_primary TEXT DEFAULT 'swati.shinde@pccoepune.org',
    email_secondary TEXT DEFAULT 'swaatii.shinde@gmail.com',
    phone_office TEXT DEFAULT '+91-020-27653166',
    phone_mobile TEXT DEFAULT '+91 7350318050',
    address TEXT DEFAULT 'Sector No. 26, Pradhikaran, Nigdi, Pune – 411044, Maharashtra, India',
    whatsapp_number TEXT DEFAULT '+917350318050',
    map_embed_url TEXT DEFAULT '',
    form_enabled BOOLEAN DEFAULT TRUE,
    contact_cta_text TEXT DEFAULT 'Get in Touch for Research, Keynotes & Collaborations',
    publish_status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. RESUME FILES TABLE
CREATE TABLE IF NOT EXISTS resume_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL DEFAULT 'Official Curriculum Vitae',
    file_url TEXT NOT NULL,
    file_size TEXT,
    version_tag TEXT DEFAULT 'v1.0',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. SEO SETTINGS TABLE (Singleton)
CREATE TABLE IF NOT EXISTS seo_settings (
    id TEXT PRIMARY KEY DEFAULT 'current',
    meta_title TEXT DEFAULT 'Dr. Swati Vijay Shinde | Dean MIS & Professor | PCCOE Pune',
    meta_description TEXT DEFAULT 'Official academic portfolio of Dr. Swati Vijay Shinde. Dean - Management Information System, Professor in Computer Engineering at Pimpri Chinchwad College of Engineering (PCCoE), Pune.',
    keywords TEXT DEFAULT 'Dr. Swati Vijay Shinde, Swati Shinde, PCCoE Pune, Dean MIS, Computer Engineering Professor, Artificial Intelligence, Machine Learning, Deep Learning, CerviTester, SPPU',
    og_title TEXT DEFAULT 'Dr. Swati Vijay Shinde | Academic & Research Portfolio',
    og_description TEXT DEFAULT 'Dean - MIS & Professor in Computer Engineering at PCCoE Pune. 25 years experience, Principal Investigator for DST CerviTester.',
    og_image_url TEXT DEFAULT '/dr-swati-shinde.jpg',
    twitter_title TEXT DEFAULT 'Dr. Swati Vijay Shinde | Academic Portfolio',
    twitter_description TEXT DEFAULT 'Dean - MIS & Professor in Computer Engineering at PCCoE Pune.',
    canonical_url TEXT DEFAULT 'https://swatishinde.vercel.app/',
    favicon_url TEXT DEFAULT '',
    json_ld_schema JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- AUTOMATED TRIGGERS FOR TIMESTAMPS
-- ==============================================================================
DO $$ 
DECLARE 
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name NOT IN ('audit_logs', 'schema_migrations')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS tr_%I_updated_at ON %I;', t, t);
        EXECUTE format('CREATE TRIGGER tr_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_modified_column();', t, t);
    END LOOP;
END $$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE talks_and_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Allow anyone (anon) to read published/visible content
CREATE POLICY "Public can view published site_settings" ON site_settings FOR SELECT USING (publish_status = 'published');
CREATE POLICY "Public can view published hero_section" ON hero_section FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published about_section" ON about_section FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view sections_config" ON sections_config FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view published skills" ON skills FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published projects" ON projects FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published experience" ON experience FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published education" ON education FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published achievements" ON achievements FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published certifications" ON certifications FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published publications" ON publications FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published patents" ON patents FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published books" ON books FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published guidance" ON guidance FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published talks_and_events" ON talks_and_events FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published gallery" ON gallery FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view published social_links" ON social_links FOR SELECT USING (publish_status = 'published' AND is_visible = true);
CREATE POLICY "Public can view contact_info" ON contact_info FOR SELECT USING (publish_status = 'published');
CREATE POLICY "Public can view active resume_files" ON resume_files FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view seo_settings" ON seo_settings FOR SELECT USING (true);

-- 2. Authenticated Admin Policy: Allow full CRUD for logged-in authenticated users
CREATE POLICY "Admin full access on site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on hero_section" ON hero_section FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on about_section" ON about_section FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on sections_config" ON sections_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on skills" ON skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on experience" ON experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on education" ON education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on achievements" ON achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on certifications" ON certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on publications" ON publications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on patents" ON patents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on books" ON books FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on guidance" ON guidance FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on talks_and_events" ON talks_and_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on social_links" ON social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on contact_info" ON contact_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on resume_files" ON resume_files FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on seo_settings" ON seo_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on audit_logs" ON audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION & POLICIES
-- ==============================================================================
-- Create the 'portfolio' storage bucket if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Public Read
CREATE POLICY "Public Read Portfolio Storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Storage Policy: Authenticated Admin Insert/Upload
CREATE POLICY "Admin Upload Portfolio Storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

-- Storage Policy: Authenticated Admin Update
CREATE POLICY "Admin Update Portfolio Storage"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio');

-- Storage Policy: Authenticated Admin Delete
CREATE POLICY "Admin Delete Portfolio Storage"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio');
