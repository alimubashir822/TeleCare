'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsers, getUserWithProfile } from '@/lib/auth-actions';
import { Shield, User, Activity, Key, ChevronDown, Check, Zap, Loader2 } from 'lucide-react';

export default function DemoSwitcher() {
  const { user, switchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [switching, setSwitching] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      const res = await getUsers();
      if (res.success && res.users) {
        setUsersList(res.users);
      } else {
        // Fallback static list if db fails
        setUsersList([
          { id: '1', email: 'sarah.jenkins@telecare.ai', name: 'Sarah Jenkins', role: 'PATIENT' },
          { id: '2', email: 'sarah.khan@telecare.ai', name: 'Dr. Sarah Khan', role: 'DOCTOR' },
          { id: '3', email: 'ahmed.ali@telecare.ai', name: 'Dr. Ahmed Ali', role: 'DOCTOR' },
          { id: '4', email: 'admin@telecare.ai', name: 'System Admin', role: 'ADMIN' }
        ]);
      }
    }
    loadUsers();
  }, []);

  const handleSwitch = async (targetUser: any) => {
    setSwitching(targetUser.id);
    
    // Fetch the real profileId from DB
    const profileRes = await getUserWithProfile(targetUser.id, targetUser.role);
    const profileId = profileRes.profileId || '';

    switchUser({
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      avatar: targetUser.avatar,
      profileId
    });
    setSwitching(null);
    setIsOpen(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4 text-amber-500" />;
      case 'DOCTOR': return <Activity className="w-4 h-4 text-emerald-500" />;
      default: return <User className="w-4 h-4 text-cyan-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-amber-400';
      case 'DOCTOR': return 'text-emerald-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl border border-slate-700 hover:border-teal-700/50 transition-all duration-300 transform hover:scale-105 active:scale-95 group"
        >
          <Zap className="w-4 h-4 text-teal-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase">Quick Switch</span>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition" />
        </button>
      ) : (
        <div className="w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-teal-950 to-slate-900 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">Demo Control Panel</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-md transition"
            >
              Close
            </button>
          </div>

          {/* Subtitle */}
          <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60">
            <p className="text-[10px] text-slate-500">Switch between roles to explore all portals</p>
          </div>

          {/* Users list */}
          <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
            {usersList.map((u) => {
              const isCurrent = user?.email === u.email;
              const isLoading = switching === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => !isCurrent && handleSwitch(u)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition ${
                    isCurrent
                      ? 'bg-teal-950/40 border border-teal-800/60 text-white cursor-default'
                      : 'hover:bg-slate-800 text-slate-300 border border-transparent hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      {isCurrent && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-400 rounded-full border-2 border-slate-900" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold truncate max-w-[140px]">{u.name}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mt-0.5 ${getRoleBadgeColor(u.role)}`}>
                        {getRoleIcon(u.role)}
                        {u.role}
                      </span>
                    </div>
                  </div>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                  ) : isCurrent ? (
                    <Check className="w-4 h-4 text-teal-400" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-950 text-center border-t border-slate-800 flex flex-col gap-0.5">
            <p className="text-[10px] text-slate-500">
              Active: <span className="text-teal-400 font-semibold">{user ? user.name : 'Not logged in'}</span>
            </p>
            {user && (
              <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">{user.role} portal</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
