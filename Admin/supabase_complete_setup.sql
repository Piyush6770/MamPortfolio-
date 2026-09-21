-- ==============================================================================
-- 1. ENABLE ROW LEVEL SECURITY AND PERMISSIVE POLICIES FOR CMS & PUBLIC SITE
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- Drop restrictive policies if they exist
DO $$ 
DECLARE 
    t TEXT;
    table_list TEXT[] := ARRAY[
      'site_settings', 'hero_section', 'about_section', 'sections_config',
      'skills', 'projects', 'experience', 'education', 'achievements',
      'certifications', 'publications', 'patents', 'books', 'guidance',
      'talks_and_events', 'gallery', 'social_links', 'contact_info',
      'resume_files', 'seo_settings', 'audit_logs'
    ];
BEGIN
    FOREACH t IN ARRAY table_list
    LOOP
      EXECUTE format('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY;', t);
      EXECUTE format('DROP POLICY IF EXISTS "Public select on %I" ON %I;', t, t);
      EXECUTE format('DROP POLICY IF EXISTS "CMS all on %I" ON %I;', t, t);
      EXECUTE format('CREATE POLICY "Public select on %I" ON %I FOR SELECT USING (true);', t, t);
      EXECUTE format('CREATE POLICY "CMS all on %I" ON %I FOR ALL USING (true) WITH CHECK (true);', t, t);
    END LOOP;
END $$;

-- Storage Bucket Policies for Image and Document Uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Portfolio Storage" ON storage.objects;
DROP POLICY IF EXISTS "CMS Upload Portfolio Storage" ON storage.objects;
DROP POLICY IF EXISTS "CMS Update Portfolio Storage" ON storage.objects;
DROP POLICY IF EXISTS "CMS Delete Portfolio Storage" ON storage.objects;

CREATE POLICY "Public Read Portfolio Storage" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "CMS Upload Portfolio Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "CMS Update Portfolio Storage" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio');
CREATE POLICY "CMS Delete Portfolio Storage" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio');

-- Verify Setup Status
SELECT table_name, 'Configured' AS status 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'site_settings', 'hero_section', 'about_section', 'sections_config',
    'skills', 'projects', 'experience', 'education', 'achievements',
    'certifications', 'publications', 'patents', 'books', 'guidance',
    'talks_and_events', 'gallery', 'social_links', 'contact_info',
    'resume_files', 'seo_settings', 'audit_logs'
  );
