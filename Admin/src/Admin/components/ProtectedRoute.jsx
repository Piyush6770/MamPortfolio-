import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-black text-slate-500 dark:text-zinc-400">
        <div className="w-10 h-10 border-4 border-slate-300 dark:border-zinc-700 border-t-slate-800 dark:border-t-white rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Authenticating Admin Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return children;
};
