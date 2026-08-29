import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCase } from '../../context/CaseContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Scale, FileText, Camera, Award, MapPin, 
  Clock, BookOpen, ChevronRight, Home, ArrowRight, Shield,
  User, KeyRound, Fingerprint, Sparkles, LogOut, ShieldCheck, Activity 
} from 'lucide-react';

export const Navbar = () => {
  const { language, t } = useLanguage();
  const { activeTab, setActiveTab } = useCase();
  const { user, nyayaPass, isAuthenticated, openAuthModal, setIsPassModalOpen, logout } = useAuth();
  const isHi = language === 'hi';

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'triage', label: t.navTriage, icon: Scale },
    { id: 'evidence', label: t.navEvidence, icon: Camera },
    { id: 'readiness', label: isHi ? 'केस रेडीनेस' : 'Case Readiness', icon: Activity },
    { id: 'drafting', label: t.navDrafting, icon: FileText },
    { id: 'schemes', label: t.navSchemes, icon: Award },
    { id: 'jurisdiction', label: t.navJurisdiction, icon: MapPin },
    { id: 'tracker', label: t.navTracker, icon: Clock },
    { id: 'wiki', label: t.navWiki, icon: BookOpen },
  ];


  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Tricolor Government Ribbon */}
      <div className="gov-tricolor-bar"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Emblem & Branding */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => setActiveTab('home')}
          >
            {/* Sovereign State Seal Badge */}
            <div className="w-12 h-12 rounded-lg bg-[#0A2540] flex items-center justify-center text-amber-400 shadow-sm border border-slate-300 group-hover:border-amber-500 transition-colors">
              <Scale className="w-6 h-6 stroke-[1.75]" />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-[#0A2540]">
                  {t.portalTitle}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  {language === 'hi' ? 'न्याय सेतु' : 'न्याय सेतु'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium tracking-wide">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Citizen Auth & Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Clickable NyayaPass Chip */}
                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-[#0A2540] to-blue-900 text-white text-xs font-mono font-bold shadow-xs border border-amber-400/60 hover:border-amber-400 transition-all cursor-pointer"
                  title="Click to view and print your verified Digital NyayaPass"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-amber-300">🔑 {nyayaPass?.nyayaPassId || user?.nyayaPassId || 'NP-PASS'}</span>
                </button>

                {/* Citizen Name & Profile */}
                <div className="hidden lg:flex flex-col text-right text-xs">
                  <span className="font-bold text-slate-800 line-clamp-1">{user.name}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>UIDAI Verified</span>
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isHi ? 'Key से लॉगिन' : 'Enter NyayaPass Key'}</span>
                </button>

                <button
                  onClick={() => openAuthModal('signup')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>{isHi ? 'आधार से नया Key बनाएं' : 'Sign Up (Get Key)'}</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setActiveTab('triage')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-sm transition-all border border-[#0A2540] cursor-pointer"
            >
              <span>{t.btnStartDiagnosis}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Institutional Navigation Tab Bar */}
        <nav className="flex items-center gap-1 border-t border-slate-100 py-1 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isProtected = item.id !== 'home' && item.id !== 'wiki';
            const isLocked = isProtected && !isAuthenticated;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-colors relative ${
                  isActive
                    ? 'text-[#0A2540] bg-slate-100 font-extrabold border-b-2 border-[#D97706] rounded-b-none'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D97706]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {isLocked && (
                  <span className="text-[10px] text-amber-600 ml-0.5" title="Requires NyayaPass Key Authentication">🔒</span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
