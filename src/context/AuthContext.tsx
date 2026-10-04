import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SellerProfile, CreatorProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  sellerProfile: SellerProfile | null;
  creatorProfile: CreatorProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemo: (role: 'admin' | 'seller' | 'buyer' | 'creator') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      if (data && data.user) {
        setUser(data.user);
        setSellerProfile(data.seller_profile);
        setCreatorProfile(data.creator_profile);
      } else {
        setUser(null);
        setSellerProfile(null);
        setCreatorProfile(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('revogue_token');
    if (token) {
      refreshUser();
    } else {
      // Default to Buyer demo account for university evaluator instant test drive
      switchDemo('buyer').finally(() => setIsLoading(false));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem('revogue_token', res.token);
    setUser(res.user);
    await refreshUser();
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    localStorage.setItem('revogue_token', res.token);
    setUser(res.user);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem('revogue_token');
    setUser(null);
    setSellerProfile(null);
    setCreatorProfile(null);
  };

  const switchDemo = async (role: 'admin' | 'seller' | 'buyer' | 'creator') => {
    setIsLoading(true);
    try {
      const res = await api.switchDemo(role);
      localStorage.setItem('revogue_token', res.token);
      setUser(res.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sellerProfile,
        creatorProfile,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemo,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
