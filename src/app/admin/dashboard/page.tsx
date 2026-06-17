'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getAdminStats } from '@/lib/admin-actions';
import { 
  ShieldAlert, Activity, Users, Calendar, DollarSign, 
  CheckCircle2, Star, Settings, UserCheck, TrendingUp,
  Zap, Lock, BarChart3, AlertCircle, ArrowRight, RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<any>({ docCount: 0, patCount: 0, appCount: 0, revenue: 0 });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>([]);
  const [monthlyConsultations, setMonthlyConsultations] = useState<number[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [specialtyMap, setSpecialtyMap] = useState<Record<string, number>>({});
  const [patientEngagement, setPatientEngagement] = useState<any[]>([]);
  const [topDoctor, setTopDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifiedDocs, setVerifiedDocs] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'patients' | 'audit'>('overview');

  useEffect(() => {
    async function loadAdminData() {
      if (user && user.role === 'ADMIN') {
        setLoading(true);
        const res = await getAdminStats();
        if (res.success && res.stats) {
          setStats(res.stats);
          setDoctors(res.doctors || []);
          setAppointments(res.appointments || []);
          setMonthlyRevenue(res.monthlyRevenue || []);
          setMonthlyConsultations(res.monthlyConsultations || []);
          setMonths(res.months || []);
          setSpecialtyMap(res.specialtyMap || {});
          setPatientEngagement(res.patientEngagement || []);
          setTopDoctor(res.topDoctor || null);

          const verMap: Record<string, boolean> = {};
          res.doctors?.forEach((d: any) => { verMap[d.id] = true; });
          setVerifiedDocs(verMap);
        }
        setLoading(false);
      }
    }
    if (!authLoading) loadAdminData();
  }, [user, authLoading]);

  const toggleVerification = (docId: string) => {
    setVerifiedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

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

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Admin Access Only</h2>
            <p className="text-slate-400 text-xs">Use the Demo Control Panel (bottom-right) and select "System Admin".</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const maxRevenue = Math.max(...monthlyRevenue, 1);
  const maxConsults = Math.max(...monthlyConsultations, 1);
  const totalSpecialties = Object.values(specialtyMap).reduce((a: number, b: number) => a + b, 0);
  const retentionRate = patientEngagement.length > 0 
    ? Math.round(patientEngagement.filter(p => p.score > 50).length / patientEngagement.length * 100) 
    : 82;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-950 py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-900">
            <div className="text-left">
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <Settings className="w-8 h-8 text-brand-400" />
                Platform Owner Console
              </h1>
              <p className="text-slate-400 mt-2 text-sm">Monitor platform metrics, approve physicians, and audit transaction data.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500 font-bold bg-slate-900 border border-slate-850 px-3 py-2 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                All Nodes Operational
              </div>
              <Link href="/admin/automation" className="flex items-center gap-2 px-3 py-2 bg-amber-950/20 hover:bg-amber-950/30 border border-amber-900/30 text-amber-400 text-xs font-bold rounded-xl transition">
                <Zap className="w-3.5 h-3.5" /> Automation
              </Link>
              <Link href="/admin/security" className="flex items-center gap-2 px-3 py-2 bg-emerald-950/20 hover:bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 text-xs font-bold rounded-xl transition">
                <Lock className="w-3.5 h-3.5" /> Security
              </Link>
            </div>
          </div>

          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { icon: <UserCheck className="w-5 h-5" />, label: 'Physicians', value: stats.docCount, sub: 'verified active', color: 'text-brand-400 bg-brand-500/10' },
              { icon: <Users className="w-5 h-5" />, label: 'Patients', value: stats.patCount, sub: 'registered', color: 'text-teal-400 bg-teal-500/10' },
              { icon: <Calendar className="w-5 h-5" />, label: 'Consultations', value: stats.appCount, sub: 'total booked', color: 'text-purple-400 bg-purple-500/10' },
              { icon: <DollarSign className="w-5 h-5" />, label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, sub: 'total earned', color: 'text-emerald-400 bg-emerald-500/10' },
              { icon: <TrendingUp className="w-5 h-5" />, label: 'Retention', value: `${retentionRate}%`, sub: 'patient retention', color: 'text-amber-400 bg-amber-500/10' },
            ].map((kpi, i) => (
              <div key={i} className="glass p-5 rounded-3xl border border-slate-800 text-left flex items-center gap-4">
                <div className={`p-2.5 rounded-2xl ${kpi.color}`}>{kpi.icon}</div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{kpi.label}</p>
                  <p className="text-xl font-black text-white mt-0.5">{kpi.value}</p>
                  <p className="text-[10px] text-slate-600">{kpi.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Revenue Trend (2/3) */}
            <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-800 space-y-5 text-left">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-400" />
                  Revenue Trend — Last 6 Months
                </h3>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +26% YoY
                </span>
              </div>

              {/* Revenue Chart */}
              <div className="flex items-end gap-2 h-36 pt-4">
                {monthlyRevenue.map((rev, i) => {
                  const h = Math.round((rev / maxRevenue) * 100);
                  const isLast = i === monthlyRevenue.length - 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[9px] text-slate-600 group-hover:text-slate-400 transition font-mono opacity-0 group-hover:opacity-100">
                        ${rev.toLocaleString()}
                      </span>
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          isLast ? 'bg-brand-500 shadow-lg shadow-brand-500/20' : 'bg-slate-700/60 hover:bg-brand-500/60'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[9px] text-slate-600 font-bold">{months[i]}</span>
                    </div>
                  );
                })}
              </div>

              {/* Consultations mini chart */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Consultation Volume</p>
                <div className="flex items-end gap-1.5 h-10">
                  {monthlyConsultations.map((count, i) => {
                    const h = Math.round((count / maxConsults) * 100);
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-teal-500/30 hover:bg-teal-400/50 rounded-sm transition group relative"
                        style={{ height: `${h}%` }}
                        title={`${count} consultations`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] text-slate-600">
                  {months.map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            </div>

            {/* Specialty Breakdown (1/3) */}
            <div className="glass p-6 rounded-3xl border border-slate-800 space-y-4 text-left">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-400" />
                Specialty Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(specialtyMap).map(([spec, count], i) => {
                  const pct = Math.round((count / totalSpecialties) * 100);
                  const colors = ['bg-brand-500', 'bg-teal-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
                  return (
                    <div key={spec} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-medium truncate pr-2">{spec}</span>
                        <span className="text-white font-bold">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {topDoctor && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Top Physician by Volume</p>
                  <div className="flex items-center gap-3">
                    <img src={topDoctor.user.avatar} className="w-8 h-8 rounded-full border border-slate-700 object-cover" alt={topDoctor.user.name} />
                    <div>
                      <p className="text-xs font-bold text-white">{topDoctor.user.name}</p>
                      <p className="text-[10px] text-brand-400">{topDoctor.specialty} • {topDoctor.appointments?.length || 0} bookings</p>
                    </div>
                    <Star className="w-4 h-4 text-amber-400 ml-auto" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tab Section */}
          <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
            {[
              { id: 'overview', label: 'Patient Engagement' },
              { id: 'doctors', label: 'Physicians' },
              { id: 'audit', label: 'Transaction Log' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Patient Engagement Tab */}
          {activeTab === 'overview' && (
            <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  Patient Engagement Scoring
                </h3>
                <span className="text-[10px] text-slate-500">Based on appointment completion & vital monitoring</span>
              </div>
              {patientEngagement.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No patient data available</div>
              ) : (
                <div className="overflow-x-auto text-left">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-850 text-[10px] text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold">Patient</th>
                        <th className="py-3 px-4 font-semibold">Engagement Score</th>
                        <th className="py-3 px-4 font-semibold">Visits</th>
                        <th className="py-3 px-4 font-semibold">Vitals</th>
                        <th className="py-3 px-4 font-semibold">Follow-up Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {patientEngagement.map(p => (
                        <tr key={p.id} className="hover:bg-slate-900/20 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <img src={p.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b9e0e44d?w=80'} className="w-7 h-7 rounded-full object-cover border border-slate-700" alt={p.name} />
                              <span className="font-bold text-white">{p.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${p.score >= 85 ? 'bg-emerald-400' : p.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                  style={{ width: `${p.score}%` }}
                                />
                              </div>
                              <span className={`font-black ${p.score >= 85 ? 'text-emerald-400' : p.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>{p.score}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{p.completedVisits}/{p.totalVisits}</td>
                          <td className="py-3 px-4">
                            {p.hasVitals
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              : <AlertCircle className="w-4 h-4 text-amber-400" />
                            }
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              p.risk === 'Low' ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' :
                              p.risk === 'Medium' ? 'bg-amber-950/20 border-amber-900/30 text-amber-400' :
                              'bg-rose-950/20 border-rose-900/30 text-rose-400'
                            }`}>{p.risk} Risk</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Physicians Tab */}
          {activeTab === 'doctors' && (
            <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-brand-400" />
                  Physician Verification Console
                </h3>
                <span className="text-xs text-slate-500">{doctors.filter(d => verifiedDocs[d.id]).length} of {doctors.length} verified</span>
              </div>
              <div className="overflow-x-auto text-left">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-[10px] text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Doctor</th>
                      <th className="py-3 px-4 font-semibold">Specialty</th>
                      <th className="py-3 px-4 font-semibold">Experience</th>
                      <th className="py-3 px-4 font-semibold">Fee</th>
                      <th className="py-3 px-4 font-semibold">Bookings</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-xs">
                    {doctors.map((doc) => {
                      const isVerified = verifiedDocs[doc.id] ?? true;
                      return (
                        <tr key={doc.id} className="hover:bg-slate-900/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={doc.user.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-700" alt={doc.user.name} />
                              <div>
                                <p className="font-bold text-white leading-tight">{doc.user.name}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{doc.user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-semibold">{doc.specialty}</td>
                          <td className="py-3 px-4 text-slate-400">{doc.experience} Years</td>
                          <td className="py-3 px-4 text-white font-bold">${doc.price}</td>
                          <td className="py-3 px-4 text-slate-400">{doc.appointments?.length || 0}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleVerification(doc.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                                isVerified
                                  ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400 hover:bg-rose-950/20 hover:border-rose-900/30 hover:text-rose-400'
                                  : 'bg-amber-950/20 border-amber-900/30 text-amber-400 hover:bg-emerald-950/20 hover:border-emerald-900/30 hover:text-emerald-400'
                              }`}
                            >
                              {isVerified ? 'Verified Active' : 'Pending Review'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Log Tab */}
          {activeTab === 'audit' && (
            <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Transaction Audit Log</h3>
              </div>
              <div className="space-y-0 max-h-[500px] overflow-y-auto divide-y divide-slate-800/40">
                {appointments.map((app, index) => {
                  const isCompleted = app.status === 'COMPLETED';
                  return (
                    <div key={app.id || index} className="p-4 flex items-center gap-4 hover:bg-slate-900/20 transition text-xs">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <div className="flex-1 text-left">
                        <p className="text-slate-300 leading-relaxed">
                          <strong className="text-white">{app.patient.user.name}</strong> → {app.type} visit → <strong className="text-white">{app.doctor.user.name}</strong>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-teal-400 font-bold">${app.amount}</p>
                        <p className="text-slate-600 font-mono">{new Date(app.dateTime).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex-shrink-0 ${
                        isCompleted ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' : 'bg-amber-950/20 border-amber-900/30 text-amber-400'
                      }`}>{app.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
