import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.error) {
      setError(result.error.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-150">
      {/* Theme toggle button top right */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-sm cursor-pointer transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Subtle atmospheric glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 dark:bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-xl dark:shadow-2xl space-y-7 relative z-10 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-zinc-900 border border-slate-800 dark:border-zinc-700 text-zinc-100 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Portfolio Admin CMS
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Secure content management system for Dr. Swati Vijay Shinde
            </p>
          </div>
        </div>


        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 outline-none focus:border-slate-500 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-500 dark:focus:ring-zinc-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl text-sm bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 outline-none focus:border-slate-500 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-500 dark:focus:ring-zinc-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-black font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-60 active:scale-98 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <a
            href={import.meta.env.VITE_PUBLIC_PORTFOLIO_URL || 'https://swatishinde.vercel.app/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
          >
            ← Back to Public Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};
