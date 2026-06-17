'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getAppointmentDetails, saveConsultation } from '@/lib/consultation-actions';
import { getPatientAiReport } from '@/lib/doctor-actions';
import { 
  Video, VideoOff, Mic, MicOff, MonitorUp, PhoneOff, 
  MessageSquare, Clipboard, Pill, AlertTriangle, Sparkles, 
  CheckCircle2, ArrowRight, User, Stethoscope, FileText, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VideoConsultation({ params }: PageProps) {
  const { user } = useAuth();
  
  // Resolve params
  const { id: appointmentId } = React.use(params);

  const [appointment, setAppointment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('emr');

  // Video Mock States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Live Chat States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { sender: 'System', text: 'Secure encrypted video channel established.' }
  ]);

  // EMR intake AI report
  const [aiIntakeReport, setAiIntakeReport] = useState<any | null>(null);

  // Live notes and prescription form states
  const [diagnosisNote, setDiagnosisNote] = useState('');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDuration, setMedDuration] = useState('');
  const [medInstructions, setMedInstructions] = useState('');

  // Call termination & AI Summary state
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [isCompilingAi, setIsCompilingAi] = useState(false);
  const [compiledSummary, setCompiledSummary] = useState('');
  const [recoveryTimeline, setRecoveryTimeline] = useState<any[]>([]);
  const [isFinalized, setIsFinalized] = useState(false);

  useEffect(() => {
    async function loadCallDetails() {
      setLoading(true);
      const res = await getAppointmentDetails(appointmentId);
      if (res.success && res.appointment) {
        setAppointment(res.appointment);
        
        // Fetch AI intake summary
        const aiRes = await getPatientAiReport(res.appointment.patient.id);
        if (aiRes.success && aiRes.report) {
          try {
            setAiIntakeReport(JSON.parse(aiRes.report.content));
          } catch (e) {
            setAiIntakeReport(null);
          }
        }
      }
      setLoading(false);
    }
    loadCallDetails();
  }, [appointmentId]);

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName || !medDosage || !medDuration || !medInstructions) {
      alert('Please fill out all prescription fields.');
      return;
    }
    const newRx = {
      medicine: medName,
      dosage: medDosage,
      duration: medDuration,
      instructions: medInstructions
    };
    setPrescriptions(prev => [...prev, newRx]);
    
    // Add chat message indicating prescription was added
    setMessages(prev => [
      ...prev,
      { sender: 'System', text: `Prescription added: ${medName} ${medDosage} for ${medDuration}.` }
    ]);

    // Clear form
    setMedName('');
    setMedDosage('');
    setMedDuration('');
    setMedInstructions('');
  };

  const handleRemovePrescription = (idx: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { sender: user?.name || 'User', text: chatInput }]);
    setChatInput('');
  };

  const handleEndCall = () => {
    // End the video stream, trigger AI visit summary generation
    setIsCallEnded(true);
    setIsCompilingAi(true);

    setTimeout(() => {
      // Simulate post-visit AI summary generation
      const diagnosis = diagnosisNote || 'Stage 1 Hypertension checkup';
      const medicines = prescriptions.map(p => p.medicine).join(', ') || 'No medication added';
      
      setCompiledSummary(
        `Consulted patient Sarah Jenkins for chest tightness and blood pressure monitoring. Diagnosed with ${diagnosis}. Instructed home BP checkups, low-sodium food guides, and regular activity. Prescribed: ${medicines}.`
      );

      setRecoveryTimeline([
        { day: 'Day 1', task: 'Check dosage instructions and confirm drug safety instructions' },
        { day: 'Day 7', task: 'Recovery update - log weekly blood pressure levels and note pulse trends' },
        { day: 'Day 14', task: 'Follow-up online consult booking with Dr. Ahmed Ali' }
      ]);
      
      setIsCompilingAi(false);
    }, 2500);
  };

  const handleSaveAndClose = async () => {
    setIsFinalized(true);
    
    // Save to SQLite
    const res = await saveConsultation({
      appointmentId,
      reason: appointment?.type === 'VIDEO' ? 'Cardiology Video consultation' : 'Hypertension checkup',
      symptoms: aiIntakeReport?.mainIssue || 'Chest tightness and slight breathlessness',
      notes: diagnosisNote || 'Recommended stress release exercises and home BP trends log.',
      summary: compiledSummary,
      prescriptions
    });

    if (res.success) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
      // Redirect
      setTimeout(() => {
        window.location.href = user?.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard';
      }, 2000);
    } else {
      alert('Failed to save consultation details.');
      setIsFinalized(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-center justify-center py-20 font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass p-8 rounded-3xl border border-slate-800 text-center max-w-sm space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">Appointment Not Found</h3>
            <p className="text-xs text-slate-400">The requested telemedicine room could not be resolved.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isDoc = user?.role === 'DOCTOR';
  const otherPartyName = isDoc ? appointment.patient.user.name : appointment.doctor.user.name;
  const otherPartyAvatar = isDoc ? appointment.patient.user.avatar : appointment.doctor.user.avatar;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      
      {/* Session Title Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-850 flex justify-between items-center text-left font-sans">
        <div>
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Secure Consultation Room
          </span>
          <h2 className="text-sm font-bold text-white mt-0.5">
            Visit with {otherPartyName}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-slate-950 text-[10px] text-slate-400 border border-slate-800 rounded font-mono">
            Room ID: {appointment.id.substring(0, 8)}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Call ended view */}
        {isCallEnded ? (
          <div className="flex-1 flex items-center justify-center bg-slate-950 p-8 font-sans">
            {isCompilingAi ? (
              <div className="text-center space-y-4 max-w-md animate-in zoom-in-95 duration-200">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <Sparkles className="absolute inset-0 w-8 h-8 text-teal-400 m-auto animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">Compiling AI Visit Summary</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Analyzing diagnostic logs, real-time consultation notes, and prescriptions to compile advice summaries and care guidelines.
                </p>
              </div>
            ) : (
              <div className="w-full max-w-2xl glass p-8 rounded-3xl border border-slate-800 space-y-6 text-left animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-850">
                  <div className="p-2.5 bg-brand-500/10 rounded-2xl text-brand-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">AI Consultation Finalized</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Summary and follow-up care actions compiled successfully.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consultation Summary</p>
                    <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {compiledSummary}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Automated Follow-up Automation</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {recoveryTimeline.map((t, idx) => (
                        <div key={idx} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl text-left space-y-1.5">
                          <span className="text-[10px] text-brand-400 font-bold tracking-wide uppercase">{t.day}</span>
                          <p className="text-[11px] text-slate-300 leading-normal">{t.task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
                  <button
                    onClick={handleSaveAndClose}
                    disabled={isFinalized}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
                  >
                    {isFinalized ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <span>Finalize & Sync Database</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Split Left: Video Simulation feeds */}
            <div className="flex-1 bg-slate-900/50 p-6 flex flex-col justify-between min-h-[500px] border-r border-slate-850">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-stretch">
                
                {/* Doctor Feed Frame */}
                <div className="glass rounded-3xl border border-slate-800 flex flex-col justify-between p-4 relative overflow-hidden aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                  
                  {/* Top indicators */}
                  <div className="flex justify-between items-center relative z-20">
                    <span className="text-[10px] bg-slate-950/80 text-brand-400 font-bold px-2 py-1 rounded">
                      Doctor (You)
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  {/* Body Feed Animation/Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    {isVideoOff ? (
                      <div className="text-center">
                        <User className="w-16 h-16 text-slate-700 mx-auto" />
                        <p className="text-xs text-slate-500 mt-2">Video Muted</p>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full border-2 border-brand-500/20 flex items-center justify-center bg-brand-500/5 relative overflow-hidden group">
                        <img 
                          src={isDoc ? user?.avatar || '' : appointment.doctor.user.avatar} 
                          alt="Doctor" 
                          className="w-full h-full object-cover rounded-full filter blur-[1px] group-hover:blur-none transition" 
                        />
                        <div className="absolute bottom-2 flex gap-0.5 justify-center w-full">
                          <span className="w-1 h-3 bg-brand-400 animate-pulse [animation-duration:1s]" />
                          <span className="w-1 h-4 bg-brand-400 animate-pulse [animation-duration:0.8s]" />
                          <span className="w-1 h-2 bg-brand-400 animate-pulse [animation-duration:1.2s]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Name banner */}
                  <div className="relative z-20 text-left">
                    <p className="text-xs font-bold text-white">{isDoc ? user?.name : appointment.doctor.user.name}</p>
                    <p className="text-[10px] text-slate-400">Board-Certified Specialist</p>
                  </div>
                </div>

                {/* Patient Feed Frame */}
                <div className="glass rounded-3xl border border-slate-800 flex flex-col justify-between p-4 relative overflow-hidden aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                  
                  <div className="flex justify-between items-center relative z-20">
                    <span className="text-[10px] bg-slate-950/80 text-brand-400 font-bold px-2 py-1 rounded">
                      Patient
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <div className="w-24 h-24 rounded-full border-2 border-teal-500/20 flex items-center justify-center bg-teal-500/5 relative overflow-hidden group">
                      <img 
                        src={isDoc ? appointment.patient.user.avatar : user?.avatar || ''} 
                        alt="Patient" 
                        className="w-full h-full object-cover rounded-full filter blur-[1px]" 
                      />
                      <div className="absolute bottom-2 flex gap-0.5 justify-center w-full">
                        <span className="w-1.5 h-3 bg-teal-400 animate-pulse [animation-duration:1.5s]" />
                        <span className="w-1.5 h-2 bg-teal-400 animate-pulse [animation-duration:1s]" />
                        <span className="w-1.5 h-4 bg-teal-400 animate-pulse [animation-duration:0.7s]" />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-20 text-left">
                    <p className="text-xs font-bold text-white">{isDoc ? appointment.patient.user.name : user?.name}</p>
                    <p className="text-[10px] text-slate-400">Connected</p>
                  </div>
                </div>

              </div>

              {/* Call Controls Bar */}
              <div className="mt-6 flex justify-center items-center gap-4 bg-slate-950 border border-slate-850 p-4 rounded-2xl">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-xl border transition ${
                    isMuted 
                      ? 'bg-red-950/20 border-red-900/40 text-red-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-xl border transition ${
                    isVideoOff 
                      ? 'bg-red-950/20 border-red-900/40 text-red-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => {
                    setIsScreenSharing(!isScreenSharing);
                    setMessages(prev => [
                      ...prev,
                      { sender: 'System', text: `Screen sharing ${!isScreenSharing ? 'started' : 'stopped'}.` }
                    ]);
                  }}
                  className={`p-3 rounded-xl border transition ${
                    isScreenSharing 
                      ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isScreenSharing ? 'Stop Presenting' : 'Share Screen'}
                >
                  <MonitorUp className="w-5 h-5" />
                </button>

                <button
                  onClick={handleEndCall}
                  className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/15 transition animate-pulse"
                  title="End Consultation Visit"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Split Right: Clinical Workspace / Patient status dashboard */}
            <div className="w-full lg:w-96 bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 border-slate-850">
              
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                
                {/* Tabs selection */}
                <div>
                  <div className="flex gap-2 border-b border-slate-900 pb-2">
                    {isDoc ? (
                      <>
                        <button
                          onClick={() => setActiveTab('emr')}
                          className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-center ${
                            activeTab === 'emr' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500'
                          }`}
                        >
                          Intake / EMR
                        </button>
                        <button
                          onClick={() => setActiveTab('notes')}
                          className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-center ${
                            activeTab === 'notes' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500'
                          }`}
                        >
                          Live Notes
                        </button>
                        <button
                          onClick={() => setActiveTab('prescription')}
                          className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-center ${
                            activeTab === 'prescription' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500'
                          }`}
                        >
                          Rx Creator
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveTab('overview')}
                          className={`flex-grow pb-2 text-[10px] font-bold uppercase tracking-wider text-center ${
                            activeTab === 'overview' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500'
                          }`}
                        >
                          Notes Overview
                        </button>
                        <button
                          onClick={() => setActiveTab('rx-status')}
                          className={`flex-grow pb-2 text-[10px] font-bold uppercase tracking-wider text-center ${
                            activeTab === 'rx-status' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500'
                          }`}
                        >
                          Prescriptions
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-center ${
                        activeTab === 'chat' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500'
                      }`}
                    >
                      Chat
                    </button>
                  </div>

                  {/* TAB CONTENT: DOCTOR EMR */}
                  {isDoc && activeTab === 'emr' && (
                    <div className="mt-4 space-y-4 text-left">
                      {aiIntakeReport && (
                        <div className="p-4 bg-teal-950/20 border border-teal-900/30 rounded-2xl space-y-2">
                          <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                            AI Intake Summary Report
                          </span>
                          <p className="text-[11px] text-slate-300 leading-normal"><span className="text-slate-500 font-medium">Concern:</span> {aiIntakeReport.mainIssue}</p>
                          <p className="text-[11px] text-slate-300 leading-normal"><span className="text-slate-500 font-medium">Duration:</span> {aiIntakeReport.duration}</p>
                          <p className="text-[11px] text-red-400 leading-normal"><span className="text-slate-500 font-medium text-slate-400">Alert:</span> {aiIntakeReport.importantInfo}</p>
                        </div>
                      )}

                      <div className="space-y-1 bg-slate-900/40 p-4 border border-slate-850 rounded-2xl text-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">General History</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{appointment.patient.medicalHistory || 'No history logged.'}</p>
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: DOCTOR LIVE NOTES */}
                  {isDoc && activeTab === 'notes' && (
                    <div className="mt-4 space-y-3 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Diagnosis Notes (Shared in Real-time)</label>
                      <textarea
                        rows={8}
                        value={diagnosisNote}
                        onChange={(e) => setDiagnosisNote(e.target.value)}
                        placeholder="Write clinical diagnoses, lifestyle recommendations, or follow-up instructions here..."
                        className="w-full p-3 bg-slate-900 border border-slate-850 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-500 italic">Notes entered here are automatically updated in EMR database files.</p>
                    </div>
                  )}

                  {/* TAB CONTENT: DOCTOR PRESCRIPTION CREATOR */}
                  {isDoc && activeTab === 'prescription' && (
                    <div className="mt-4 space-y-4 text-left">
                      
                      {/* Rx list summary */}
                      {prescriptions.length > 0 && (
                        <div className="space-y-1.5 p-3 bg-slate-900 border border-slate-850 rounded-2xl text-xs">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Adding Medications:</span>
                          <div className="space-y-1">
                            {prescriptions.map((rx, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-850 last:border-b-0">
                                <div>
                                  <span className="font-bold text-white">{rx.medicine}</span> <span className="text-slate-400">({rx.dosage})</span>
                                </div>
                                <button
                                  onClick={() => handleRemovePrescription(idx)}
                                  className="text-red-400 hover:text-red-300 text-[10px] font-bold"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rx form */}
                      <form onSubmit={handleAddPrescription} className="space-y-2.5 p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Add Prescription Form</span>
                        
                        <input
                          type="text"
                          placeholder="Medicine Name (e.g. Amoxicillin)"
                          value={medName}
                          onChange={(e) => setMedName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Dosage (e.g. 500mg)"
                            value={medDosage}
                            onChange={(e) => setMedDosage(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 7 Days)"
                            value={medDuration}
                            onChange={(e) => setMedDuration(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Instructions (e.g. After meals)"
                          value={medInstructions}
                          onChange={(e) => setMedInstructions(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                        />

                        <button
                          type="submit"
                          className="w-full py-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-xl text-xs shadow transition duration-200"
                        >
                          Add Medication
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB CONTENT: PATIENT LIVE OVERVIEW */}
                  {!isDoc && activeTab === 'overview' && (
                    <div className="mt-4 space-y-4 text-left">
                      <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-2 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Doctor Live Recommendations</span>
                        <p className="text-slate-300 leading-relaxed italic">
                          {diagnosisNote ? `"${diagnosisNote}"` : 'Doctor is currently formulating clinical advisory notes. They will appear here in real-time.'}
                        </p>
                      </div>

                      {aiIntakeReport && (
                        <div className="p-4 bg-teal-950/20 border border-teal-900/30 rounded-2xl space-y-1.5 text-xs text-slate-300">
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Your Symptom Summary Shared
                          </span>
                          <p className="leading-relaxed"><span className="text-slate-500">Concern:</span> {aiIntakeReport.mainIssue}</p>
                          <p className="leading-relaxed"><span className="text-slate-500">Duration:</span> {aiIntakeReport.duration}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB CONTENT: PATIENT RX STATUS */}
                  {!isDoc && activeTab === 'rx-status' && (
                    <div className="mt-4 space-y-4 text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Live Prescriptions Added</span>
                      {prescriptions.length === 0 ? (
                        <p className="text-xs text-slate-500 py-6 text-center">No prescriptions added by doctor yet.</p>
                      ) : (
                        <div className="space-y-3.5">
                          {prescriptions.map((rx, idx) => (
                            <div key={idx} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-1.5 text-xs">
                              <p className="font-bold text-white flex items-center gap-1.5">
                                <Pill className="w-4 h-4 text-brand-400" /> {rx.medicine} ({rx.dosage})
                              </p>
                              <p className="text-slate-400 leading-none"><span className="text-slate-500">Duration:</span> {rx.duration}</p>
                              <p className="text-slate-400 leading-none italic"><span className="text-slate-500 not-italic">Instructions:</span> {rx.instructions}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB CONTENT: CHAT */}
                  {activeTab === 'chat' && (
                    <div className="mt-4 flex flex-col justify-between h-[300px] border border-slate-850 bg-slate-900/20 rounded-2xl overflow-hidden text-xs">
                      
                      {/* Message History list */}
                      <div className="flex-1 p-3 overflow-y-auto space-y-2 max-h-[240px]">
                        {messages.map((m, idx) => {
                          const isSys = m.sender === 'System';
                          const isMe = m.sender === user?.name;
                          return (
                            <div key={idx} className={`p-2 rounded-xl text-[11px] leading-relaxed max-w-[85%] ${
                              isSys 
                                ? 'bg-slate-950 text-slate-500 italic mx-auto text-center max-w-[100%]' 
                                : isMe 
                                  ? 'bg-brand-600 text-white ml-auto rounded-tr-none' 
                                  : 'bg-slate-900 text-slate-300 mr-auto rounded-tl-none border border-slate-850'
                            }`}>
                              {!isSys && <p className="font-bold text-[9px] text-slate-400 mb-0.5">{m.sender}</p>}
                              <p>{m.text}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Chat Input */}
                      <form onSubmit={handleSendMessage} className="p-2 bg-slate-900 border-t border-slate-850 flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Type message..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-brand-500 placeholder-slate-500"
                        />
                        <button
                          type="submit"
                          className="p-1.5 bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-lg transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  )}

                </div>

                {/* Info Disclaimer alert */}
                <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-2xl flex gap-2.5 items-start mt-6 text-left">
                  <AlertTriangle className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    This consultation visit is encrypted and recorded under HIPAA audits. Leaving this channel ends the call session.
                  </p>
                </div>

              </div>

            </div>
          </>
        )}

      </div>

    </div>
  );
}
