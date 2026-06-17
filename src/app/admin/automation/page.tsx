'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  Zap, CheckCircle2, ArrowRight, Play, ToggleLeft, ToggleRight,
  Bell, FileText, Calendar, MessageSquare, Star, Activity, ChevronRight, ShieldAlert
} from 'lucide-react';

const workflows = [
  {
    id: 'consultation_complete',
    trigger: 'Consultation Completed',
    triggerIcon: <Activity className="w-4 h-4" />,
    triggerColor: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    steps: [
      { id: 'summary', label: 'Generate AI Visit Summary', icon: <FileText className="w-3.5 h-3.5" />, color: 'bg-teal-950/30 border-teal-900/30 text-teal-400', delay: 600 },
      { id: 'notify_patient', label: 'Notify Patient via Portal', icon: <Bell className="w-3.5 h-3.5" />, color: 'bg-brand-950/30 border-brand-900/30 text-brand-400', delay: 1200 },
      { id: 'prescriptions', label: 'Send Prescription PDF', icon: <FileText className="w-3.5 h-3.5" />, color: 'bg-purple-950/30 border-purple-900/30 text-purple-400', delay: 1800 },
      { id: 'followup', label: 'Schedule Follow-up Reminder', icon: <Calendar className="w-3.5 h-3.5" />, color: 'bg-amber-950/30 border-amber-900/30 text-amber-400', delay: 2400 },
      { id: 'feedback', label: 'Request Patient Feedback', icon: <Star className="w-3.5 h-3.5" />, color: 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400', delay: 3000 },
    ],
    stats: { triggered: 47, successRate: 94, avgTime: '2.3s' }
  },
  {
    id: 'vitals_alert',
    trigger: 'Abnormal Vitals Detected',
    triggerIcon: <Activity className="w-4 h-4" />,
    triggerColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    steps: [
      { id: 'alert_doctor', label: 'Alert Assigned Doctor', icon: <Bell className="w-3.5 h-3.5" />, color: 'bg-rose-950/30 border-rose-900/30 text-rose-400', delay: 500 },
      { id: 'message', label: 'Send Patient Safety Message', icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'bg-brand-950/30 border-brand-900/30 text-brand-400', delay: 1000 },
      { id: 'log_rpm', label: 'Log RPM Event for Review', icon: <FileText className="w-3.5 h-3.5" />, color: 'bg-amber-950/30 border-amber-900/30 text-amber-400', delay: 1500 },
    ],
    stats: { triggered: 12, successRate: 100, avgTime: '0.8s' }
  },
  {
    id: 'appointment_booked',
    trigger: 'Appointment Booked',
    triggerIcon: <Calendar className="w-4 h-4" />,
    triggerColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    steps: [
      { id: 'confirm_email', label: 'Send Confirmation Email', icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400', delay: 400 },
      { id: 'notify_doctor', label: 'Notify Doctor of Booking', icon: <Bell className="w-3.5 h-3.5" />, color: 'bg-brand-950/30 border-brand-900/30 text-brand-400', delay: 800 },
      { id: 'ai_intake', label: 'Trigger AI Intake Form', icon: <Activity className="w-3.5 h-3.5" />, color: 'bg-teal-950/30 border-teal-900/30 text-teal-400', delay: 1200 },
      { id: 'reminder_24h', label: 'Schedule 24h Reminder', icon: <Calendar className="w-3.5 h-3.5" />, color: 'bg-amber-950/30 border-amber-900/30 text-amber-400', delay: 1600 },
    ],
    stats: { triggered: 89, successRate: 98, avgTime: '1.1s' }
  }
];

export default function AutomationPage() {
  const { user, loading: authLoading } = useAuth();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    consultation_complete: true,
    vitals_alert: true,
    appointment_booked: true
  });
  const [simulating, setSimulating] = useState<string | null>(null);
  const [activeSteps, setActiveSteps] = useState<Record<string, number>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<string>>>({});

  const runSimulation = async (workflowId: string) => {
    const wf = workflows.find(w => w.id === workflowId);
    if (!wf) return;
    setSimulating(workflowId);
    setActiveSteps(prev => ({ ...prev, [workflowId]: -1 }));
    setCompletedSteps(prev => ({ ...prev, [workflowId]: new Set() }));

    for (let i = 0; i < wf.steps.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setActiveSteps(prev => ({ ...prev, [workflowId]: i }));
      await new Promise(r => setTimeout(r, 600));
      setCompletedSteps(prev => {
        const newSet = new Set(prev[workflowId] || []);
        newSet.add(wf.steps[i].id);
        return { ...prev, [workflowId]: newSet };
      });
    }
    await new Promise(r => setTimeout(r, 500));
    setSimulating(null);
    setActiveSteps(prev => ({ ...prev, [workflowId]: -1 }));
  };

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950"><Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 font-sans"><Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Admin Access Only</h2>
          </div>
        </div><Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />

      <main className="flex-1 py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-900">
            <div className="text-left">
              <Link href="/admin/dashboard" className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 mb-2">
                ← Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Zap className="w-8 h-8 text-amber-400" />
                Healthcare Automation Engine
              </h1>
              <p className="text-slate-400 mt-1 text-sm">Automated clinical workflows that run 24/7 without manual intervention.</p>
            </div>
            <div className="glass px-4 py-2.5 rounded-2xl border border-emerald-900/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">Engine Running</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {[
              { label: 'Workflows Active', value: Object.values(toggles).filter(Boolean).length, unit: `/ ${workflows.length}`, color: 'text-emerald-400' },
              { label: 'Total Triggered', value: '148', unit: 'this month', color: 'text-brand-400' },
              { label: 'Avg. Success Rate', value: '97%', unit: 'across all workflows', color: 'text-teal-400' },
              { label: 'Time Saved', value: '~23h', unit: 'staff hours/month', color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="glass p-5 rounded-3xl border border-slate-800 text-left">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{stat.label}</p>
                <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-600 mt-1">{stat.unit}</p>
              </div>
            ))}
          </div>

          {/* Workflow Cards */}
          <div className="space-y-6">
            {workflows.map(wf => {
              const isOn = toggles[wf.id];
              const isSimRunning = simulating === wf.id;
              const activeStep = activeSteps[wf.id] ?? -1;
              const done = completedSteps[wf.id] || new Set();

              return (
                <div key={wf.id} className={`glass rounded-3xl border transition ${isOn ? 'border-slate-800' : 'border-slate-800/40 opacity-60'}`}>
                  {/* Workflow Header */}
                  <div className="p-6 border-b border-slate-800/60 flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${wf.triggerColor}`}>
                      {wf.triggerIcon}
                      <div className="text-left">
                        <p className="text-[9px] uppercase tracking-wider font-bold opacity-60">Trigger</p>
                        <p className="text-sm font-bold">{wf.trigger}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-600 hidden md:block" />

                    <div className="flex-1 text-left hidden md:block">
                      <p className="text-xs text-slate-500">{wf.steps.length} automation steps execute automatically</p>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      <div className="text-right text-xs space-y-0.5">
                        <p className="text-slate-400"><span className="font-bold text-white">{wf.stats.triggered}</span> triggers</p>
                        <p className="text-emerald-400 font-semibold">{wf.stats.successRate}% success</p>
                      </div>

                      {!isSimRunning ? (
                        <button
                          onClick={() => isOn && runSimulation(wf.id)}
                          disabled={!isOn || simulating !== null}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                        >
                          <Play className="w-3 h-3" />
                          Simulate
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-brand-950/20 border border-brand-900/30 text-brand-400 text-xs font-semibold rounded-xl">
                          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" />
                          Running...
                        </div>
                      )}

                      <button
                        onClick={() => setToggles(prev => ({ ...prev, [wf.id]: !prev[wf.id] }))}
                        className="transition"
                        title={isOn ? 'Disable workflow' : 'Enable workflow'}
                      >
                        {isOn
                          ? <ToggleRight className="w-8 h-8 text-emerald-400" />
                          : <ToggleLeft className="w-8 h-8 text-slate-600" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-3">
                      {wf.steps.map((step, idx) => {
                        const isActive = activeStep === idx && isSimRunning;
                        const isDone = done.has(step.id);
                        return (
                          <React.Fragment key={step.id}>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                              isDone
                                ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                                : isActive
                                ? `${step.color} animate-pulse`
                                : 'bg-slate-900/40 border-slate-800 text-slate-500'
                            }`}>
                              {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.icon}
                              {step.label}
                            </div>
                            {idx < wf.steps.length - 1 && (
                              <ArrowRight className={`w-4 h-4 flex-shrink-0 self-center ${isDone ? 'text-emerald-400' : 'text-slate-700'} transition-colors duration-300`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
