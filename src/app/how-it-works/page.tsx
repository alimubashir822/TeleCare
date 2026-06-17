'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Calendar, Video, ClipboardList, Sparkles, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Find Your Doctor',
      desc: 'Browse doctor profiles by filtering by specialty, availability, fee, or language. Read credentials and choose the best fit.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Book Instantly',
      desc: 'Select a consultation type (Video visit, Follow-up, or Urgent Emergency) and choose a convenient time slot from their live schedule.',
      icon: Calendar,
    },
    {
      step: '03',
      title: 'Attend Secure Consultation',
      desc: 'Join the HD video call directly inside your browser portal. Share medical concerns, upload photos, and chat in real-time.',
      icon: Video,
    },
    {
      step: '04',
      title: 'Get Prescription & AI Care',
      desc: 'Download your signed digital prescription, read automated AI explanations of doctor advice, and receive smart care reminders.',
      icon: ClipboardList,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Patient Experience Roadmap</span>
            <h1 className="text-4xl font-black text-white tracking-tight mt-2">How TeleCare Works</h1>
            <p className="text-slate-400 mt-3 text-sm">
              We have simplified the clinical journey. Experience convenient, high-quality healthcare in four easy steps.
            </p>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Visual connector line for desktop */}
            <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-0.5 bg-slate-900 z-0" />

            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-800 hover:border-brand-500/50 flex items-center justify-center text-brand-400 transition duration-300">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-brand-500 text-slate-950 text-[10px] font-black flex items-center justify-center border-2 border-slate-950">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* AI Assistance Highlight */}
          <div className="glass p-8 rounded-3xl border border-slate-800 max-w-4xl mx-auto mt-20 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r from-teal-950/20 to-slate-900/60">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-brand-500/10 rounded-2xl h-fit">
                <Sparkles className="w-6 h-6 text-brand-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white">Enhanced with Clinical AI Automation</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                  Before your call starts, our AI checks in with you to format a symptoms report for the doctor. After the visit, it translates prescriptions and sets up recovery schedules automatically.
                </p>
              </div>
            </div>
            <Link
              href="/find-doctors"
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-bold rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
