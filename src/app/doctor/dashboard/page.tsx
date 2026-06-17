'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getDoctorAppointments, getPatientAiReport } from '@/lib/doctor-actions';
import { 
  ShieldAlert, Video, Calendar, Clock, DollarSign, 
  Users, ClipboardList, Stethoscope, Search, X, 
  Download, ArrowRight, Activity, Sparkles, BrainCircuit, Heart, AlertCircle, FileText, MessageSquare, Target, Zap
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected patient for EMR drawer
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [loadingAiReport, setLoadingAiReport] = useState(false);
  const [carePlan, setCarePlan] = useState<any | null>(null);
  const [generatingCarePlan, setGeneratingCarePlan] = useState(false);

  useEffect(() => {
    async function loadDoctorData() {
      if (user && user.role === 'DOCTOR') {
        setLoading(true);
        const res = await getDoctorAppointments(user.id);
        if (res.success && res.appointments) {
          setAppointments(res.appointments);
        }
        setLoading(false);
      }
    }
    if (!authLoading) {
      loadDoctorData();
    }
  }, [user, authLoading]);

  const handleOpenPatientDrawer = async (patient: any) => {
    setSelectedPatient(patient);
    setAiReport(null);
    setCarePlan(null);
    setLoadingAiReport(true);
    const res = await getPatientAiReport(patient.id);
    if (res.success && res.report) {
      try { setAiReport(JSON.parse(res.report.content)); } catch (e) { setAiReport(null); }
    }
    setLoadingAiReport(false);
  };

  const generateCarePlan = async () => {
    if (!selectedPatient) return;
    setGeneratingCarePlan(true);
    // Simulate AI generation delay
    await new Promise(r => setTimeout(r, 1800));
    const diagnosis = selectedPatient.records?.[0]?.diagnosis || 'General Health Maintenance';
    const medications = selectedPatient.appointments
      ?.flatMap((a: any) => a.consultation?.prescriptions || [])
      .map((p: any) => `${p.medicineName} ${p.dosage} ${p.duration}`) || [];
    const latestVital = selectedPatient.vitalLogs?.[0];
    setCarePlan({
      condition: diagnosis,
      generatedAt: new Date().toLocaleDateString(),
      medications: medications.length > 0 ? medications : ['Metoprolol Succinate ER 25mg — Once daily (60 days)'],
      lifestyle: [
        'Reduce sodium intake to < 2,300mg per day',
        'Engage in 30 minutes of moderate walking, 5 days/week',
        'Monitor blood pressure daily in the morning',
        'Avoid caffeine and smoking',
        'Maintain sleep schedule of 7–8 hours/night'
      ],
      targets: [
        { label: 'Blood Pressure', target: '< 130/85 mmHg', current: latestVital ? `${latestVital.systolic}/${latestVital.diastolic} mmHg` : 'Not logged' },
        { label: 'Heart Rate', target: '60–80 bpm', current: latestVital ? `${latestVital.heartRate} bpm` : 'Not logged' },
        { label: 'Fasting Glucose', target: '< 100 mg/dL', current: latestVital ? `${latestVital.glucose} mg/dL` : 'Not logged' },
      ],
      nextReview: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }); })()
    });
    setGeneratingCarePlan(false);
  };

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

  if (!user || user.role !== 'DOCTOR') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Doctor Portal Access Only</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              You must be logged in as a Doctor to view this dashboard.
            </p>
            <p className="text-slate-400 text-xs font-semibold">
              Please use the floating Demo Control Panel in the bottom right corner and select &quot;Dr. Sarah Khan&quot; or &quot;Dr. Ahmed Ali&quot;.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter today's appointments
  const today = new Date().toDateString();
  const todayAppointments = appointments.filter(app => {
    return new Date(app.dateTime).toDateString() === today;
  });

  // Unique patient profiles for Patient Management tab
  const uniquePatientsMap = new Map();
  appointments.forEach(app => {
    if (app.patient) {
      uniquePatientsMap.set(app.patient.id, app.patient);
    }
  });
  const patientsList = Array.from(uniquePatientsMap.values());

  const filteredPatients = patientsList.filter(p => 
    p.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const todayConsultationsCount = todayAppointments.length;
  const totalEarnings = appointments.reduce((sum, app) => sum + (app.paymentStatus === 'PAID' ? app.amount : 0), 0);
  const pendingRecordsCount = appointments.filter(app => app.status === 'CONFIRMED').length;

  const calculateAge = (dobString: string) => {
    const todayDate = new Date();
    const birthDate = new Date(dobString);
    let age = todayDate.getFullYear() - birthDate.getFullYear();
    const m = todayDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-950 py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900">
            <div className="text-left">
              <h1 className="text-3xl font-black text-white tracking-tight">Doctor Control Dashboard</h1>
              <p className="text-slate-400 mt-2 text-sm">Welcome back, {user.name}. Manage schedule, write prescriptions, and view EMR files.</p>
            </div>
            <div className="text-xs text-slate-500 font-bold bg-slate-900 border border-slate-850 px-3 py-2 rounded-xl">
              Clinic Status: <span className="text-emerald-400">Online Visits Active</span>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl border border-slate-800 flex gap-4 items-center">
              <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Today Appointments</p>
                <p className="text-2xl font-black text-white mt-1">{todayConsultationsCount}</p>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-slate-800 flex gap-4 items-center">
              <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-400">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Pending Consultations</p>
                <p className="text-2xl font-black text-white mt-1">{pendingRecordsCount}</p>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-slate-800 flex gap-4 items-center">
              <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Consultation Earnings</p>
                <p className="text-2xl font-black text-white mt-1">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Schedule & Patients Tabs split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side: Today schedule */}
            <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-850">
                <Clock className="w-5 h-5 text-brand-400" />
                Today Schedule
              </h3>

              {todayAppointments.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  No appointments scheduled for today.
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((app) => {
                    const appDate = new Date(app.dateTime);
                    return (
                      <div 
                        key={app.id} 
                        className="p-4 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
                      >
                        <div className="flex gap-4">
                          <img 
                            src={app.patient.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} 
                            alt={app.patient.user.name} 
                            className="w-11 h-11 rounded-xl object-cover" 
                          />
                          <div className="text-left">
                            <h4 className="text-sm font-bold text-white">{app.patient.user.name}</h4>
                            <p className="text-xs text-slate-400">
                              {app.type} Consultation • Slot: {appDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenPatientDrawer(app.patient)}
                            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold rounded-lg text-slate-300 transition"
                          >
                            View EMR
                          </button>
                          <a
                            href={`/video-consultation/${app.id}`}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition shadow-md shadow-emerald-500/10 flex items-center gap-1 leading-none animate-pulse"
                          >
                            <Video className="w-3.5 h-3.5 fill-slate-950" />
                            Start Call
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right side: Patient Management explorer */}
            <div className="lg:col-span-1 glass p-6 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-850">
                <Users className="w-5 h-5 text-brand-400" />
                Patient Directory
              </h3>

              {/* Search Patients */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search clinic patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 transition placeholder-slate-500"
                />
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {filteredPatients.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">No patient records found.</p>
                ) : (
                  filteredPatients.map((pat) => (
                    <button
                      key={pat.id}
                      onClick={() => handleOpenPatientDrawer(pat)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-900/30 hover:bg-slate-900/60 border border-slate-850 rounded-xl transition text-left"
                    >
                      <img 
                        src={pat.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} 
                        alt={pat.user.name} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-700" 
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{pat.user.name}</p>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          {pat.gender} • {calculateAge(pat.dateOfBirth)} Yrs
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Patient EMR Drawer / Slide Panel */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end font-sans">
          <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full overflow-hidden shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
            
            {/* EMR Header */}
            <div className="p-6 bg-gradient-to-r from-brand-950/40 to-slate-900 border-b border-slate-850 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <img 
                  src={selectedPatient.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} 
                  alt={selectedPatient.user.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-750" 
                />
                <div className="text-left">
                  <h2 className="text-lg font-black text-white tracking-tight">{selectedPatient.user.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    EMR Clinical File • {selectedPatient.gender} • DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()} ({calculateAge(selectedPatient.dateOfBirth)} years old)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* EMR Scrollable Details */}
            <div className="flex-1 p-6 overflow-y-auto space-y-8 text-left">
              
              {/* Doctor AI Assistant summary */}
              <div className="p-5 bg-teal-950/20 border border-teal-900/30 rounded-3xl space-y-4">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-teal-400" />
                  Doctor AI Clinical Assistant
                </span>
                
                {loadingAiReport ? (
                  <div className="flex items-center gap-2 py-3">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs text-slate-500">Compiling patient symptoms profile...</span>
                  </div>
                ) : aiReport ? (
                  <div className="space-y-3.5 text-xs text-slate-300">
                    <div className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-2xl space-y-2">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-brand-400" /> Patient Reported Symptoms Summary:
                      </p>
                      <p className="leading-relaxed"><span className="text-slate-500">Main Concern:</span> {aiReport.mainIssue}</p>
                      <p className="leading-relaxed"><span className="text-slate-500">Duration:</span> {aiReport.duration}</p>
                      <p className="leading-relaxed"><span className="text-slate-500">Previous treatments:</span> {aiReport.previousTreatment}</p>
                    </div>

                    <div className="p-3.5 bg-red-950/20 border border-red-900/30 text-red-400 rounded-2xl space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-white">
                        <ShieldAlert className="w-4 h-4 text-red-400" /> Important / Medical Warnings:
                      </p>
                      <p className="leading-relaxed text-xs">{aiReport.importantInfo}</p>
                    </div>

                    <div className="space-y-2 pl-1">
                      <p className="font-bold text-slate-400">Questions Prepared by Patient:</p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                        {aiReport.questions?.map((q: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 text-xs text-slate-400 leading-normal p-2">
                    <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>No intake report recorded. Patient can describe symptoms to the AI Assistant prior to starting the call.</span>
                  </div>
                )}
              </div>

              {/* RPM Vitals Trend Monitor */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-brand-400" />
                  Remote Patient Monitoring (RPM) Vitals
                </h3>
                
                {selectedPatient.vitalLogs && selectedPatient.vitalLogs.length > 0 ? (
                  <div className="space-y-4">
                    {/* Vitals Trend Chart Mock (BP Trend) */}
                    <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Blood Pressure Trend (Last 5 Logs)</span>
                      <div className="space-y-2 pt-1">
                        {selectedPatient.vitalLogs.slice(0, 5).reverse().map((log: any, idx: number) => {
                          const dateObj = new Date(log.recordedAt);
                          return (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                              <span className="w-16 text-slate-500 font-mono text-[10px]">
                                {dateObj.getMonth() + 1}/{dateObj.getDate()}
                              </span>
                              <div className="flex-1 bg-slate-950 h-5 rounded-md overflow-hidden relative border border-slate-850 flex items-center px-2">
                                <div 
                                  className="bg-brand-500 h-full absolute left-0 top-0 transition-all duration-500 opacity-20"
                                  style={{ width: `${(log.systolic / 180) * 100}%` }}
                                />
                                <div 
                                  className="bg-brand-400 h-full absolute left-0 top-0 transition-all duration-500 rounded-r"
                                  style={{ width: `${(log.diastolic / 180) * 100}%` }}
                                />
                                <span className="relative z-10 text-[10px] font-bold text-white font-mono">
                                  {log.systolic}/{log.diastolic} mmHg
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Vitals Log List */}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedPatient.vitalLogs.slice(0, 2).map((log: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-1.5 text-xs text-left">
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>Vitals Log {idx === 0 ? '(Latest)' : ''}</span>
                            <span className="font-mono">{new Date(log.recordedAt).toLocaleDateString()}</span>
                          </div>
                          <p className="font-black text-white text-sm">{log.systolic}/{log.diastolic} mmHg</p>
                          <p className="text-[10px] text-slate-400">Heart Rate: {log.heartRate} bpm | Glucose: {log.glucose} mg/dL</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No RPM biometrics logs registered for this patient.</p>
                )}
              </div>

              {/* AI Medical Memory Card */}
              {selectedPatient.records && selectedPatient.records.length > 0 && selectedPatient.vitalLogs && selectedPatient.vitalLogs.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-teal-950/20 to-slate-900 border border-brand-500/20 rounded-2xl text-left space-y-2">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-teal-400" />
                    AI Medical Memory Summary
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Patient has history of <strong>{selectedPatient.records[0].diagnosis}</strong>, started medication daily. Based on the 5-day biometric vitals trends, systolic blood pressure dropped from <strong>{selectedPatient.vitalLogs[selectedPatient.vitalLogs.length-1].systolic}</strong> mmHg to <strong>{selectedPatient.vitalLogs[0].systolic}</strong> mmHg, showing a stabilizes rate of <strong>88%</strong>. Treatment is highly effective.
                  </p>
                </div>
              )}

              {/* AI Care Plan Generator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    AI Care Plan Generator
                  </h3>
                  {!carePlan && (
                    <button
                      onClick={generateCarePlan}
                      disabled={generatingCarePlan}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/30 hover:bg-purple-950/50 border border-purple-900/30 text-purple-400 text-[10px] font-bold rounded-xl transition disabled:opacity-50"
                    >
                      {generatingCarePlan ? (
                        <><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        Generating...</>
                      ) : (
                        <><Zap className="w-3.5 h-3.5" /> Generate Care Plan</>
                      )}
                    </button>
                  )}
                  {carePlan && (
                    <button onClick={() => setCarePlan(null)} className="text-[10px] text-slate-500 hover:text-white transition px-2 py-1 rounded-lg hover:bg-slate-800">
                      Regenerate
                    </button>
                  )}
                </div>

                {!carePlan && !generatingCarePlan && (
                  <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl text-xs text-slate-500 text-center italic">
                    Click "Generate Care Plan" to create a structured AI treatment plan for this patient.
                  </div>
                )}

                {carePlan && (
                  <div className="p-5 bg-purple-950/10 border border-purple-900/20 rounded-2xl space-y-4 text-xs text-left animate-in fade-in duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">AI Generated Care Plan</p>
                        <p className="text-sm font-black text-white mt-0.5">{carePlan.condition} Management</p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">Generated {carePlan.generatedAt}</span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-slate-400 text-[10px] uppercase">Medication Schedule</p>
                      {carePlan.medications.map((med: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                          <span className="text-slate-300">{med}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-slate-400 text-[10px] uppercase">Monitoring Targets</p>
                      {carePlan.targets.map((t: any, i: number) => (
                        <div key={i} className="flex justify-between py-1.5 border-b border-slate-800/40">
                          <span className="text-slate-400">{t.label}</span>
                          <div className="text-right">
                            <span className="text-white font-bold">{t.target}</span>
                            <span className="text-slate-600 ml-2">(now: {t.current})</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-slate-400 text-[10px] uppercase">Lifestyle Recommendations</p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400">
                        {carePlan.lifestyle.map((l: string, i: number) => (
                          <li key={i} className="leading-relaxed">{l}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-500">Next Review: <strong className="text-white">{carePlan.nextReview}</strong></span>
                      <Link
                        href="/messages"
                        className="flex items-center gap-1 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 text-brand-400 text-[10px] font-bold rounded-xl transition"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Send to Patient
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* General Medical History */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-4.5 h-4.5 text-slate-500" />
                  Medical History Summary
                </h3>
                <p className="text-xs text-slate-400 bg-slate-900 border border-slate-850 p-4 rounded-2xl leading-relaxed">
                  {selectedPatient.medicalHistory || 'No medical history reported.'}
                </p>
              </div>

              {/* Lab Scans & Documents */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-slate-500" />
                  Lab Reports & Scans
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedPatient.documents?.length === 0 ? (
                    <p className="text-xs text-slate-500">No scans uploaded.</p>
                  ) : (
                    selectedPatient.documents?.map((doc: any, i: number) => (
                      <div key={i} className="p-3 bg-slate-900/50 border border-slate-850 rounded-xl flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-300 truncate max-w-[300px]">{doc.name}</span>
                        <button 
                          onClick={() => alert(`Downloading: ${doc.name}`)}
                          className="p-1.5 bg-slate-950 text-slate-400 hover:text-white rounded-lg border border-slate-850"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Previous Consultations */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-4.5 h-4.5 text-slate-500" />
                  Consultation Logs History
                </h3>
                <div className="space-y-3">
                  {selectedPatient.records?.length === 0 ? (
                    <p className="text-xs text-slate-500">No prior consultation records.</p>
                  ) : (
                    selectedPatient.records?.map((record: any) => (
                      <div key={record.id} className="p-4 bg-slate-900/20 border border-slate-850 rounded-2xl space-y-2 text-xs leading-relaxed">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-850/60">
                          <span className="font-bold text-white">{record.diagnosis}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-400"><span className="font-semibold text-slate-300">Treatment:</span> {record.treatment}</p>
                        {record.notes && <p className="text-slate-400 italic"><span className="font-semibold text-slate-300 not-italic">Notes:</span> &quot;{record.notes}&quot;</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Close button in footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-900 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-xs font-bold rounded-xl text-white border border-slate-800 transition"
              >
                Close EMR File
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
