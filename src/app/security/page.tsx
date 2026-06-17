'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, EyeOff, ClipboardList, RefreshCw, KeyRound, Lock } from 'lucide-react';

export default function Security() {
  const standards = [
    {
      title: 'HIPAA Compliance',
      desc: 'All virtual visits, consultation entries, health reports, and prescription documents comply strictly with Health Insurance Portability and Accountability Act standards.',
      icon: Shield
    },
    {
      title: 'End-to-End Encryption',
      desc: 'Media streams (WebRTC video and audio sessions) utilize DTLS-SRTP encryption, ensuring that no third party can intercept or access raw calls.',
      icon: Lock
    },
    {
      title: 'Encrypted Storage',
      desc: 'Sensitive clinical records, patient profiles, diagnoses, and medical databases are encrypted at rest using industry-grade AES-256 standard encryption keys.',
      icon: EyeOff
    },
    {
      title: 'Audit Logging & Access',
      desc: 'Every file read, patient summary view, and prescription generation triggers a permanent log entry, showing who accessed the details and when.',
      icon: ClipboardList
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 justify-center">
              <Shield className="w-4 h-4" /> Security Architecture
            </span>
            <h1 className="text-4xl font-black text-white tracking-tight mt-2">Privacy & Compliance Standards</h1>
            <p className="text-slate-400 mt-3 text-sm">
              We understand the sensitivity of health data. TeleCare AI implements modern, enterprise-grade safety protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {standards.map((s, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit text-emerald-400">
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Secure flow banner */}
          <div className="glass p-8 rounded-3xl border border-slate-800 max-w-4xl mx-auto mt-12 bg-slate-900/50 flex flex-col sm:flex-row gap-6 items-center">
            <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-400">
              <KeyRound className="w-8 h-8" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Zero-Knowledge Verification Architecture</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                TeleCare AI servers do not store or inspect video stream data. Keys are negotiated peer-to-peer directly between the patient and doctor device web browsers, ensuring absolute privacy.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
