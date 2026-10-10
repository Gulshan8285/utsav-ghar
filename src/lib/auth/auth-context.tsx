'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('utsav_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, forcedRole?: UserRole) => {
    setIsLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();
      let role: UserRole = forcedRole || 'customer';
      let fullName = cleanEmail.split('@')[0];

      if (cleanEmail === 'admin@utsavghar.com') {
        role = 'super_admin';
        fullName = 'Gulshan Yadav (Store Director)';
      } else if (cleanEmail === 'ananya@example.com') {
        fullName = 'Ananya Verma';
        role = 'customer';
      }

      const profile: UserProfile = {
        id: `usr-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
        email: cleanEmail,
        fullName,
        phone: '+91 98111 22334',
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(profile);
      localStorage.setItem('utsav_user', JSON.stringify(profile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('utsav_user');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem('utsav_user', JSON.stringify(updated));
  };

  const isAdmin = user ? ['super_admin', 'store_manager', 'catalog_manager', 'order_manager', 'analyst'].includes(user.role) : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
