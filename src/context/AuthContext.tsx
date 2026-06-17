'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyLogin } from '@/lib/auth-actions';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string; // 'ADMIN' | 'DOCTOR' | 'PATIENT'
  avatar: string | null;
  profileId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, passwordHash: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (targetUser: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session from localStorage on mount
    const savedUser = localStorage.getItem('telecare_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('telecare_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, passwordHash: string) => {
    setLoading(true);
    const result = await verifyLogin(email, passwordHash);
    if (result.success && result.user) {
      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        avatar: result.user.avatar,
        profileId: result.user.profileId
      };
      setUser(authUser);
      localStorage.setItem('telecare_session', JSON.stringify(authUser));
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: result.error || 'Authentication failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('telecare_session');
    // Redirect to home page
    window.location.href = '/';
  };

  const switchUser = (targetUser: any) => {
    const authUser: AuthUser = {
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      avatar: targetUser.avatar,
      profileId: targetUser.profileId || ''
    };
    setUser(authUser);
    localStorage.setItem('telecare_session', JSON.stringify(authUser));
    // Trigger window reload to refresh dashboard contexts
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
