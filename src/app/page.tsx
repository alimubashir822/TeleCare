'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ArrowRight, Video, ShieldCheck, Heart, 
  Sparkles, BrainCircuit, Activity, Clock, 
  Users, Stethoscope, Star
} from 'lucide-react';

export default function Home() {
  const specialties = [
    { name: 'Dermatology', desc: 'Skin, hair, and nail treatments', icon: Heart, color: 'text-rose-400 bg-rose-500/10' },
    { name: 'Cardiology', desc: 'Heart and blood pressure care', icon: Activity, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Pediatrics', desc: 'Newborn and adolescent health', icon: Stethoscope, color: 'text-cyan-400 bg-cyan-500/10' },
    { name: 'Psychiatry', desc: 'Anxiety, depression & mental wellness', icon: BrainCircuit, color: 'text-purple-400 bg-purple-500/10' },
  ];

  const features = [
    {
      title: 'Secure Video Visits',
      desc: 'Connect in real-time with certified physicians via high-definition, HIPAA-compliant encryption.',
      icon: Video
    },
    {
      title: 'AI Health Assistant',
      desc: 'Our clinical AI summarizes symptoms before you meet and helps translate care instructions afterward.',
      icon: Sparkles
    },
    {
      title: 'Digital Prescriptions',
      desc: 'Receive signed medical prescriptions directly in your portal. Download, print, or share with local pharmacies.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
          {/* Backdrop Blur Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-medium text-slate-300 mb-6 tracking-wide">
              <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
              <span>Next-Gen Virtual Care Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Consult qualified doctors from anywhere through <span className="bg-gradient-to-r from-brand-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent text-glow">secure online visits</span>.
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              TeleCare AI is a secure virtual clinic platform connecting patients with certified specialists. Get diagnoses, prescriptions, and follow-ups in clicks.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/find-doctors"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/20 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white font-bold rounded-2xl border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2"
              >
                <span>Join as Doctor</span>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="mt-16 pt-12 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
              <div>
                <p className="text-3xl font-black text-white">99.8%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Uptime SLA</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">15 Min</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Average Wait Time</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">50+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Board-Certified MDs</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">4.9 ★</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Patient Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-y border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Designed for clinical excellence
              </h2>
              <p className="mt-4 text-slate-400">
                A complete telemedicine ecosystem replacing physical checkups for standard symptoms. Secure, private, and powered by clinical AI models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="glass p-8 rounded-3xl glass-card-hover border border-slate-800">
                  <div className="p-3 bg-brand-500/10 rounded-2xl w-fit">
                    <feature.icon className="w-6 h-6 text-brand-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mt-6">{feature.title}</h3>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties Grid */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Expert Specialists</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                  Find care for any concern
                </h2>
                <p className="text-slate-400 mt-4 leading-relaxed">
                  Select a category to discover medical specialists available today for immediate video consults.
                </p>
              </div>
              <Link
                href="/find-doctors"
                className="flex items-center gap-2 text-brand-400 hover:text-brand-300 font-bold transition text-sm group"
              >
                <span>Browse all specialists</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialties.map((spec, i) => (
                <Link
                  key={i}
                  href={`/find-doctors?specialty=${spec.name}`}
                  className="glass p-6 rounded-2xl border border-slate-800 hover:border-brand-500/30 hover:bg-slate-900/60 transition group text-left"
                >
                  <div className={`p-3.5 rounded-xl w-fit ${spec.color}`}>
                    <spec.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mt-6 group-hover:text-brand-300 transition">{spec.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{spec.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HIPAA Security Section */}
        <section className="py-20 bg-slate-950 border-t border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Secure & Compliant
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                  Enterprise-grade patient data protection
                </h2>
                <p className="text-slate-400 mt-4 leading-relaxed">
                  Your medical data is encrypted during transit and at rest. TeleCare AI conforms strictly to federal regulations ensuring patient privacy rights are fully protected.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex gap-3">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg h-fit mt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">AES-256 Bit Encryption</p>
                      <p className="text-xs text-slate-400 mt-1">All video streams and health files are secured with military-grade algorithms.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg h-fit mt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Full HIPAA Audit Trails</p>
                      <p className="text-xs text-slate-400 mt-1">Access logs are recorded to log when health files are viewed and by whom.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Mock */}
              <div className="glass p-8 rounded-3xl border border-slate-800 flex flex-col justify-between aspect-video relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Live Security Shield</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">TLS_AES_256_GCM_SHA384</span>
                </div>
                <div className="my-6">
                  <p className="text-2xl font-mono font-bold text-white tracking-wide">SECURE SYNC: ACTIVE</p>
                  <p className="text-xs text-slate-400 mt-1">Continuous zero-knowledge verification on all doctor-patient channels.</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span>Only authorized MDs assigned to bookings can view medical records.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
