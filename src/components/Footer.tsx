'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-brand-500/10 rounded-xl">
                <Activity className="w-5 h-5 text-brand-400" />
              </div>
              <span className="text-lg font-bold text-white">
                TeleCare<span className="text-brand-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              A secure, HIPAA-compliant virtual healthcare platform connecting patients and doctors globally. Empowering wellness through digital innovation.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-900/30 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>HIPAA Compliant Secure</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2.5">
              <li><Link href="/find-doctors" className="text-sm text-slate-400 hover:text-white transition">Find a Doctor</Link></li>
              <li><Link href="/specialties" className="text-sm text-slate-400 hover:text-white transition">Specialties</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-slate-400 hover:text-white transition">How It Works</Link></li>
              <li><Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition">Pricing Tiers</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Security & Legal</h3>
            <ul className="space-y-2.5">
              <li><Link href="/security" className="text-sm text-slate-400 hover:text-white transition">Security Standards</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition">Support Contact</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Contact Support</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-brand-400 mt-0.5" />
                <span>support@telecare.ai</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-brand-400 mt-0.5" />
                <span>+1 (800) 555-CARE</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5" />
                <span>100 Health Tech Way, Suite 400, San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} TeleCare AI Inc. All rights reserved. Made for demonstration.
          </p>
          <div className="flex gap-4">
            <span className="text-[10px] text-slate-600 bg-slate-900 border border-slate-800 px-2 py-1 rounded">v1.0.0 Stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
