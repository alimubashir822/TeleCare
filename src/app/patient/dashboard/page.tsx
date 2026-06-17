'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIHealthAssistant from '@/components/AIHealthAssistant';
import { useAuth } from '@/context/AuthContext';
import { getPatientAppointments } from '@/lib/appointment-actions';
import { getProfileDetails } from '@/lib/auth-actions';
import { getPatientVitals } from '@/lib/vital-actions';
import { 
  Calendar, ShieldAlert, Video, ClipboardList, 
  FileText, Activity, Users, ArrowRight, Clock, Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PatientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<any | null>(null);
  const [vitalLogs, setVitalLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Follow-up Goals State
  const [goals, setGoals] = useState({
    vitals: false
  });
  
  // Family accounts selector
  const [activeFamilyMember, setActiveFamilyMember] = useState('Self');
  const familyMembers = ['Self', 'Father (Robert)', 'Mother (Jane)', 'Son (Billy)'];

  useEffect(() => {
    async function loadDashboardData() {
      if (user && user.role === 'PATIENT') {
        setLoading(true);
        // Fetch appointments
        const appRes = await getPatientAppointments(user.id);
        if (appRes.success && appRes.appointments) {
          setAppointments(appRes.appointments);
        }

        // Fetch detailed profile for records counts
        const profileRes = await getProfileDetails(user.id, 'PATIENT');
        if (profileRes.success && profileRes.data) {
          setPatientData(profileRes.data);
          
          // Fetch Vitals
          const vitRes = await getPatientVitals(profileRes.data.id);
          if (vitRes.success && vitRes.vitalLogs) {
            setVitalLogs(vitRes.vitalLogs);
            if (vitRes.vitalLogs.length > 0) {
              setGoals(prev => ({ ...prev, vitals: true }));
            }
          }
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    if (!authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  // Auth checking
  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'PATIENT') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Patient Access Only</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              You must be logged in as a Patient to view this portal dashboard. 
            </p>
            <p className="text-slate-400 text-xs font-semibold">
              Please use the floating Demo Control Panel in the bottom right corner and select &quot;Sarah Jenkins&quot;.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter upcoming appointments (confirmed or in progress)
  const upcoming = appointments.filter(app => app.status === 'CONFIRMED' || app.status === 'IN_PROGRESS');
  const pastAppointments = appointments.filter(app => app.status === 'COMPLETED');
  
  // Counts
  const docCount = patientData?.documents?.length || 3;
  const prescriptionsCount = appointments.flatMap(app => app.consultation?.prescriptions || []).length || 3;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />

      <main className="flex-1 py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Dashboard Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900">
            <div className="text-left">
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                Good Morning, {user.name} 👋
              </h1>
              <p className="text-slate-400 mt-2 text-sm">Welcome back to your secure digital healthcare panel.</p>
            </div>

            {/* Family Account Selector */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 border border-slate-850 p-1.5 rounded-2xl w-fit">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold px-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Profile:
              </span>
              {familyMembers.map(member => (
                <button
                  key={member}
                  onClick={() => setActiveFamilyMember(member)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeFamilyMember === member
                      ? 'bg-brand-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {member.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Family Member Notification Indicator if not Self */}
          {activeFamilyMember !== 'Self' && (
            <div className="p-3 bg-amber-950/20 border border-amber-900/30 text-amber-400 text-xs rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
              <Activity className="w-4 h-4" />
              <span>Viewing records, care plans, and scheduling history for: <strong>{activeFamilyMember}</strong>.</span>
            </div>
          )}

          {/* Main Dashboard Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side: Upcoming Appointments, Records summary, Prescriptions summary */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Upcoming Appointment Section */}
              <div className="glass p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-400" />
                    Upcoming Consultations
                  </h3>
                  <Link
                    href="/find-doctors"
                    className="text-xs text-brand-400 hover:text-white transition flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book New
                  </Link>
                </div>

                {upcoming.length === 0 ? (
                  <div className="p-6 bg-slate-900/40 border border-slate-850 rounded-2xl text-center space-y-4">
                    <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-slate-400 text-xs">No upcoming video consultations scheduled.</p>
                    <Link
                      href="/find-doctors"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-xs font-bold rounded-xl border border-brand-500/20 transition"
                    >
                      <span>Find a Doctor & Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcoming.map(app => {
                      const appDate = new Date(app.dateTime);
                      const isToday = new Date().toDateString() === appDate.toDateString();
                      return (
                        <div 
                          key={app.id} 
                          className="p-5 bg-gradient-to-r from-brand-950/20 to-slate-900/60 border border-slate-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex gap-4">
                            <img 
                              src={app.doctor.user.avatar} 
                              alt={app.doctor.user.name} 
                              className="w-12 h-12 rounded-xl object-cover border border-slate-700" 
                            />
                            <div className="text-left">
                              <h4 className="text-sm font-bold text-white">{app.doctor.user.name}</h4>
                              <p className="text-xs text-brand-400 font-semibold">{app.doctor.specialty} • {app.type}</p>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                  {appDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  {appDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* CTA: Join Video call */}
                          <Link
                            href={`/video-consultation/${app.id}`}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition flex items-center justify-center gap-1.5 pulse-active"
                          >
                            <Video className="w-4 h-4 fill-slate-950" />
                            <span>Join Video Call</span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Smart Recovery Check-ins */}
              {pastAppointments.length > 0 && (
                <div className="glass p-6 rounded-3xl border border-slate-800 space-y-6 text-left">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-5 h-5 text-brand-400" />
                      Smart Recovery Care Check-ins
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Interactive recovery checkpoints for your recent visit with {pastAppointments[0].doctor.user.name}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Day 1 */}
                    <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wide">Day 1 Check-in</span>
                        {goals.vitals ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-200 font-bold">Review Medication Guide</p>
                      <p className="text-[11px] text-slate-400 leading-normal">Confirm you have reviewed Metoprolol safety limits and usage guides.</p>
                      {!goals.vitals ? (
                        <button
                          onClick={() => {
                            setGoals(prev => ({ ...prev, vitals: true }));
                            confetti({ particleCount: 50, spread: 60 });
                          }}
                          className="w-full py-1.5 bg-brand-500 hover:bg-brand-400 text-slate-950 text-[10px] font-bold rounded-lg transition"
                        >
                          Mark as Reviewed
                        </button>
                      ) : (
                        <p className="text-[10px] text-emerald-400 font-medium italic">Confirmed Day 1 instructions</p>
                      )}
                    </div>

                    {/* Day 7 */}
                    <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wide">Day 7 Check-in</span>
                        {goals.vitals && vitalLogs.length > 2 ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-200 font-bold">BP Vitals Tracking Check</p>
                      <p className="text-[11px] text-slate-400 leading-normal">Submit at least 3 daily blood pressure records via the biometrics portal.</p>
                      <Link
                        href="/patient/records"
                        className="w-full inline-block text-center py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-[10px] font-bold rounded-lg transition"
                      >
                        Log Vitals Now
                      </Link>
                    </div>

                    {/* Day 30 */}
                    <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wide">Day 30 Check-in</span>
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                      </div>
                      <p className="text-xs text-slate-200 font-bold">Book Follow-up Consult</p>
                      <p className="text-[11px] text-slate-400 leading-normal">Evaluate medication effectiveness and check cardiac health trends.</p>
                      <Link
                        href={`/find-doctors?specialty=Cardiology`}
                        className="w-full inline-block text-center py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 text-[10px] font-bold rounded-lg transition"
                      >
                        Schedule Checkup
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Health records block */}
                <div className="glass p-6 rounded-3xl border border-slate-800 flex flex-col justify-between group">
                  <div>
                    <div className="p-3 bg-brand-500/10 rounded-2xl w-fit text-brand-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mt-4">Health Records</h3>
                    <p className="text-3xl font-black text-white mt-2">{docCount}</p>
                    <p className="text-xs text-slate-500 mt-1">Uploaded reports & documents.</p>
                  </div>
                  <Link
                    href="/patient/records"
                    className="mt-6 flex items-center justify-between text-xs font-bold text-brand-400 hover:text-white transition"
                  >
                    <span>View all files & timeline</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>

                {/* Prescriptions block */}
                <div className="glass p-6 rounded-3xl border border-slate-800 flex flex-col justify-between group">
                  <div>
                    <div className="p-3 bg-brand-500/10 rounded-2xl w-fit text-brand-400">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mt-4">Active Prescriptions</h3>
                    <p className="text-3xl font-black text-white mt-2">{prescriptionsCount}</p>
                    <p className="text-xs text-slate-500 mt-1">Medications currently prescribed.</p>
                  </div>
                  <Link
                    href="/patient/records?tab=prescriptions"
                    className="mt-6 flex items-center justify-between text-xs font-bold text-brand-400 hover:text-white transition"
                  >
                    <span>View instructions</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>

                {/* Health Monitoring block */}
                <div className="glass p-6 rounded-3xl border border-slate-800 flex flex-col justify-between group">
                  <div>
                    <div className="p-3 bg-rose-500/10 rounded-2xl w-fit text-rose-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mt-4">Health Monitoring</h3>
                    <p className="text-3xl font-black text-white mt-2">{vitalLogs.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Days of vitals logged.</p>
                  </div>
                  <Link
                    href="/patient/health"
                    className="mt-6 flex items-center justify-between text-xs font-bold text-rose-400 hover:text-white transition"
                  >
                    <span>View 30-day trends</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>

                {/* Family Healthcare block */}
                <div className="glass p-6 rounded-3xl border border-slate-800 flex flex-col justify-between group">
                  <div>
                    <div className="p-3 bg-teal-500/10 rounded-2xl w-fit text-teal-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mt-4">Family Healthcare</h3>
                    <p className="text-3xl font-black text-white mt-2">4</p>
                    <p className="text-xs text-slate-500 mt-1">Family members managed.</p>
                  </div>
                  <Link
                    href="/patient/family"
                    className="mt-6 flex items-center justify-between text-xs font-bold text-teal-400 hover:text-white transition"
                  >
                    <span>Manage family profiles</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>

              </div>

            </div>

            {/* Right side: AI Health Assistant */}
            <div className="lg:col-span-1">
              <AIHealthAssistant />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
