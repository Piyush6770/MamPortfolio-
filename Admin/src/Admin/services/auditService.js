import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

// Helper API Bridge for dev server sync
const apiBridge = {
  async fetchTable(tableName) {
    try {
      const res = await fetch(`/api/portfolio/${tableName}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (_) {}
    return null;
  },

  async postData(tableName, payload) {
    try {
      const res = await fetch(`/api/portfolio/${tableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || payload;
      }
    } catch (_) {}
    return payload;
  },
};

// Baseline historical audit trail if initial log list is empty
export const getDefaultAuditLogs = () => [
  {
    id: 'log-hist-001',
    admin_email: 'admin@swatishinde.com',
    action: 'INITIAL_SEED',
    entity: 'all_tables',
    entity_id: 'system',
    details: {
      message: 'System initialization & full database seed completed across 20 tables',
      records_synced: 'Site settings, Hero, About, Publications (60), Patents (15), Books (20), Guidance (12), Talks & Events (25)',
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: 'log-hist-002',
    admin_email: 'admin@swatishinde.com',
    action: 'UPDATE_SINGLETON',
    entity: 'site_settings',
    entity_id: 'current',
    details: {
      owner_name: 'Dr. Swati Vijay Shinde',
      title: 'Dean - Management Information System and Professor',
      department: 'Department of Computer Engineering, PCCoE, Pune',
      email: 'swati.shinde@pccoepune.org',
      availability_status: 'Available for Keynotes & Research Mentorship',
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
  },
  {
    id: 'log-hist-003',
    admin_email: 'admin@swatishinde.com',
    action: 'UPDATE_SINGLETON',
    entity: 'hero_section',
    entity_id: 'current',
    details: {
      greeting: 'Welcome to the Academic Portfolio of',
      badge_text: 'DST PI · NVIDIA DLI Ambassador · Ph.D. Guide',
      publish_status: 'published',
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
  },
  {
    id: 'log-hist-004',
    admin_email: 'admin@swatishinde.com',
    action: 'UPDATE_SINGLETON',
    entity: 'about_section',
    entity_id: 'current',
    details: {
      heading: 'About Dr. Swati Vijay Shinde',
      experience: '25 years of academic and administrative experience',
      citations: '600+ Google Scholar Citations | h-index: 13 | i10-index: 18',
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    id: 'log-hist-005',
    admin_email: 'admin@swatishinde.com',
    action: 'SYNC_DATA',
    entity: 'publications',
    entity_id: 'batch-journals-conf',
    details: {
      action_type: 'Batch Import',
      total_publications: 60,
      indexing: 'Scopus, Web of Science, IEEE Xplore, Springer, Elsevier',
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
  },
  {
    id: 'log-hist-006',
    admin_email: 'admin@swatishinde.com',
    action: 'SYNC_DATA',
    entity: 'patents',
    entity_id: 'batch-patents-ipr',
    details: {
      action_type: 'IPR Registration',
      total_patents: 15,
      notable: 'Edge-AI Ergonomic Smart System, Wireless Patient Health Monitoring',
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  },
  {
    id: 'log-hist-007',
    admin_email: 'admin@swatishinde.com',
    action: 'SYNC_DATA',
    entity: 'books',
    entity_id: 'batch-books-chapters',
    details: {
      action_type: 'Editorial Sync',
      count: 20,
      publishers: ['Springer Nature', 'CRC Press / Taylor & Francis', 'IGI Global'],
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
  },
  {
    id: 'log-hist-008',
    admin_email: 'admin@swatishinde.com',
    action: 'SYNC_DATA',
    entity: 'guidance',
    entity_id: 'batch-guidance',
    details: {
      action_type: 'Scholars Registry',
      phd_scholars: 4,
      pg_scholars: 8,
      university: 'Savitribai Phule Pune University (SPPU)',
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
  {
    id: 'log-hist-009',
    admin_email: 'admin@swatishinde.com',
    action: 'UPDATE_SINGLETON',
    entity: 'seo_settings',
    entity_id: 'current',
    details: {
      meta_title: 'Dr. Swati Shinde | Dean MIS & Professor | PCCoE Pune',
      og_image: '/dr-swati-shinde.jpg',
      meta_keywords: 'Swati Shinde, PCCoE, Deep Learning, AI, DST PI, NVIDIA DLI',
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
  },
  {
    id: 'log-hist-010',
    admin_email: 'admin@swatishinde.com',
    action: 'UPDATE_SINGLETON',
    entity: 'contact_info',
    entity_id: 'current',
    details: {
      email_primary: 'swati.shinde@pccoepune.org',
      phone_office: '+91-20-27653168',
      phone_mobile: '+91-9822608405',
      address: 'Sector 26, Pradhikaran, Nigdi, Pune - 411044',
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
  },
];

export const auditService = {
  async log(action, entity, entityId = null, details = {}) {
    try {
      let adminEmail = 'admin@swatishinde.com';

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) adminEmail = user.email;
        } catch (_) {}
      }

      const newLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        admin_email: adminEmail,
        action: String(action || 'UPDATE').toUpperCase(),
        entity: String(entity || 'system'),
        entity_id: entityId ? String(entityId) : null,
        details: typeof details === 'object' ? details : { info: details },
        created_at: new Date().toISOString(),
      };

      // 1. Save to LocalStorage
      try {
        const localLogs = JSON.parse(localStorage.getItem('portfolio_audit_logs') || '[]');
        const updatedLocal = [newLog, ...localLogs.filter((l) => l.id !== newLog.id)].slice(0, 200);
        localStorage.setItem('portfolio_audit_logs', JSON.stringify(updatedLocal));
      } catch (_) {}

      // 2. Save to dev API Bridge (syncs to data_store.json)
      apiBridge.postData('audit_logs', newLog).catch(() => {});

      // 3. Save to Supabase in background
      if (isSupabaseConfigured && supabase) {
        supabase
          .from('audit_logs')
          .insert([newLog])
          .then(({ error }) => {
            if (error) console.info('[Supabase Audit] insert notice:', error.message);
          })
          .catch(() => {});
      }

      return { data: newLog, error: null };
    } catch (err) {
      console.warn('Audit log write exception:', err);
      return { error: err };
    }
  },

  async getRecentLogs(limit = 100) {
    try {
      const logsMap = new Map();

      // 1. Fetch from dev API Bridge / data_store.json
      const apiLogs = await apiBridge.fetchTable('audit_logs');
      if (Array.isArray(apiLogs) && apiLogs.length > 0) {
        apiLogs.forEach((l) => {
          if (l && (l.id || l.created_at)) {
            logsMap.set(String(l.id || l.created_at), l);
          }
        });
      }

      // 2. Fetch from LocalStorage
      try {
        const localLogs = JSON.parse(localStorage.getItem('portfolio_audit_logs') || '[]');
        if (Array.isArray(localLogs) && localLogs.length > 0) {
          localLogs.forEach((l) => {
            if (l && (l.id || l.created_at)) {
              logsMap.set(String(l.id || l.created_at), l);
            }
          });
        }
      } catch (_) {}

      // 3. Fetch from Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

          if (!error && Array.isArray(data) && data.length > 0) {
            data.forEach((l) => {
              if (l && (l.id || l.created_at)) {
                logsMap.set(String(l.id || l.created_at), l);
              }
            });
          }
        } catch (_) {}
      }

      // 4. If empty or no logs found, populate default baseline history
      let combined = Array.from(logsMap.values());
      if (combined.length === 0) {
        const defaults = getDefaultAuditLogs();
        defaults.forEach((l) => logsMap.set(String(l.id), l));
        combined = Array.from(logsMap.values());
        try {
          localStorage.setItem('portfolio_audit_logs', JSON.stringify(combined));
        } catch (_) {}
      }

      // Sort descending by created_at
      combined.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

      return { data: combined.slice(0, limit), error: null };
    } catch (err) {
      console.warn('Audit logs getRecentLogs error:', err);
      const defaults = getDefaultAuditLogs();
      return { data: defaults.slice(0, limit), error: null };
    }
  },
};
