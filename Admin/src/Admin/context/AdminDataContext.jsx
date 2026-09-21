import React, { createContext, useContext, useState, useCallback } from 'react';

const AdminDataContext = createContext(null);

export const AdminDataProvider = ({ children }) => {
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [isPreviewMode, setIsPreviewMode] = useState(() => {
    return localStorage.getItem('portfolio_preview_mode') === 'true';
  });
  const [toasts, setToasts] = useState([]);
  const [refreshTick, setRefreshTick] = useState(0);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode((prev) => {
      const next = !prev;
      localStorage.setItem('portfolio_preview_mode', String(next));
      return next;
    });
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTick((prev) => prev + 1);
  }, []);

  const value = {
    activeAdminTab,
    setActiveAdminTab,
    isPreviewMode,
    togglePreviewMode,
    toasts,
    showToast,
    removeToast,
    refreshTick,
    triggerRefresh,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
