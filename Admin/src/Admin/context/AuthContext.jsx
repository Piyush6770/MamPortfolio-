import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../config/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 2500));
        const sess = await Promise.race([authService.getSession(), timeoutPromise]);
        if (mounted) {
          setSession(sess);
          setUser(sess?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.warn('[AuthContext] Session init error:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data } = authService.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await authService.login(email, password);
    if (!result.error) {
      setUser(result.user);
      setSession(result.session);
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  const value = {
    user,
    session,
    isAuthenticated: Boolean(user),
    loading,
    isSupabaseConfigured,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
