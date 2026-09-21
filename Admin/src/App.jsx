import React, { useEffect } from 'react';
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
      <div className="min-h-screen bg-black flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-zinc-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-medium">Loading Admin Portal...</p>
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
    <AuthProvider>
      <AdminDataProvider>
        <AdminPortalContent />
      </AdminDataProvider>
    </AuthProvider>
  );
}
