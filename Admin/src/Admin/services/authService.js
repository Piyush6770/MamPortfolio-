import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

const AUTHORIZED_ADMINS = [
  {
    email: 'piyushpatel6770@gmail.com',
    password: '#1Piyush',
    name: 'Piyush Patel',
    role: 'Admin',
  },
  {
    email: 'admin@swatishinde.com',
    password: 'admin123',
    name: 'Dr. Swati Vijay Shinde',
    role: 'Administrator',
  },
];

export const authService = {
  async login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Try Supabase Auth first if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (!error && data?.user) {
          localStorage.removeItem('portfolio_admin_mock_session');
          return { user: data.user, session: data.session, error: null };
        }
        
        // If Supabase gave an error, log it and check fallback list
        console.warn('[Supabase Auth] signInWithPassword error:', error?.message);
      } catch (err) {
        console.warn('[Supabase Auth] Network or connection error:', err);
      }
    }

    // 2. Check Authorized Admin Credentials (works offline, in demo, or when Supabase email confirm is pending)
    const matchedAdmin = AUTHORIZED_ADMINS.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.password === cleanPassword
    );

    if (matchedAdmin) {
      const mockUser = {
        id: `admin-${matchedAdmin.email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: matchedAdmin.email,
        user_metadata: { name: matchedAdmin.name, role: matchedAdmin.role },
      };
      const mockSession = {
        access_token: 'mock-admin-token',
        user: mockUser,
      };
      localStorage.setItem('portfolio_admin_mock_session', JSON.stringify(mockUser));
      return { user: mockUser, session: mockSession, error: null };
    }

    // 3. If credentials didn't match either
    return {
      user: null,
      session: null,
      error: new Error('Invalid email or password. Please check your credentials.'),
    };
  },

  async logout() {
    localStorage.removeItem('portfolio_admin_mock_session');
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        return { error };
      } catch (err) {
        console.warn('[Supabase Auth] Sign out error:', err);
      }
    }
    return { error: null };
  },

  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return user;
      } catch (_) {}
    }
    const mock = localStorage.getItem('portfolio_admin_mock_session');
    return mock ? JSON.parse(mock) : null;
  },

  async getSession() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) return session;
      } catch (_) {}
    }
    const mock = localStorage.getItem('portfolio_admin_mock_session');
    return mock ? { user: JSON.parse(mock), access_token: 'mock-admin-token' } : null;
  },

  async resetPassword(email) {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Configure VITE_SUPABASE_URL in .env to use password reset.') };
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/admin/reset-password`,
    });
  },

  async updatePassword(newPassword) {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }
    return await supabase.auth.updateUser({ password: newPassword });
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured || !supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};

