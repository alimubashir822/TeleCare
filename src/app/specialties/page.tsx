'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Activity, Stethoscope, BrainCircuit, ShieldAlert, ChevronRight } from 'lucide-react';

export default function Specialties() {
  const list = [
    { name: 'Dermatology', icon: Heart, count: '12 Specialists Available', desc: 'Expert medical and cosmetic treatment for skin rashes, eczema, hair loss, nail infections, acne flare-ups, and skin cancer screenings.', color: 'text-rose-400 bg-rose-500/10' },
    { name: 'Cardiology', icon: Activity, count: '8 Specialists Available', desc: 'Comprehensive cardiovascular care focusing on hypertension monitoring, preventative cardiology, heart disease, lipid management, and circulation.', color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Pediatrics', icon: Stethoscope, count: '15 Specialists Available', desc: 'Specialized care for infants, children, and young adults, covering checkups, developmental milestones, common infections, and nutritional advice.', color: 'text-cyan-400 bg-cyan-500/10' },
    { name: 'Psychiatry', icon: BrainCircuit, count: '10 Specialists Available', desc: 'Dedicated behavioral and psychiatric support addressing anxiety disorders, clinical depression, ADHD assessment, and cognitive-behavioral wellness.', color: 'text-purple-400 bg-purple-500/10' },
    { name: 'General Medicine', icon: ShieldAlert, count: '20 Specialists Available', desc: 'Primary care support for everyday symptoms, including colds, seasonal allergies, prescription refills, stomach bugs, and medical certificates.', color: 'text-amber-400 bg-amber-500/10' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Clinical Care Directory</span>
          <h1 className="text-4xl font-black text-white tracking-tight mt-2">Our Specialties</h1>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
            Consult verified board-certified physicians in the respective fields. Select a specialty to view active doctors.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 text-left">
            {list.map((spec, i) => (
              <div key={i} className="glass p-8 rounded-3xl border border-slate-800 flex flex-col justify-between hover:border-brand-500/20 transition group">
                <div>
                  <div className={`p-3.5 rounded-xl w-fit ${spec.color}`}>
                    <spec.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mt-6 group-hover:text-brand-300 transition">{spec.name}</h3>
                  <span className="inline-block text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-1">{spec.count}</span>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">{spec.desc}</p>
                </div>
                <Link
                  href={`/find-doctors?specialty=${spec.name}`}
                  className="mt-8 flex items-center justify-between text-xs font-bold text-brand-400 hover:text-white transition group/link bg-slate-900 border border-slate-850 px-4 py-3 rounded-xl"
                >
                  <span>Discover {spec.name} Doctors</span>
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
