import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCase } from '../../context/CaseContext';
import { 
  Lock, KeyRound, ShieldCheck, Fingerprint, Sparkles, 
  ArrowRight, AlertCircle, CheckCircle2, Shield, Scale, FileText 
} from 'lucide-react';

export const ProtectedFeatureGate = ({ children, featureTitle, featureDescription }) => {
  const { isAuthenticated, nyayaPassKey, openAuthModal, loginWithKey } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useCase();
  const isHi = language === 'hi';

  const [inputKey, setInputKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleUnlockWithKey = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    const cleanKey = inputKey.trim();
    if (!cleanKey) {
      setError(isHi ? 'कृपया अपना 16-अंकों का न्याय पास Key दर्ज करें।' : 'Please enter your unique NyayaPass Key.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithKey(cleanKey);
      if (res.success) {
        showToast(isHi ? 'न्याय पास Key प्रमाणित! सभी सेवाएं अनलॉक।' : 'NyayaPass Key Verified! Features unlocked.', 'success');
      }
    } catch (err) {
      setError(err.message || (isHi ? 'अमान्य Key। कृपया सही न्याय पास Key दर्ज करें या नया खाता बनाएं।' : 'Invalid or unrecognized Key. Please sign up to issue a new NyayaPass Key.'));
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setInputKey('NP-2026-8812-UP-IN');
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in text-slate-800">
      
      {/* Central Sovereign Auth Lock Screen */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Top Emblem Header */}
        <div className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white p-6 sm:p-8 text-center relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400/20 border-2 border-amber-400/80 mx-auto flex items-center justify-center text-amber-300 mb-4 shadow-inner">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-400/40 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHi ? 'नागरिक प्रमाणीकरण अनिवार्य' : 'Citizen Key Authentication Gateway'}</span>
          </span>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight font-serif text-white">
            {isHi ? 'सुरक्षित नागरिक न्याय पास प्रमाणीकरण' : 'NyayaPass Citizen Key Required'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl mx-auto leading-relaxed">
            {featureTitle ? (
              <span>
                {isHi ? `"${featureTitle}" का उपयोग करने के लिए वेबसाइट द्वारा जारी विशिष्ट NyayaPass Key से प्रमाणित होना अनिवार्य है।` : `To access ${featureTitle} and statutory legal action tools, citizen authentication via your issued NyayaPass Key is required.`}
              </span>
            ) : (
              <span>
                {isHi ? 'कानूनी निदान, साक्ष्य विश्लेषण एवं कानूनी नोटिस तैयार करने हेतु वेबसाइट द्वारा जारी विशिष्ट NyayaPass Key से प्रमाणित होना अनिवार्य है।' : 'Under National Citizen Service Frameworks, accessing AI Legal Triage, Evidence OCR, and Notice Drafting requires verified NyayaPass Key authentication.'}
              </span>
            )}
          </p>
        </div>

        {/* Action Gate Body */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Option 1: Direct 1-Step Key Unlock Box */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-300 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0A2540] flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0A2540]">
                    {isHi ? '1. अपने जारी न्याय पास Key से अनलॉक करें' : '1. Unlock with Your Issued NyayaPass Key'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {isHi ? 'साइनअप के बाद आपको प्रदान की गई Key यहाँ दर्ज करें' : 'Enter the unique access key generated during your signup'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs text-blue-800 hover:text-blue-950 font-bold hover:underline cursor-pointer"
              >
                ⚡ {isHi ? 'डेमो Key भरें' : 'Use Demo Key'}
              </button>
            </div>

            <form onSubmit={handleUnlockWithKey} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setError(null);
                    }}
                    placeholder={isHi ? 'उदा. NP-2026-8812-UP-IN' : 'e.g. NP-2026-8812-UP-IN'}
                    className="w-full pl-9 pr-3 py-3 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2540] tracking-wider"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-lg bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 flex-shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{loading ? (isHi ? 'सत्यापित हो रहा है...' : 'Validating Key...') : (isHi ? 'Key से अनलॉक करें' : 'Unlock Access →')}</span>
                </button>
              </div>

              {error && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>

          {/* Divider */}
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHi ? 'या नया नागरिक खाता बनाएं' : 'OR CREATE NEW CITIZEN ACCOUNT'}
            </span>
          </div>

          {/* Option 2: Signup & Get Key Card */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Fingerprint className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-extrabold text-emerald-950">
                  {isHi ? '2. नया न्याय पास Key प्राप्त करें (आधार सत्यापन)' : '2. Sign Up & Generate Your NyayaPass Key'}
                </h3>
              </div>
              <p className="text-xs text-emerald-800 max-w-md leading-relaxed">
                {isHi 
                  ? 'यूआईडीएआई आधार सत्यापन के साथ 1 मिनट में अपना स्थायी डिजिटल न्याय पास Key प्राप्त करें और सभी कानूनी अधिकार तुरंत अनलॉक करें।' 
                  : 'Get your official 16-character verified NyayaPass Key in 60 seconds with UIDAI Aadhaar verification.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{isHi ? 'आधार से नया Key बनाएं' : 'Get NyayaPass Key Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Step Information Workflow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-[#0A2540] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <div>
                <strong className="block text-slate-900 font-bold">{isHi ? '1-क्लिक आधार सत्यापन' : 'UIDAI Aadhaar Check'}</strong>
                <span className="text-slate-600 text-[11px]">{isHi ? 'सुरक्षित 256-बिट नागरिक पहचान सत्यापन' : '256-bit encrypted citizen verification'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-[#0A2540] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <div>
                <strong className="block text-slate-900 font-bold">{isHi ? 'विशिष्ट Key आवंटन' : 'Unique Key Issued'}</strong>
                <span className="text-slate-600 text-[11px]">{isHi ? 'स्थायी NyayaPass Key (NP-2026-XXXX)' : 'Lifetime digital pass key generated'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-[#0A2540] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <div>
                <strong className="block text-slate-900 font-bold">{isHi ? 'पूर्ण कानूनी पहुंच' : '100% Sovereign Access'}</strong>
                <span className="text-slate-600 text-[11px]">{isHi ? 'निदान, नोटिस ड्राफ्टिंग एवं सरकारी योजनाएं' : 'Full AI legal triage & pre-litigation drafting'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProtectedFeatureGate;
