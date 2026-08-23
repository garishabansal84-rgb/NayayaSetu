import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiVerifyAadhaar, apiSignup, apiLogin } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nyayasetu_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [nyayaPass, setNyayaPass] = useState(() => {
    try {
      const saved = localStorage.getItem('nyayasetu_nyayapass');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('nyayasetu_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signup'); // 'login' | 'signup'

  const saveAuthSession = (userData, passData, jwtToken) => {
    setUser(userData);
    setNyayaPass(passData);
    setToken(jwtToken);
    try {
      localStorage.setItem('nyayasetu_auth_user', JSON.stringify(userData));
      localStorage.setItem('nyayasetu_nyayapass', JSON.stringify(passData));
      if (jwtToken) localStorage.setItem('nyayasetu_token', jwtToken);
    } catch (e) {}
  };

  const login = async (identifier, password) => {
    const res = await apiLogin({ identifier, password });
    if (res.success && res.user) {
      saveAuthSession(res.user, res.nyayaPass, res.token);
      return res;
    }
    throw new Error(res.error || 'Login failed');
  };

  const loginWithKey = async (passKey) => {
    const res = await apiLogin({ identifier: passKey });
    if (res.success && res.user) {
      saveAuthSession(res.user, res.nyayaPass, res.token);
      return res;
    }
    throw new Error(res.error || 'Invalid or unregistered NyayaPass Key.');
  };

  const signup = async (signupData) => {
    const res = await apiSignup(signupData);
    if (res.success && res.user) {
      saveAuthSession(res.user, res.nyayaPass, res.token);
      return res;
    }
    throw new Error(res.error || 'Signup failed');
  };

  const logout = () => {
    setUser(null);
    setNyayaPass(null);
    setToken(null);
    try {
      localStorage.removeItem('nyayasetu_auth_user');
      localStorage.removeItem('nyayasetu_nyayapass');
      localStorage.removeItem('nyayasetu_token');
    } catch (e) {}
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const requireAuth = (callback, tab = 'login') => {
    if (user) {
      if (callback) callback();
      return true;
    } else {
      openAuthModal(tab);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      nyayaPass,
      token,
      nyayaPassKey: nyayaPass?.nyayaPassId || user?.nyayaPassId || null,
      isAuthenticated: Boolean(user && (user.nyayaPassId || nyayaPass?.nyayaPassId)),
      isAuthModalOpen,
      setIsAuthModalOpen,
      isPassModalOpen,
      setIsPassModalOpen,
      authModalTab,
      setAuthModalTab,
      openAuthModal,
      requireAuth,
      login,
      loginWithKey,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
