import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-7 relative z-10 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 text-zinc-100 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Portfolio Admin CMS
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Secure content management system for Dr. Swati Vijay Shinde
            </p>
          </div>
        </div>

        {/* Quick Credentials Helper */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-2.5">
          <div className="font-semibold text-zinc-300 text-[11px] uppercase tracking-wider">
            Quick Admin Logins:
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('piyushpatel6770@gmail.com');
                setPassword('#1Piyush');
              }}
              className="flex-1 text-left text-[11px] font-bold px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer border border-zinc-700"
            >
              👤 Piyush Patel
              <div className="text-[10px] text-zinc-400 font-mono font-normal">piyushpatel6770@gmail.com</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@swatishinde.com');
                setPassword('admin123');
              }}
              className="flex-1 text-left text-[11px] font-bold px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer border border-zinc-700"
            >
              🎓 Dr. Swati Shinde
              <div className="text-[10px] text-zinc-400 font-mono font-normal">admin@swatishinde.com</div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="piyushpatel6770@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-zinc-900 border border-zinc-800 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-zinc-900 border border-zinc-800 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-100 hover:bg-white text-black font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-60 active:scale-98 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <a
            href={import.meta.env.VITE_PUBLIC_PORTFOLIO_URL || 'http://localhost:5173/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
          >
            ← Back to Public Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};
