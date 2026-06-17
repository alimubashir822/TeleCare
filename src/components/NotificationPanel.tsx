'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/notification-actions';
import { Bell, X, CheckCheck, Calendar, Pill, Activity, FileText, BrainCircuit } from 'lucide-react';

const notifIcons: Record<string, React.ReactNode> = {
  'Appointment': <Calendar className="w-4 h-4 text-brand-400" />,
  'Prescription': <Pill className="w-4 h-4 text-emerald-400" />,
  'Vitals': <Activity className="w-4 h-4 text-rose-400" />,
  'Lab': <FileText className="w-4 h-4 text-amber-400" />,
  'Care Plan': <BrainCircuit className="w-4 h-4 text-teal-400" />,
  'RPM': <Activity className="w-4 h-4 text-rose-400" />,
  'New': <Bell className="w-4 h-4 text-slate-400" />,
};

function getIcon(title: string) {
  for (const key of Object.keys(notifIcons)) {
    if (title.includes(key)) return notifIcons[key];
  }
  return <Bell className="w-4 h-4 text-slate-400" />;
}

function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationPanel() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadNotifications() {
    if (!user) return;
    const res = await getNotifications(user.id);
    if (res.success) {
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    }
  }

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  async function handleMarkAllRead() {
    if (!user) return;
    await markAllNotificationsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  if (!user) return null;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) loadNotifications(); }}
        className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-800 transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">Notifications</p>
              {unreadCount > 0 && (
                <p className="text-[10px] text-slate-400">{unreadCount} unread</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-[10px] text-brand-400 hover:text-white font-semibold transition px-2 py-1 bg-brand-500/10 rounded-lg border border-brand-500/20 hover:border-brand-500/40"
                >
                  <CheckCheck className="w-3 h-3" />
                  All read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1 text-slate-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => !n.read && handleMarkRead(n.id)}
                    className={`p-4 flex gap-3 transition cursor-pointer ${
                      n.read ? 'opacity-60 hover:opacity-80' : 'bg-brand-950/10 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${n.read ? 'bg-slate-800' : 'bg-slate-800 border border-slate-700'}`}>
                      {getIcon(n.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-tight ${n.read ? 'text-slate-400' : 'text-white'}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-600">Click a notification to mark as read</p>
          </div>
        </div>
      )}
    </div>
  );
}
