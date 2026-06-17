'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Activity, Key, Lock, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Redirect based on role (or use reload to trigger AuthContext useEffect)
      // Redirect logic:
      const savedUser = localStorage.getItem('telecare_session');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'DOCTOR') window.location.href = '/doctor/dashboard';
        else if (parsed.role === 'ADMIN') window.location.href = '/admin/dashboard';
        else window.location.href = '/patient/dashboard';
      }
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-850 px-3.5 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto w-full max-w-md text-center">
        <div className="inline-flex p-3 bg-brand-500/10 rounded-2xl mb-4">
          <Activity className="w-8 h-8 text-brand-400" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Sign In to TeleCare AI</h2>
        <p className="mt-1.5 text-xs text-slate-400">Access your secure virtual healthcare portal.</p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="glass py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 space-y-6">
          
          {error && (
            <div className="flex gap-2 p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                  required
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                  required
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Info Box for Reviewers */}
          <div className="p-4 bg-teal-950/20 border border-teal-900/30 rounded-2xl space-y-2 text-left">
            <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              Developer Bypass Info
            </span>
            <p className="text-[10px] text-slate-400 leading-normal">
              You can sign in with seeded credentials:
            </p>
            <ul className="text-[10px] text-slate-300 font-mono space-y-1.5 list-disc pl-4">
              <li>Patient: <span className="text-teal-300">sarah.jenkins@telecare.ai</span> / <span className="text-teal-300">patient123</span></li>
              <li>Doctor: <span className="text-teal-300">sarah.khan@telecare.ai</span> / <span className="text-teal-300">doctor123</span></li>
            </ul>
            <p className="text-[9px] text-slate-500 italic mt-2">
              Alternatively, use the floating control panel at the bottom right to switch instantly.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
