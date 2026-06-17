'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getPatientAppointments } from '@/lib/appointment-actions';
import { getProfileDetails } from '@/lib/auth-actions';
import { getPatientVitals, addVitalLog } from '@/lib/vital-actions';
import { 
  Calendar, ShieldAlert, FileText, ClipboardList, 
  ArrowLeft, Download, Share2, Upload, 
  CheckCircle2, Clock, Check, Plus, AlertCircle,
  Activity, Sparkles, BrainCircuit, Heart, X, BookOpen, CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function PatientRecords() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Tabs: 'timeline' | 'consultations' | 'prescriptions' | 'documents' | 'vitals'
  const [activeTab, setActiveTab] = useState('timeline');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // Vitals State
  const [vitalLogs, setVitalLogs] = useState<any[]>([]);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [glucose, setGlucose] = useState('');
  const [isLoggingVitals, setIsLoggingVitals] = useState(false);

  // AI Prescription Explainer State
  const [selectedRx, setSelectedRx] = useState<any | null>(null);

  // Goals Checkbox States
  const [goals, setGoals] = useState({
    profile: true,
    documents: true,
    vitals: false,
    consultation: false
  });

  useEffect(() => {
    async function loadRecordsData() {
      if (user && user.role === 'PATIENT') {
        setLoading(true);
        const appRes = await getPatientAppointments(user.id);
        if (appRes.success && appRes.appointments) {
          setAppointments(appRes.appointments);
          
          // If they have completed consultations, mark goal done
          const hasCompleted = appRes.appointments.some((a: any) => a.status === 'COMPLETED');
          if (hasCompleted) {
            setGoals(prev => ({ ...prev, consultation: true }));
          }
        }

        const profileRes = await getProfileDetails(user.id, 'PATIENT');
        if (profileRes.success && profileRes.data) {
          setPatientData(profileRes.data);
          setUploadedFiles((profileRes.data as any).documents || []);
          
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
      }
    }
    if (!authLoading) {
      loadRecordsData();
    }
  }, [user, authLoading]);

  const handleUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const file = e.target.files[0];

    setTimeout(() => {
      setUploadedFiles(prev => [
        {
          id: String(Math.random()),
          name: file.name,
          fileType: file.name.split('.').pop() || 'pdf',
          uploadedAt: new Date()
        },
        ...prev
      ]);
      setIsUploading(false);
      setGoals(prev => ({ ...prev, documents: true }));
    }, 1500);
  };

  const handleAddVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!systolic || !diastolic || !heartRate || !glucose) {
      alert('Please fill out all biometric values.');
      return;
    }
    setIsLoggingVitals(true);
    const res = await addVitalLog({
      userId: user?.id || '',
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      heartRate: parseInt(heartRate),
      glucose: parseInt(glucose)
    });
    setIsLoggingVitals(false);

    if (res.success && res.log) {
      setVitalLogs(prev => [res.log, ...prev]);
      setSystolic('');
      setDiastolic('');
      setHeartRate('');
      setGlucose('');
      setGoals(prev => ({ ...prev, vitals: true }));
      alert('Biometrics recorded successfully!');
    } else {
      alert(res.error || 'Failed to record vitals.');
    }
  };

  const handleDownloadMock = (itemName: string) => {
    alert(`Downloading PDF for: ${itemName}. This is a demonstration download.`);
  };

  const handleShareMock = (itemName: string) => {
    alert(`Generating encrypted sharing link for: ${itemName}. Copied to clipboard!`);
  };

  const getRxAIExplanation = (medicine: string) => {
    const medLower = medicine.toLowerCase();
    if (medLower.includes('metoprolol')) {
      return {
        class: 'Beta-Adrenergic Blocker (Antihypertensive)',
        purpose: 'Reduces cardiac workload. Treats high blood pressure and chest tightness.',
        usage: 'Take once daily, preferably at the same time in the morning. Avoid taking on an empty stomach if it causes nausea.',
        warnings: 'Do NOT take if your heart rate is below 55 bpm or if you feel severe dizziness. Check blood pressure daily.',
        safetyLimits: 'Sustained heart rate under 50 bpm or systolic blood pressure below 95 mmHg.'
      };
    } else if (medLower.includes('sumatriptan')) {
      return {
        class: 'Selective 5-HT1 Receptor Agonist (Triptan)',
        purpose: 'Narrows dilated blood vessels around the brain. Treats acute migraine headaches.',
        usage: 'Take 1 tablet at the immediate onset of a migraine. May repeat after 2 hours if migraine persists, but do not exceed 100mg in 24 hours.',
        warnings: 'Do not use for preventative care. Contraindicated if you have history of coronary artery disease or stroke.',
        safetyLimits: 'Do not take more than 2 doses (100mg total) in any 24-hour period.'
      };
    } else if (medLower.includes('hydrocortisone')) {
      return {
        class: 'Topical Corticosteroid (Mild-strength)',
        purpose: 'Reduces swelling, itching, and redness associated with localized skin irritation.',
        usage: 'Apply a thin layer to the affected skin area twice daily. Wash hands before and after applying.',
        warnings: 'For external use only. Avoid contact with eyes. Do not wrap or bandage the treated area unless directed by your physician.',
        safetyLimits: 'Do not apply continuously for more than 7 consecutive days without consulting your dermatologist.'
      };
    }
    return {
      class: 'Prescribed Medication',
      purpose: 'Therapeutic treatment for symptoms identified in clinical consultation.',
      usage: 'Follow instructions detailed by your doctor. Complete the full course of treatment.',
      warnings: 'Consult your pharmacist if you experience severe side effects or allergic reactions.',
      safetyLimits: 'Take only as directed. Do not share prescription medications.'
    };
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

  if (!user || user.role !== 'PATIENT') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Access Denied</h2>
            <p className="text-slate-400 text-xs">You must be logged in as a Patient to view this history portal.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const completedConsults = appointments.filter(app => app.status === 'COMPLETED');
  const activePrescriptions = appointments.flatMap(app => app.consultation?.prescriptions || []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />

      <main className="flex-1 py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumb Header */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-900">
            <div className="text-left">
              <Link 
                href="/patient/dashboard" 
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-black text-white tracking-tight">My Medical Records</h1>
              <p className="text-slate-400 mt-2 text-sm">Track your clinic journey, active medications, and care reports.</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-2">
            {[
              { id: 'timeline', label: 'Healthcare Timeline' },
              { id: 'vitals', label: 'Biometrics & RPM' },
              { id: 'consultations', label: 'Consultations' },
              { id: 'prescriptions', label: 'Prescriptions' },
              { id: 'documents', label: 'Reports & Files' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  activeTab === tab.id
                    ? 'bg-brand-500/10 border-brand-500/30 text-brand-400'
                    : 'bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT: TIMELINE & WALLET CARD & GOALS */}
          {activeTab === 'timeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Timeline (Cols 1 & 2) */}
              <div className="lg:col-span-2 glass p-8 rounded-3xl border border-slate-800 space-y-10">
                <div className="text-left">
                  <h3 className="text-base font-bold text-white">Patient Healthcare Journey</h3>
                  <p className="text-xs text-slate-400 mt-1">A visual layout mapping your diagnostic milestone checkups.</p>
                </div>

                {/* Journey Timeline */}
                <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-12 py-2">
                  {/* Point 1 */}
                  <div className="relative">
                    <span className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                    </span>
                    <div className="text-left space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Step 1 • Initial Visit</span>
                      <h4 className="text-sm font-bold text-white">First Appointment with Cardiology</h4>
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        Consulted Dr. Ahmed Ali regarding blood pressure fluctuations and work related headaches.
                      </p>
                      <span className="inline-block text-[10px] text-emerald-400 font-medium bg-emerald-950/20 px-2.5 py-1 border border-emerald-900/30 rounded-lg mt-2">
                        Completed Oct 15, 2025
                      </span>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="relative">
                    <span className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                    </span>
                    <div className="text-left space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Step 2 • Diagnosis</span>
                      <h4 className="text-sm font-bold text-white">Stage 1 Hypertension Confirmed</h4>
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        Clinical tests recorded sustained systolic levels of 138mmHg. Diagnosed essential hypertension.
                      </p>
                      <span className="inline-block text-[10px] text-emerald-400 font-medium bg-emerald-950/20 px-2.5 py-1 border border-emerald-900/30 rounded-lg mt-2">
                        Confirmed Oct 15, 2025
                      </span>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="relative">
                    <span className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                    </span>
                    <div className="text-left space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Step 3 • Treatment Active</span>
                      <h4 className="text-sm font-bold text-white">Beta Blocker Medication Initiated</h4>
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        Started daily dose of Metoprolol Succinate ER 25mg to manage cardiovascular workload.
                      </p>
                      <span className="inline-block text-[10px] text-brand-400 font-medium bg-brand-950/20 px-2.5 py-1 border border-brand-500/20 rounded-lg mt-2">
                        Active treatment
                      </span>
                    </div>
                  </div>

                  {/* Point 4 */}
                  <div className="relative">
                    <span className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-slate-950 flex items-center justify-center ${
                      goals.consultation ? 'bg-emerald-500' : 'bg-brand-500 animate-pulse'
                    }`}>
                      {goals.consultation && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                    </span>
                    <div className="text-left space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Step 4 • Follow-up checkup</span>
                      <h4 className="text-sm font-bold text-white">Consultation Checkup Evaluation</h4>
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        Scheduled video consult review with Dr. Ahmed Ali to evaluate blood pressure response parameters.
                      </p>
                      <span className={`inline-block text-[10px] font-medium px-2.5 py-1 border rounded-lg mt-2 ${
                        goals.consultation 
                          ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30' 
                          : 'text-amber-400 bg-amber-950/20 border-amber-900/30'
                      }`}>
                        {goals.consultation ? 'Completed' : 'Pending video visit'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Cards (Col 3): Insurance Wallet & Gamified Goals */}
              <div className="space-y-6">
                
                {/* Insurance Card Graphic */}
                <div className="glass p-5 rounded-3xl border border-slate-800 bg-gradient-to-br from-brand-900/60 to-slate-950 overflow-hidden shadow-2xl relative aspect-[1.586/1] flex flex-col justify-between text-left group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:scale-110 transition duration-500" />
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-bold tracking-widest text-brand-300 uppercase">Health Insurance Wallet</span>
                      <p className="text-sm font-black text-white tracking-tight leading-none mt-1">HealthShield Platinum</p>
                    </div>
                    <CreditCard className="w-6 h-6 text-brand-400" />
                  </div>

                  {/* Micro Chip Graphic */}
                  <div className="w-8 h-6 bg-gradient-to-r from-amber-400 to-amber-600 rounded-md border border-amber-300/40 relative overflow-hidden shadow">
                    <div className="absolute inset-x-0.5 top-0.5 h-[1px] bg-slate-950/20" />
                    <div className="absolute inset-x-0.5 bottom-0.5 h-[1px] bg-slate-950/20" />
                  </div>

                  {/* Card Footer Details */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-mono text-slate-300 tracking-wider">MEMBER ID: HS-98721-A</p>
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Sarah Jenkins</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-slate-500 uppercase tracking-wider leading-none">Copay Co-Ins</p>
                      <p className="text-xs font-black text-white mt-1">$20.00</p>
                    </div>
                  </div>
                </div>

                {/* Gamified Health Goals Checklist */}
                <div className="glass p-5 rounded-3xl border border-slate-800 space-y-4 text-left">
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      Gamified Health Goals
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Stay active in your care journey to unlock metrics.</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-850">
                    {[
                      { id: 'profile', label: 'Complete profile setup', checked: goals.profile },
                      { id: 'documents', label: 'Upload clinical documents/reports', checked: goals.documents },
                      { id: 'vitals', label: 'Log RPM biometric indicators', checked: goals.vitals },
                      { id: 'consultation', label: 'Attend follow-up consultation', checked: goals.consultation }
                    ].map(g => (
                      <div key={g.id} className="flex gap-3 items-center text-xs">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition ${
                          g.checked 
                            ? 'bg-emerald-500 border-emerald-600 text-slate-950' 
                            : 'border-slate-800 bg-slate-900/50 text-transparent'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={`leading-none ${g.checked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{g.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB CONTENT: VITALS & RPM LOGGING */}
          {activeTab === 'vitals' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form to log vitals */}
              <div className="glass p-6 rounded-3xl border border-slate-800 h-fit space-y-4">
                <div className="text-left">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4.5 h-4.5 text-brand-400" /> Record Daily Vitals
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Submit your readings to share biometric trends with your doctor.</p>
                </div>

                <form onSubmit={handleAddVitals} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">BP Systolic</label>
                      <input
                        type="number"
                        placeholder="e.g. 120"
                        value={systolic}
                        onChange={(e) => setSystolic(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 placeholder-slate-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">BP Diastolic</label>
                      <input
                        type="number"
                        placeholder="e.g. 80"
                        value={diastolic}
                        onChange={(e) => setDiastolic(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 placeholder-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        placeholder="e.g. 72"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 placeholder-slate-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Glucose (mg/dL)</label>
                      <input
                        type="number"
                        placeholder="e.g. 95"
                        value={glucose}
                        onChange={(e) => setGlucose(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 placeholder-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingVitals}
                    className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isLoggingVitals ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Log Vitals & Sync</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Vital logs history */}
              <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="text-left mb-4">
                  <h3 className="text-base font-bold text-white">Biometric RPM Log History</h3>
                  <p className="text-xs text-slate-400 mt-1">Real-time indicators processed by zero-knowledge encrypted channels.</p>
                </div>

                <div className="overflow-x-auto text-left">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-850 text-[10px] text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3 font-semibold">Recorded Date</th>
                        <th className="py-2.5 px-3 font-semibold">Blood Pressure</th>
                        <th className="py-2.5 px-3 font-semibold">Heart Rate</th>
                        <th className="py-2.5 px-3 font-semibold">Blood Glucose</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-xs">
                      {vitalLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500">No vitals logs recorded yet.</td>
                        </tr>
                      ) : (
                        vitalLogs.map((log) => {
                          const isHighBP = log.systolic >= 135 || log.diastolic >= 85;
                          return (
                            <tr key={log.id} className="hover:bg-slate-900/20">
                              <td className="py-3 px-3 text-slate-400 font-mono">{new Date(log.recordedAt).toLocaleString()}</td>
                              <td className={`py-3 px-3 font-bold ${isHighBP ? 'text-red-400' : 'text-emerald-400'}`}>
                                {log.systolic}/{log.diastolic} mmHg
                              </td>
                              <td className="py-3 px-3 text-slate-300">{log.heartRate} bpm</td>
                              <td className="py-3 px-3 text-slate-300">{log.glucose} mg/dL</td>
                              <td className="py-3 px-3 text-right">
                                <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                                  isHighBP 
                                    ? 'bg-red-950/20 text-red-400 border border-red-900/30' 
                                    : 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30'
                                }`}>
                                  {isHighBP ? 'Elevated BP' : 'Normal'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: CONSULTATIONS */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              {completedConsults.length === 0 ? (
                <div className="glass p-12 rounded-3xl border border-slate-800 text-center">
                  <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white">No prior consultation records</h4>
                  <p className="text-xs text-slate-500 mt-1">Your past clinical visits will appear here once finalized.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {completedConsults.map((app) => (
                    <div key={app.id} className="glass p-6 rounded-3xl border border-slate-800 text-left space-y-4">
                      <div className="flex justify-between items-start flex-wrap gap-4 pb-4 border-b border-slate-850">
                        <div>
                          <h3 className="text-base font-bold text-white">{app.consultation?.reason || 'Clinical Consultation'}</h3>
                          <p className="text-xs text-slate-400 mt-1">
                            With {app.doctor.user.name} ({app.doctor.specialty}) • Checked on {new Date(app.dateTime).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadMock(`Consultation Notes - ${app.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-800"
                          >
                            <Download className="w-3.5 h-3.5" /> Notes
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                        <div className="space-y-2">
                          <p className="font-bold text-slate-300">Intake Symptoms Reported:</p>
                          <p className="text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-850">{app.consultation?.symptoms}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-bold text-slate-300">Doctor Diagnosis & Notes:</p>
                          <p className="text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-850">{app.consultation?.notes || 'No custom notes.'}</p>
                        </div>
                      </div>

                      {/* AI Visit Summary */}
                      {app.consultation?.summary && (
                        <div className="p-4 bg-teal-950/20 border border-teal-900/30 rounded-2xl space-y-1">
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> AI Generated Visit Summary
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed mt-1">{app.consultation.summary}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="glass p-6 rounded-3xl border border-slate-800">
              <div className="text-left mb-6">
                <h3 className="text-base font-bold text-white">Active Prescriptions</h3>
                <p className="text-xs text-slate-400 mt-1">Review active medications and open the **AI explainer** deck for details.</p>
              </div>

              {activePrescriptions.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  No active prescriptions found in your account.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold">Medicine</th>
                        <th className="py-3 px-4 font-semibold">Dosage</th>
                        <th className="py-3 px-4 font-semibold">Duration</th>
                        <th className="py-3 px-4 font-semibold">Instructions</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-xs">
                      {activePrescriptions.map((pres: any) => (
                        <tr key={pres.id} className="hover:bg-slate-900/30">
                          <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                            <span>{pres.medicine}</span>
                            <button
                              onClick={() => setSelectedRx(pres)}
                              className="px-2 py-0.5 bg-brand-500/10 border border-brand-500/25 hover:bg-brand-500/20 text-brand-400 hover:text-white rounded-lg text-[9px] font-bold transition flex items-center gap-1 leading-none h-fit"
                            >
                              <BrainCircuit className="w-3 h-3 text-brand-400" />
                              AI Explain
                            </button>
                          </td>
                          <td className="py-4 px-4 text-slate-300">{pres.dosage}</td>
                          <td className="py-4 px-4 text-slate-400">{pres.duration}</td>
                          <td className="py-4 px-4 text-slate-400 italic">{pres.instructions}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleDownloadMock(pres.medicine)}
                                title="Download PDF Rx"
                                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-brand-400 hover:text-white rounded-lg border border-slate-800 transition"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleShareMock(pres.medicine)}
                                title="Share Rx Link"
                                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Document upload zone */}
              <div className="glass p-6 rounded-3xl border border-slate-800 h-fit space-y-4">
                <div className="text-left">
                  <h3 className="text-base font-bold text-white">Upload New File</h3>
                  <p className="text-xs text-slate-400 mt-1">Upload lab results, referral letters, or clinical scans.</p>
                </div>

                <div className="border-2 border-dashed border-slate-800 hover:border-brand-500/40 p-8 rounded-2xl text-center cursor-pointer transition relative group bg-slate-900/20">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleUploadMock}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {isUploading ? (
                    <div className="space-y-2">
                      <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto" />
                      <p className="text-xs text-slate-400">Processing file securely...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto group-hover:text-brand-400 transition" />
                      <p className="text-xs text-slate-300 font-semibold">Drag & drop or browse</p>
                      <p className="text-[10px] text-slate-500">Supports PDF, JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Document List */}
              <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="text-left mb-4">
                  <h3 className="text-base font-bold text-white">Lab Reports & Scans</h3>
                  <p className="text-xs text-slate-400 mt-1">Encrypted documents stored securely in your database.</p>
                </div>

                <div className="space-y-3">
                  {uploadedFiles.map((doc, idx) => (
                    <div 
                      key={doc.id || idx} 
                      className="p-4 bg-slate-900/50 border border-slate-850 hover:border-slate-800 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="p-2 bg-brand-500/10 rounded-xl text-brand-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-[350px]">{doc.name}</p>
                          <span className="text-[9px] text-slate-500 font-bold uppercase mt-1 inline-block">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleDownloadMock(doc.name)}
                          className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-850 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* AI PRESCRIPTION EXPLAINER DRAWER */}
      {selectedRx && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="glass w-full max-w-lg rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedRx(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 md:p-8 space-y-6 text-left">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-850">
                <div className="p-2.5 bg-brand-500/10 rounded-2xl text-brand-400">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">AI Prescription Explainer</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Understanding: <strong className="text-white">{selectedRx.medicine}</strong></p>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                
                {/* Medicine Class */}
                <div className="grid grid-cols-3 py-2 border-b border-slate-850">
                  <span className="text-slate-500 font-bold">Drug Class</span>
                  <span className="col-span-2 text-white font-semibold">{getRxAIExplanation(selectedRx.medicine).class}</span>
                </div>

                {/* Purpose */}
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase tracking-wide text-[10px]">What is it for?</p>
                  <p className="p-3 bg-slate-900 border border-slate-850 rounded-xl leading-relaxed text-slate-200">
                    {getRxAIExplanation(selectedRx.medicine).purpose}
                  </p>
                </div>

                {/* How to take it */}
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase tracking-wide text-[10px]">How should I take it?</p>
                  <p className="p-3 bg-slate-900 border border-slate-850 rounded-xl leading-relaxed text-slate-200">
                    {getRxAIExplanation(selectedRx.medicine).usage}
                  </p>
                </div>

                {/* General Precautions */}
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase tracking-wide text-[10px]">General Precautions</p>
                  <p className="p-3 bg-amber-950/20 border border-amber-900/30 text-amber-400 rounded-xl leading-relaxed">
                    {getRxAIExplanation(selectedRx.medicine).warnings}
                  </p>
                </div>

                {/* Clinical Safety Warning */}
                <div className="p-3.5 bg-red-950/20 border border-red-900/30 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Clinical Safety Thresholds
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    Contact your doctor immediately if biometrics reflect: <strong className="text-white">{getRxAIExplanation(selectedRx.medicine).safetyLimits}</strong>.
                  </p>
                </div>

              </div>

              <div className="pt-2 border-t border-slate-850 flex justify-end">
                <button
                  onClick={() => setSelectedRx(null)}
                  className="w-full md:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-xs font-bold rounded-xl text-white border border-slate-800 transition"
                >
                  Close Explainer
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
