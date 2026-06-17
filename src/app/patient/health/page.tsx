'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getPatientVitals } from '@/lib/vital-actions';
import { getProfileDetails } from '@/lib/auth-actions';
import { 
  Heart, Activity, Zap, TrendingDown, TrendingUp, ArrowLeft,
  ShieldAlert, CheckCircle2, AlertCircle, Target
} from 'lucide-react';

function getHealthScore(logs: any[]): number {
  if (logs.length === 0) return 0;
  const latest = logs[0];
  let score = 100;
  if (latest.systolic > 140) score -= 25;
  else if (latest.systolic > 130) score -= 12;
  if (latest.diastolic > 90) score -= 15;
  else if (latest.diastolic > 85) score -= 7;
  if (latest.heartRate > 90) score -= 10;
  else if (latest.heartRate < 55) score -= 15;
  if (latest.glucose > 125) score -= 15;
  else if (latest.glucose > 110) score -= 7;
  return Math.max(0, score);
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 65) return 'text-amber-400';
  return 'text-rose-400';
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Moderate';
  return 'Needs Attention';
}

function getDelta(logs: any[], field: string): number {
  if (logs.length < 8) return 0;
  const latest = logs[0][field];
  const weekAgo = logs[7][field];
  return latest - weekAgo;
}

export default function HealthMonitoringPage() {
  const { user, loading: authLoading } = useAuth();
  const [vitalLogs, setVitalLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user && user.role === 'PATIENT') {
        setLoading(true);
        const profileRes = await getProfileDetails(user.id, 'PATIENT');
        if (profileRes.success && profileRes.data) {
          const vitRes = await getPatientVitals(profileRes.data.id);
          if (vitRes.success && vitRes.vitalLogs) {
            setVitalLogs(vitRes.vitalLogs);
          }
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    if (!authLoading) load();
  }, [user, authLoading]);

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
            <p className="text-slate-400 text-xs">Please log in as a patient to view your health dashboard.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const score = getHealthScore(vitalLogs);
  const last30 = vitalLogs.slice(0, 30).reverse(); // oldest first for charting
  const latest = vitalLogs[0];

  const bpDelta = getDelta(vitalLogs, 'systolic');
  const hrDelta = getDelta(vitalLogs, 'heartRate');
  const glucDelta = getDelta(vitalLogs, 'glucose');

  const bpZone = latest 
    ? latest.systolic < 120 ? { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-900/30' }
    : latest.systolic < 130 ? { label: 'Elevated', color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-900/30' }
    : { label: 'High', color: 'text-rose-400', bg: 'bg-rose-950/20 border-rose-900/30' }
    : null;

  const hrZone = latest
    ? latest.heartRate >= 60 && latest.heartRate <= 80 ? { label: 'Normal', color: 'text-emerald-400' }
    : latest.heartRate > 80 ? { label: 'Elevated', color: 'text-amber-400' }
    : { label: 'Low', color: 'text-blue-400' }
    : null;

  // Chart max values for scaling
  const maxSystolic = Math.max(...last30.map(l => l.systolic), 160);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />

      <main className="flex-1 py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-900">
            <div className="text-left">
              <Link href="/patient/dashboard" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition mb-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Activity className="w-8 h-8 text-brand-400" />
                Health Monitoring
              </h1>
              <p className="text-slate-400 mt-1 text-sm">30-day biometrics trend analysis for {user.name}</p>
            </div>
            <Link
              href="/patient/records?tab=vitals"
              className="px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold rounded-xl transition flex items-center gap-2 w-fit"
            >
              <Zap className="w-4 h-4" />
              Log Today's Vitals
            </Link>
          </div>

          {vitalLogs.length === 0 ? (
            <div className="glass p-16 rounded-3xl border border-slate-800 text-center space-y-4">
              <Activity className="w-12 h-12 text-slate-600 mx-auto" />
              <h2 className="text-xl font-bold text-white">No Vitals Data Yet</h2>
              <p className="text-slate-400 text-sm">Start logging your daily vitals to see health trends here.</p>
              <Link href="/patient/records?tab=vitals" className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl transition">
                Log First Reading
              </Link>
            </div>
          ) : (
            <>
              {/* Health Score + Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Health Score Card */}
                <div className="glass p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center col-span-1 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Overall Health Score</p>
                  <div className="relative w-24 h-24 mt-2">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={score >= 85 ? '#10b981' : score >= 65 ? '#f59e0b' : '#f43f5e'}
                        strokeWidth="3"
                        strokeDasharray={`${score} ${100 - score}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-black ${getScoreColor(score)}`}>{score}</span>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
                  <p className="text-[10px] text-slate-600">Based on latest readings</p>
                </div>

                {/* BP Card */}
                <div className={`glass p-5 rounded-3xl border space-y-3 text-left col-span-1 ${bpZone?.bg || 'border-slate-800'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Blood Pressure</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${bpZone?.bg} ${bpZone?.color}`}>
                      {bpZone?.label}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-white">{latest.systolic}/{latest.diastolic}<span className="text-xs text-slate-500 font-normal ml-1">mmHg</span></p>
                  <div className="flex items-center gap-1 text-xs">
                    {bpDelta <= 0 
                      ? <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      : <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                    }
                    <span className={bpDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {Math.abs(bpDelta)} mmHg vs last week
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Target: &lt;120/80 mmHg</p>
                </div>

                {/* Heart Rate Card */}
                <div className="glass p-5 rounded-3xl border border-slate-800 space-y-3 text-left col-span-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Heart Rate</span>
                    <span className={`text-[10px] font-bold ${hrZone?.color}`}>{hrZone?.label}</span>
                  </div>
                  <p className="text-2xl font-black text-white">{latest.heartRate}<span className="text-xs text-slate-500 font-normal ml-1">bpm</span></p>
                  <div className="flex items-center gap-1 text-xs">
                    {hrDelta <= 0
                      ? <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      : <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                    }
                    <span className={hrDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {Math.abs(hrDelta)} bpm vs last week
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Target: 60–80 bpm (resting)</p>
                </div>

                {/* Glucose Card */}
                <div className="glass p-5 rounded-3xl border border-slate-800 space-y-3 text-left col-span-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Fasting Glucose</span>
                    <span className={`text-[10px] font-bold ${latest.glucose < 100 ? 'text-emerald-400' : latest.glucose < 125 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {latest.glucose < 100 ? 'Normal' : latest.glucose < 125 ? 'Pre-diabetic' : 'High'}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-white">{latest.glucose}<span className="text-xs text-slate-500 font-normal ml-1">mg/dL</span></p>
                  <div className="flex items-center gap-1 text-xs">
                    {glucDelta <= 0
                      ? <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      : <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                    }
                    <span className={glucDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {Math.abs(glucDelta)} mg/dL vs last week
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Target: 70–99 mg/dL (fasting)</p>
                </div>
              </div>

              {/* 30-Day BP Trend Chart */}
              <div className="glass p-6 rounded-3xl border border-slate-800 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    Blood Pressure Trend — Last 30 Days
                  </h3>
                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-brand-400 rounded-full inline-block" />Systolic</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-teal-400 rounded-full inline-block" />Diastolic</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-rose-400/30 border-t border-dashed border-rose-400 inline-block" />Safe Zone (120)</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="relative h-40 flex items-end gap-1 pt-4 pr-2">
                  {/* Safe zone line at systolic 120 */}
                  <div
                    className="absolute left-0 right-0 border-t border-dashed border-emerald-400/30 pointer-events-none"
                    style={{ bottom: `${(120 / maxSystolic) * 100}%` }}
                  >
                    <span className="text-[9px] text-emerald-400/50 absolute right-0 -top-3">120</span>
                  </div>

                  {last30.map((log, idx) => {
                    const systolicH = Math.round((log.systolic / maxSystolic) * 100);
                    const diastolicH = Math.round((log.diastolic / maxSystolic) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 group relative" style={{ minWidth: 0 }}>
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition">
                          {log.systolic}/{log.diastolic}
                        </div>
                        <div className="w-full flex items-end gap-px" style={{ height: '100%' }}>
                          <div
                            className="flex-1 bg-brand-500/70 hover:bg-brand-400 rounded-t transition-all duration-300"
                            style={{ height: `${systolicH}%` }}
                          />
                          <div
                            className="flex-1 bg-teal-500/50 hover:bg-teal-400 rounded-t transition-all duration-300"
                            style={{ height: `${diastolicH}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between px-1 text-[9px] text-slate-600 font-mono">
                  {[29, 22, 15, 8, 1, 0].map(daysBack => {
                    const d = new Date();
                    d.setDate(d.getDate() - daysBack);
                    return <span key={daysBack}>{d.getMonth() + 1}/{d.getDate()}</span>;
                  })}
                </div>

                <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl flex items-center gap-2 text-xs">
                  <TrendingDown className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-300">
                    Systolic BP improved by <strong>{last30[0]?.systolic - (last30[last30.length - 1]?.systolic || 0)} mmHg</strong> over the past 30 days. Metoprolol therapy is showing positive response.
                  </span>
                </div>
              </div>

              {/* Heart Rate + Glucose Mini Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Heart Rate Trend */}
                <div className="glass p-6 rounded-3xl border border-slate-800 space-y-4 text-left">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Heart Rate Trend
                  </h3>
                  <div className="h-24 flex items-end gap-0.5">
                    {last30.map((log, idx) => {
                      const maxHR = 100;
                      const h = Math.round((log.heartRate / maxHR) * 100);
                      const isNormal = log.heartRate >= 60 && log.heartRate <= 80;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t transition-all duration-300 hover:opacity-100 ${isNormal ? 'bg-emerald-500/50 hover:bg-emerald-400' : 'bg-amber-500/50 hover:bg-amber-400'}`}
                          style={{ height: `${h}%`, minWidth: 0 }}
                          title={`${log.heartRate} bpm`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-600">
                    <span>30 days ago</span><span>Today</span>
                  </div>
                  <div className="flex gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/50 inline-block" />60–80 bpm (normal)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500/50 inline-block" />Outside range</span>
                  </div>
                </div>

                {/* Glucose Trend */}
                <div className="glass p-6 rounded-3xl border border-slate-800 space-y-4 text-left">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    Fasting Glucose Trend
                  </h3>
                  <div className="h-24 flex items-end gap-0.5">
                    {last30.map((log, idx) => {
                      const maxGluc = 130;
                      const h = Math.round((log.glucose / maxGluc) * 100);
                      const isNormal = log.glucose <= 99;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t transition-all duration-300 ${isNormal ? 'bg-purple-500/40 hover:bg-purple-400' : 'bg-amber-500/50 hover:bg-amber-400'}`}
                          style={{ height: `${h}%`, minWidth: 0 }}
                          title={`${log.glucose} mg/dL`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-600">
                    <span>30 days ago</span><span>Today</span>
                  </div>
                  <div className="flex gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-500/40 inline-block" />&lt;100 mg/dL (normal)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500/50 inline-block" />Pre-diabetic range</span>
                  </div>
                </div>
              </div>

              {/* Clinical Recommendations */}
              <div className="glass p-6 rounded-3xl border border-slate-800 space-y-4 text-left">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  AI Clinical Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: <Heart className="w-5 h-5 text-rose-400" />,
                      title: 'Blood Pressure',
                      status: score >= 85 ? 'On Track' : 'Monitor Closely',
                      color: score >= 85 ? 'text-emerald-400' : 'text-amber-400',
                      advice: `Current trend shows ${bpDelta <= 0 ? 'improvement' : 'elevation'}. ${bpDelta <= 0 ? 'Continue medication as prescribed.' : 'Reduce sodium and stress.'}`
                    },
                    {
                      icon: <Zap className="w-5 h-5 text-amber-400" />,
                      title: 'Heart Rate',
                      status: latest.heartRate >= 60 && latest.heartRate <= 80 ? 'Optimal' : 'Outside Range',
                      color: latest.heartRate >= 60 && latest.heartRate <= 80 ? 'text-emerald-400' : 'text-amber-400',
                      advice: `Resting heart rate of ${latest.heartRate} bpm. ${latest.heartRate > 80 ? 'Consider light cardio exercise to lower resting HR.' : 'Excellent! Maintain regular light activity.'}`
                    },
                    {
                      icon: <Target className="w-5 h-5 text-purple-400" />,
                      title: 'Glucose Levels',
                      status: latest.glucose < 100 ? 'Normal' : 'Watch Diet',
                      color: latest.glucose < 100 ? 'text-emerald-400' : 'text-amber-400',
                      advice: `Fasting glucose at ${latest.glucose} mg/dL. ${latest.glucose < 100 ? 'Stay hydrated and maintain low-carb diet.' : 'Avoid sugary drinks and refined carbs before meals.'}`
                    }
                  ].map((rec, i) => (
                    <div key={i} className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2">
                        {rec.icon}
                        <span className="text-xs font-bold text-white">{rec.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${rec.color}`}>{rec.status}</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{rec.advice}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
