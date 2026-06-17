'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  Lock, Shield, ShieldCheck, Eye, AlertTriangle, CheckCircle2, 
  User, Stethoscope, Settings, FileText, Globe, Server, ShieldAlert
} from 'lucide-react';

const accessLogs = [
  { user: 'Dr. Ahmed Ali', role: 'DOCTOR', action: 'Viewed EMR record', patient: 'Sarah Jenkins', time: '10:35 AM', ip: '192.168.1.45', risk: 'low' },
  { user: 'System Admin', role: 'ADMIN', action: 'Updated doctor verification status', patient: 'Dr. Emily Chen', time: '10:12 AM', ip: '10.0.0.1', risk: 'low' },
  { user: 'Sarah Jenkins', role: 'PATIENT', action: 'Logged vitals reading', patient: 'Self', time: '09:48 AM', ip: '203.0.113.22', risk: 'low' },
  { user: 'Dr. Sarah Khan', role: 'DOCTOR', action: 'Uploaded prescription PDF', patient: 'John Smith', time: '09:30 AM', ip: '192.168.1.78', risk: 'low' },
  { user: 'Sarah Jenkins', role: 'PATIENT', action: 'Accessed video consultation', patient: 'Self', time: '09:15 AM', ip: '203.0.113.22', risk: 'low' },
  { user: 'Unknown', role: 'UNKNOWN', action: 'Failed login attempt (3x)', patient: '—', time: '08:52 AM', ip: '185.234.0.99', risk: 'high' },
  { user: 'Dr. Ahmed Ali', role: 'DOCTOR', action: 'Downloaded patient document', patient: 'Mike Johnson', time: '08:30 AM', ip: '192.168.1.45', risk: 'medium' },
];

const loginHistory = [
  { user: 'Sarah Jenkins', role: 'PATIENT', time: 'Today 9:15 AM', ip: '203.0.113.22', device: 'Chrome / Windows', status: 'success' },
  { user: 'Dr. Ahmed Ali', role: 'DOCTOR', time: 'Today 8:50 AM', ip: '192.168.1.45', device: 'Chrome / macOS', status: 'success' },
  { user: 'System Admin', role: 'ADMIN', time: 'Today 8:00 AM', ip: '10.0.0.1', device: 'Firefox / Linux', status: 'success' },
  { user: 'Dr. Sarah Khan', role: 'DOCTOR', time: 'Yesterday 5:30 PM', ip: '192.168.1.78', device: 'Safari / iOS', status: 'success' },
  { user: 'Unknown', role: 'UNKNOWN', time: 'Yesterday 3:12 AM', ip: '185.234.0.99', device: 'Unknown / Unknown', status: 'blocked' },
];

const permissions = [
  { feature: 'View Patient EMR', admin: true, doctor: true, patient: false },
  { feature: 'Write Prescriptions', admin: true, doctor: true, patient: false },
  { feature: 'Access Own Records', admin: true, doctor: false, patient: true },
  { feature: 'Verify Doctor Credentials', admin: true, doctor: false, patient: false },
  { feature: 'View Platform Analytics', admin: true, doctor: false, patient: false },
  { feature: 'Configure Automation', admin: true, doctor: false, patient: false },
  { feature: 'Book Appointments', admin: true, doctor: false, patient: true },
  { feature: 'Join Video Consultation', admin: false, doctor: true, patient: true },
  { feature: 'Export Patient Data', admin: true, doctor: false, patient: false },
  { feature: 'Send Secure Messages', admin: true, doctor: true, patient: true },
];

const hipaaChecklist = [
  { item: 'Unique user identification (UID) per account', done: true },
  { item: 'Automatic logoff after inactivity timeout', done: true },
  { item: 'Audit controls — record access and modifications logged', done: true },
  { item: 'Transmission security — TLS 1.3 encryption in transit', done: true },
  { item: 'Encryption at rest — AES-256 for stored data', done: true },
  { item: 'Role-based access control (RBAC) enforced', done: true },
  { item: 'Business Associate Agreement (BAA) documentation', done: false },
  { item: 'Breach notification procedure documented', done: false },
];

export default function SecurityPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'logs' | 'logins' | 'permissions' | 'hipaa'>('logs');

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

  const tabs = [
    { id: 'logs', label: 'Access Logs', icon: <Eye className="w-4 h-4" /> },
    { id: 'logins', label: 'Login History', icon: <User className="w-4 h-4" /> },
    { id: 'permissions', label: 'Permissions Matrix', icon: <Shield className="w-4 h-4" /> },
    { id: 'hipaa', label: 'HIPAA Compliance', icon: <ShieldCheck className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />

      <main className="flex-1 py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-900">
            <div className="text-left">
              <Link href="/admin/dashboard" className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 mb-2">
                ← Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Lock className="w-8 h-8 text-emerald-400" />
                Security & Audit Center
              </h1>
              <p className="text-slate-400 mt-1 text-sm">HIPAA-compliant access logging, permissions, and security monitoring.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/20 border border-emerald-900/30 rounded-xl">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-bold">AES-256 Encrypted</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-brand-950/20 border border-brand-900/30 rounded-xl">
                <Globe className="w-4 h-4 text-brand-400" />
                <span className="text-xs text-brand-400 font-bold">TLS 1.3 Active</span>
              </div>
            </div>
          </div>

          {/* Security Score */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {[
              { label: 'Security Score', value: '94', unit: '/ 100', color: 'text-emerald-400' },
              { label: 'Failed Logins', value: '1', unit: 'last 24h', color: 'text-rose-400' },
              { label: 'Access Events', value: '23', unit: 'logged today', color: 'text-brand-400' },
              { label: 'HIPAA Items', value: `${hipaaChecklist.filter(h => h.done).length}/${hipaaChecklist.length}`, unit: 'compliant', color: 'text-teal-400' },
            ].map((stat, i) => (
              <div key={i} className="glass p-5 rounded-3xl border border-slate-800 text-left">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{stat.label}</p>
                <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-600 mt-1">{stat.unit}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'logs' && (
            <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Today's Access Log</h3>
                <span className="ml-auto text-[10px] text-slate-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="overflow-x-auto text-left">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-[10px] text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Time</th>
                      <th className="py-3 px-4 font-semibold">User</th>
                      <th className="py-3 px-4 font-semibold">Action</th>
                      <th className="py-3 px-4 font-semibold">Regarding</th>
                      <th className="py-3 px-4 font-semibold">IP Address</th>
                      <th className="py-3 px-4 font-semibold">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {accessLogs.map((log, i) => (
                      <tr key={i} className={`hover:bg-slate-900/20 ${log.risk === 'high' ? 'bg-rose-950/10' : ''}`}>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">{log.time}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {log.role === 'DOCTOR' ? <Stethoscope className="w-3 h-3 text-brand-400" /> : log.role === 'ADMIN' ? <Settings className="w-3 h-3 text-amber-400" /> : <User className="w-3 h-3 text-cyan-400" />}
                            <span className={`font-semibold ${log.risk === 'high' ? 'text-rose-400' : 'text-white'}`}>{log.user}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{log.action}</td>
                        <td className="py-3 px-4 text-slate-400">{log.patient}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">{log.ip}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            log.risk === 'high' ? 'bg-rose-950/20 border-rose-900/30 text-rose-400' :
                            log.risk === 'medium' ? 'bg-amber-950/20 border-amber-900/30 text-amber-400' :
                            'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                          }`}>{log.risk}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logins' && (
            <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Recent Login History</h3>
              </div>
              <div className="divide-y divide-slate-800/40">
                {loginHistory.map((entry, i) => (
                  <div key={i} className={`p-4 flex items-center gap-4 text-xs ${entry.status === 'blocked' ? 'bg-rose-950/10' : 'hover:bg-slate-900/20'} transition`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`} />
                    <div className="flex-1 text-left">
                      <p className={`font-bold ${entry.status === 'blocked' ? 'text-rose-400' : 'text-white'}`}>{entry.user}</p>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">{entry.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400">{entry.time}</p>
                      <p className="text-slate-600 text-[10px] font-mono">{entry.ip}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-slate-500 text-[10px]">{entry.device}</p>
                      <span className={`text-[10px] font-bold ${entry.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {entry.status === 'success' ? 'Successful' : '⚠ Blocked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Role-Based Access Control (RBAC) Matrix</h3>
              </div>
              <div className="overflow-x-auto text-left">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-4 text-slate-500 font-semibold">Feature / Permission</th>
                      <th className="py-3 px-4 text-amber-400 font-bold text-center">Admin</th>
                      <th className="py-3 px-4 text-brand-400 font-bold text-center">Doctor</th>
                      <th className="py-3 px-4 text-cyan-400 font-bold text-center">Patient</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {permissions.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-900/20 transition">
                        <td className="py-3 px-4 text-slate-300 font-semibold">{p.feature}</td>
                        {[p.admin, p.doctor, p.patient].map((allowed, j) => (
                          <td key={j} className="py-3 px-4 text-center">
                            {allowed
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                              : <span className="w-4 h-4 block mx-auto text-slate-700">—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'hipaa' && (
            <div className="space-y-4">
              <div className="glass p-6 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">HIPAA Technical Safeguards Compliance</h3>
                  <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-1 rounded-lg">
                    {hipaaChecklist.filter(h => h.done).length}/{hipaaChecklist.length} Complete
                  </span>
                </div>
                <div className="space-y-3">
                  {hipaaChecklist.map((item, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${item.done ? 'bg-emerald-950/10 border-emerald-900/20' : 'bg-amber-950/10 border-amber-900/20'}`}>
                      {item.done
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        : <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      }
                      <p className={`text-xs font-medium ${item.done ? 'text-slate-300' : 'text-amber-300'}`}>{item.item}</p>
                      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md ${item.done ? 'text-emerald-400 bg-emerald-950/20' : 'text-amber-400 bg-amber-950/20'}`}>
                        {item.done ? 'Compliant' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-brand-950/20 border border-brand-900/30 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
                <FileText className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <p>For full HIPAA compliance in a production deployment, BAA documentation must be signed with cloud infrastructure providers, and a formal breach notification procedure must be established and documented.</p>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
