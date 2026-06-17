'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NotificationPanel from '@/components/NotificationPanel';
import { Activity, Menu, X, LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Find Doctors', href: '/find-doctors' },
    { name: 'Specialties', href: '/specialties' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Security', href: '/security' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-brand-500/10 rounded-xl group-hover:bg-brand-500/20 transition duration-300">
                <Activity className="w-6 h-6 text-brand-400 group-hover:scale-105 transition duration-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-300 transition duration-300">
                TeleCare<span className="text-brand-400">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition duration-200 ${
                  isActive(item.href)
                    ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile / CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/messages"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-800 transition"
                  title="Secure Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                <NotificationPanel />

                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">{user.name}</p>
                    <span className="text-[10px] text-slate-400 uppercase leading-none tracking-wider">{user.role.toLowerCase()}</span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl border border-transparent hover:border-red-900/30 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-semibold rounded-xl border border-slate-800 hover:border-slate-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-sm font-semibold rounded-xl border border-brand-500/20 transition duration-300"
                >
                  Join as Doctor
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg animate-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-medium transition ${
                  isActive(item.href)
                    ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu User / CTA */}
          <div className="pt-4 pb-4 border-t border-slate-800 px-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{user.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-red-950/20 text-slate-300 hover:text-red-400 rounded-xl border border-slate-800 hover:border-red-900/30 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 text-slate-300 hover:text-white bg-slate-900 rounded-xl border border-slate-800 transition text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-xl transition text-sm font-semibold"
                >
                  Join as Doctor
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
