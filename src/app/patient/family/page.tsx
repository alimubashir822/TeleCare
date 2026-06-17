'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, Heart, Calendar, Pill, FileText, ArrowRight, Plus,
  ShieldAlert, Activity, User, Baby
} from 'lucide-react';

const familyMembers = [
  {
    id: 'self',
    name: 'Sarah Jenkins',
    relation: 'Self',
    age: 34,
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e0e44d?w=80',
    bloodType: 'O+',
    conditions: ['Hypertension'],
    prescriptions: 3,
    upcomingAppointment: 'Dr. Ahmed Ali — Today, 4:00 PM',
    lastVisit: '2 weeks ago',
    healthScore: 82,
    isPrimary: true,
  },
  {
    id: 'father',
    name: 'Robert Jenkins',
    relation: 'Father',
    age: 62,
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80',
    bloodType: 'A+',
    conditions: ['Type 2 Diabetes', 'Arthritis'],
    prescriptions: 4,
    upcomingAppointment: null,
    lastVisit: '1 month ago',
    healthScore: 71,
    isPrimary: false,
  },
  {
    id: 'mother',
    name: 'Jane Jenkins',
    relation: 'Mother',
    age: 58,
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80',
    bloodType: 'B+',
    conditions: ['Thyroid Disorder'],
    prescriptions: 2,
    upcomingAppointment: null,
    lastVisit: '3 weeks ago',
    healthScore: 88,
    isPrimary: false,
  },
  {
    id: 'son',
    name: 'Billy Jenkins',
    relation: 'Son',
    age: 8,
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80',
    bloodType: 'O+',
    conditions: [],
    prescriptions: 0,
    upcomingAppointment: null,
    lastVisit: '6 months ago',
    healthScore: 98,
    isPrimary: false,
  }
];

function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-emerald-400' : score >= 65 ? 'bg-amber-400' : 'bg-rose-400';
  const label = score >= 85 ? 'Excellent' : score >= 65 ? 'Good' : 'Needs Attention';
  const textColor = score >= 85 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-rose-400';
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-slate-500 font-bold uppercase">Health Score</span>
        <span className={`font-black ${textColor}`}>{score} — {label}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function FamilyPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeMember, setActiveMember] = useState(familyMembers[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950"><Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'PATIENT') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 font-sans"><Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Patient Access Only</h2>
          </div>
        </div><Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />

      <main className="flex-1 py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-900">
            <div className="text-left">
              <Link href="/patient/dashboard" className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 mb-2">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Users className="w-8 h-8 text-brand-400" />
                Family Healthcare
              </h1>
              <p className="text-slate-400 mt-1 text-sm">Manage health records, appointments, and care plans for your entire family.</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              Add Family Member
            </button>
          </div>

          {/* Add Member Form */}
          {showAddForm && (
            <div className="glass p-6 rounded-3xl border border-brand-500/20 bg-brand-950/10 animate-in slide-in-from-top-4 duration-200">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Baby className="w-4 h-4 text-brand-400" /> Add New Family Member
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Full Name', 'Relationship', 'Date of Birth'].map(field => (
                  <div key={field}>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">{field}</label>
                    <input type="text" placeholder={`Enter ${field.toLowerCase()}`} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold rounded-xl transition">
                  Save Member
                </button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-sm font-semibold rounded-xl border border-slate-800 transition">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Family Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {familyMembers.map(member => (
              <button
                key={member.id}
                onClick={() => setActiveMember(member)}
                className={`p-4 rounded-2xl border transition text-left space-y-3 ${
                  activeMember.id === member.id
                    ? 'glass border-brand-500/40 bg-brand-950/20'
                    : 'glass border-slate-800 hover:border-slate-700 hover:bg-slate-900/30'
                }`}
              >
                <div className="relative w-fit">
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover border-2 border-slate-700" />
                  {member.isPrimary && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <span className="text-[6px] text-white font-black">P</span>
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{member.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">{member.relation} • {member.age}y</p>
                </div>
                <div className={`w-full h-1 rounded-full ${member.healthScore >= 85 ? 'bg-emerald-400' : member.healthScore >= 65 ? 'bg-amber-400' : 'bg-rose-400'}`}
                  style={{ opacity: 0.6 }}
                />
              </button>
            ))}
          </div>

          {/* Active Member Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Profile Card */}
            <div className="glass p-6 rounded-3xl border border-slate-800 space-y-5 text-left">
              <div className="flex items-center gap-4">
                <img src={activeMember.avatar} alt={activeMember.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700" />
                <div>
                  <h2 className="text-lg font-black text-white">{activeMember.name}</h2>
                  <p className="text-xs text-brand-400 font-bold">{activeMember.relation} • {activeMember.gender} • Age {activeMember.age}</p>
                </div>
              </div>

              <ScoreBar score={activeMember.healthScore} />

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2.5 border-b border-slate-800">
                  <span className="text-slate-500 font-semibold">Blood Type</span>
                  <span className="text-white font-bold">{activeMember.bloodType}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-slate-800">
                  <span className="text-slate-500 font-semibold">Last Visit</span>
                  <span className="text-white">{activeMember.lastVisit}</span>
                </div>
                <div className="py-2.5">
                  <span className="text-slate-500 font-semibold block mb-2">Active Conditions</span>
                  {activeMember.conditions.length > 0
                    ? activeMember.conditions.map(c => (
                        <span key={c} className="inline-block px-2 py-0.5 bg-rose-950/20 border border-rose-900/30 text-rose-400 text-[10px] font-bold rounded-md mr-1 mb-1">{c}</span>
                      ))
                    : <span className="text-emerald-400 font-semibold">✓ No active conditions</span>
                  }
                </div>
              </div>

              <Link
                href="/find-doctors"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold rounded-xl transition"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book for {activeMember.name.split(' ')[0]}
              </Link>
            </div>

            {/* Care Summary */}
            <div className="lg:col-span-2 space-y-5">

              {/* Upcoming */}
              <div className="glass p-5 rounded-3xl border border-slate-800 space-y-3 text-left">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-400" /> Upcoming Appointment
                </h3>
                {activeMember.upcomingAppointment ? (
                  <div className="p-4 bg-brand-950/20 border border-brand-900/30 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{activeMember.upcomingAppointment}</p>
                      <p className="text-xs text-brand-400 mt-0.5">Video Consultation</p>
                    </div>
                    <Link
                      href="/video-consultation/demo"
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition"
                    >
                      Join
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-center justify-between">
                    <p className="text-xs text-slate-500">No upcoming appointments</p>
                    <Link href="/find-doctors" className="text-xs text-brand-400 hover:text-white font-bold flex items-center gap-1">
                      Book Now <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <Pill className="w-5 h-5 text-purple-400" />, label: 'Prescriptions', value: activeMember.prescriptions, href: '/patient/records?tab=prescriptions' },
                  { icon: <Heart className="w-5 h-5 text-rose-400" />, label: 'Health Score', value: `${activeMember.healthScore}/100`, href: '/patient/health' },
                  { icon: <FileText className="w-5 h-5 text-brand-400" />, label: 'Documents', value: activeMember.conditions.length > 0 ? 3 : 0, href: '/patient/records?tab=documents' },
                ].map((stat, i) => (
                  <Link key={i} href={stat.href} className="glass p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition text-left group">
                    <div className="flex items-center gap-2 mb-2">{stat.icon}</div>
                    <p className="text-xl font-black text-white">{stat.value}</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">{stat.label}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-400 mt-2 transition" />
                  </Link>
                ))}
              </div>

              {/* Conditions Timeline */}
              {activeMember.conditions.length > 0 ? (
                <div className="glass p-5 rounded-3xl border border-slate-800 text-left space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-400" />
                    Active Care Plans
                  </h3>
                  {activeMember.conditions.map(c => (
                    <div key={c} className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{c} Management</p>
                        <p className="text-xs text-slate-500 mt-0.5">Active care plan • Reviewed 2 weeks ago</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-[10px] font-bold rounded-md">Active</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass p-5 rounded-3xl border border-emerald-900/20 bg-emerald-950/10 text-left">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-emerald-400" />
                    <div>
                      <p className="text-sm font-bold text-emerald-300">{activeMember.name.split(' ')[0]} is in great health!</p>
                      <p className="text-xs text-emerald-500 mt-0.5">No active conditions on record. Preventive care recommended annually.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
