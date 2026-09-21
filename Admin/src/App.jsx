import React, { useEffect } from 'react';
import { ThemeProvider } from './Admin/context/ThemeContext';
import { AuthProvider, useAuth } from './Admin/context/AuthContext';
import { AdminDataProvider, useAdminData } from './Admin/context/AdminDataContext';
import { AdminLayout } from './Admin/components/AdminLayout';
import { LoginPage } from './Admin/pages/LoginPage';

const AdminPortalContent = () => {
  const { setActiveAdminTab } = useAdminData();
  const { user: currentUser, loading: authLoading } = useAuth();

  // Sync hash routing with active tab
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash && hash !== 'login' && hash !== 'admin') {
        setActiveAdminTab(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setActiveAdminTab]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-black text-slate-800 dark:text-zinc-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-400 dark:border-zinc-200 border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return <AdminLayout />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminDataProvider>
          <AdminPortalContent />
        </AdminDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

