'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, Heart, Sparkles } from 'lucide-react';

export default function Register() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
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
        <h2 className="text-2xl font-black text-white tracking-tight">Join TeleCare AI Practice</h2>
        <p className="mt-1.5 text-xs text-slate-400">Onboard your clinic or register as an independent physician.</p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="glass py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 space-y-6 text-center">
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl text-left space-y-2">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Demonstration Notice
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                This is a telemedicine consultation portfolio application. Creating new databases credentials from scratch is disabled to protect demo data integrity.
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Please use the **Quick Switch Account** float panel in the bottom right corner to immediately login as a **Patient**, **Doctor**, or **Admin** and explore the dashboards!
              </p>
            </div>

            <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl text-left flex gap-3">
              <Heart className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Full Role Exploration</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  You can browse patient files as Doctor Sarah Khan, check hypertension records as Patient Sarah, write prescriptions, and inspect platform analytics in the Admin panel.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full inline-block py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-2xl shadow-xl transition text-sm"
          >
            Access Login Credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
