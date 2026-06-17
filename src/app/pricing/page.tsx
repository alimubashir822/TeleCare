'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Pricing() {
  const tiers = [
    {
      name: 'Patient Account',
      price: '$0',
      period: 'Always Free',
      desc: 'Access doctor directory, book consultations, hold video visits, and manage your family health records.',
      features: [
        'Doctor Discovery Directory',
        'Secure video consult calls',
        'Digital prescriptions panel',
        'AI intake health assistant',
        'Standard document uploads',
      ],
      cta: 'Sign Up Free',
      href: '/login',
      popular: false
    },
    {
      name: 'Independent Clinic MD',
      price: '$49',
      period: 'per month',
      desc: 'For individual healthcare providers looking to run a digital practice and manage patients remotely.',
      features: [
        'Advanced schedule management',
        'Interactive patient history profiles',
        'Digital prescription builder',
        'AI pre-consultation summaries',
        'Billing and payment tracking',
        'Dedicated secure video rooms'
      ],
      cta: 'Join as Doctor',
      href: '/register',
      popular: true
    },
    {
      name: 'Multi-Clinic Hospital',
      price: 'Custom',
      period: 'Enterprise quote',
      desc: 'For multi-location hospital networks requiring custom integrations, white-labeling, and audit logs.',
      features: [
        'Unlimited doctors & patients',
        'Enterprise analytics panel',
        'Custom EHR API integrations',
        'Dedicated HIPAA support specialist',
        'SSO Authentication',
        'Raw database exports'
      ],
      cta: 'Contact Sales',
      href: '/contact',
      popular: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Transparent Tiers</span>
            <h1 className="text-4xl font-black text-white tracking-tight mt-2">Affordable Digital Health Solutions</h1>
            <p className="text-slate-400 mt-3 text-sm">
              Whether you are a patient looking for care, or a physician building a telehealth practice, we have the right plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {tiers.map((t, i) => (
              <div 
                key={i} 
                className={`glass p-8 rounded-3xl border flex flex-col justify-between relative ${
                  t.popular 
                    ? 'border-brand-500 bg-gradient-to-b from-brand-950/20 to-slate-900/60 shadow-xl shadow-brand-500/5' 
                    : 'border-slate-800'
                }`}
              >
                {t.popular && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-brand-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full">
                    Most Popular
                  </span>
                )}
                
                <div>
                  <h3 className="text-lg font-bold text-white">{t.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{t.price}</span>
                    <span className="text-xs text-slate-400">{t.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">{t.desc}</p>
                  
                  <ul className="mt-6 space-y-3 pt-6 border-t border-slate-850">
                    {t.features.map((f, k) => (
                      <li key={k} className="flex gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={t.href}
                  className={`mt-8 w-full py-3 text-center text-xs font-bold rounded-xl transition ${
                    t.popular 
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-500/10' 
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {t.cta}
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
