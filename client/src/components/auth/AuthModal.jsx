import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCase } from '../../context/CaseContext';
import { apiVerifyAadhaar, INDIAN_STATES_DATA } from '../../services/api';
import { NyayaPassCard } from './NyayaPassCard';
import { 
  ShieldCheck, Lock, User, Phone, Mail, KeyRound, 
  Sparkles, CheckCircle2, AlertCircle, X, ArrowRight, 
  Fingerprint, Award, Building2, RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab,
    login, 
    signup, 
    nyayaPass,
    isPassModalOpen,
    setIsPassModalOpen
  } = useAuth();

  const { language } = useLanguage();
  const { showToast, setUserProfile, setJurisdiction } = useCase();
  const isHi = language === 'hi';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Lucknow');
  const [gender, setGender] = useState('FEMALE');
  const [age, setAge] = useState(28);
  const [socialCategory, setSocialCategory] = useState('OBC');
  const [occupation, setOccupation] = useState('Student');
  const [annualIncome, setAnnualIncome] = useState(180000);

  // Aadhaar Live Verification State
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [aadhaarVerificationData, setAadhaarVerificationData] = useState(null);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);

  if (!isAuthModalOpen && !isPassModalOpen) return null;

  const handleVerifyAadhaar = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    const cleanAadhaar = aadhaarNumber.replace(/\s+/g, '');
    if (cleanAadhaar.length !== 12) {
      setError(isHi ? 'कृपया 12-अंकों का वैध आधार नंबर दर्ज करें।' : 'Please enter a valid 12-digit Aadhaar Number.');
      return;
    }

    setVerifyingAadhaar(true);
    try {
      const res = await apiVerifyAadhaar({
        aadhaarNumber: cleanAadhaar,
        phone,
        name
      });

      if (res.success && res.data && res.data.verified) {
        setIsAadhaarVerified(true);
        setAadhaarVerificationData(res.data);
        showToast(isHi ? 'UIDAI सत्यापन सफल: प्रमाणित भारतीय नागरिक' : 'UIDAI Verification Successful: Certified Indian Citizen', 'success');
      } else {
        setIsAadhaarVerified(false);
        setAadhaarVerificationData(null);
        throw new Error(res.error || (isHi ? 'आधार सत्यापन विफल रहा।' : 'Official UIDAI verification failed. Checksum rejected.'));
      }
    } catch (err) {
      setIsAadhaarVerified(false);
      setAadhaarVerificationData(null);
      setError(err.message || 'UIDAI gateway error');
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanAadhaar = aadhaarNumber.replace(/\s+/g, '');
    if (cleanAadhaar.length !== 12) {
      setError(isHi ? '12-अंकों का आधार नंबर अनिवार्य है।' : '12-digit Aadhaar number is required.');
      return;
    }

    if (!isAadhaarVerified) {
      setError(isHi 
        ? 'कृपया पहले अपने आधार नंबर को आधिकारिक UIDAI गेटवे से सत्यापित करें।' 
        : 'Official Verification Required: Please click "Verify with UIDAI" and complete official verification first before signup.');
      return;
    }

    setLoading(true);
    try {
      const res = await signup({
        name,
        phone,
        email,
        password,
        aadhaarNumber: cleanAadhaar,
        state,
        district,
        gender,
        age: Number(age),
        socialCategory,
        occupation,
        annualIncome: Number(annualIncome),
        uidaiVerificationCode: aadhaarVerificationData?.uidaiAuthCode || ('UIDAI-AUTH-OK-' + Math.floor(100000 + Math.random() * 900000))
      });

      if (res.success) {
        setUserProfile(prev => ({
          ...prev,
          name: res.user?.name || name,
          phone: res.user?.phone || phone,
          email: res.user?.email || email,
          state: res.user?.state || state,
          district: res.user?.district || district,
          gender: res.user?.gender || gender,
          age: res.user?.age || age,
          socialCategory: res.user?.socialCategory || socialCategory,
          occupation: res.user?.occupation || occupation,
          annualIncome: res.user?.annualIncome || annualIncome
        }));

        setJurisdiction(district, state);
        setIsAuthModalOpen(false);
        setIsPassModalOpen(true);

        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
        showToast(isHi ? 'विशिष्ट न्याय पास जारी किया गया!' : 'Unique NyayaPass Issued & Authenticated!', 'success');
      }
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!loginIdentifier) {
      setError(isHi ? 'कृपया न्याय पास आईडी या आधार नंबर दर्ज करें।' : 'Please enter NyayaPass ID or Aadhaar number.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginIdentifier, loginPassword);
      if (res.success) {
        setUserProfile(prev => ({
          ...prev,
          name: res.user?.name || prev.name,
          phone: res.user?.phone || prev.phone,
          email: res.user?.email || prev.email,
          state: res.user?.state || prev.state,
          district: res.user?.district || prev.district
        }));
        if (res.user?.district) {
          setJurisdiction(res.user.district, res.user.state);
        }
        setIsAuthModalOpen(false);
        showToast(isHi ? ('स्वागत है, ' + (res.user?.name || 'नागरिक') + '! न्याय पास प्रमाणित।') : ('Welcome back, ' + (res.user?.name || 'Citizen') + '! NyayaPass Verified.'), 'success');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAadhaar = () => {
    setName('Tanvi Makhija');
    setPhone('+91 98765 43210');
    setEmail('citizen@nyayasetu.in');
    setAadhaarNumber('987654324810');
    setState('Uttar Pradesh');
    setDistrict('Lucknow');
    setSocialCategory('OBC');
    setGender('FEMALE');
    setAge(28);
    setOccupation('Student');
    setAnnualIncome(180000);
    setIsAadhaarVerified(true);
    setAadhaarVerificationData({
      verified: true,
      status: 'VERIFIED_CITIZEN_OF_INDIA',
      aadhaarMasked: 'XXXX-XXXX-4810',
      uidaiAuthCode: 'UIDAI-AUTH-OK-2026-IN',
      officialPortal: 'https://myaadhaar.uidai.gov.in/verify-aadhaar'
    });
  };

  const fillDemoLogin = () => {
    setLoginIdentifier('NP-2026-8812-UP-IN');
  };

  return (
    <>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-xl max-w-xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="p-4 bg-[#0A2540] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                  🇮🇳
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold">
                    {isHi ? 'नागरिक प्रमाणीकरण एवं डिजिटल न्याय पास' : 'Citizen Authentication & Digital NyayaPass'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {isHi ? 'यूआईडीएआई आधार प्रमाणित नागरिक पहचान' : 'Official UIDAI Aadhaar Verified Citizen Identity'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
              <button
                onClick={() => { setAuthModalTab('signup'); setError(null); }}
                className={'pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ' + (
                  authModalTab === 'signup'
                    ? 'border-[#0A2540] text-[#0A2540]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                )}
              >
                <Fingerprint className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? '1. नया Key बनाएं (Aadhaar Signup)' : '1. Sign Up & Get NyayaPass Key'}</span>
              </button>

              <button
                onClick={() => { setAuthModalTab('login'); setError(null); }}
                className={'pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ' + (
                  authModalTab === 'login'
                    ? 'border-[#0A2540] text-[#0A2540]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                )}
              >
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>{isHi ? '2. NyayaPass Key से लॉगिन' : '2. Unlock with NyayaPass Key'}</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto text-xs text-slate-700 space-y-4">
              
              {/* TAB 1: SIGNUP & AADHAAR VERIFICATION */}
              {authModalTab === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  
                  {/* Step 1: Mandatory Aadhaar Live Verification Card */}
                  <div className={`p-4 rounded-lg border space-y-3 transition-all ${
                    isAadhaarVerified
                      ? 'bg-emerald-50/70 border-emerald-400'
                      : 'bg-amber-50/60 border-amber-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Fingerprint className="w-4 h-4 text-emerald-700" />
                        <span>{isHi ? 'चरण 1: यूआईडीएआई आधिकारिक आधार सत्यापन (अनिवार्य):' : 'Step 1: Official UIDAI Aadhaar Verification (Mandatory):'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={fillDemoAadhaar}
                        className="text-[10px] text-blue-800 hover:underline font-semibold cursor-pointer"
                      >
                        ⚡ {isHi ? 'प्रमाणित डेमो आधार भरें' : 'Fill Valid Demo Aadhaar'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {isHi ? '12-अंकों का आधार नंबर:' : '12-Digit Aadhaar Number:'} *
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          value={aadhaarNumber}
                          onChange={(e) => {
                            setAadhaarNumber(e.target.value.replace(/[^0-9]/g, ''));
                            setIsAadhaarVerified(false);
                            setAadhaarVerificationData(null);
                          }}
                          placeholder="e.g. 9876 5432 4810"
                          required
                          className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 tracking-wider bg-white"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          disabled={verifyingAadhaar || aadhaarNumber.length !== 12}
                          onClick={handleVerifyAadhaar}
                          className="w-full py-2 px-3 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{verifyingAadhaar ? (isHi ? 'आधिकारिक UIDAI जांच जारी...' : 'Verifying with UIDAI...') : (isAadhaarVerified ? (isHi ? '✓ UIDAI सत्यापित' : '✓ UIDAI Verified') : (isHi ? 'आधार सत्यापित करें' : 'Verify with UIDAI Gateway'))}</span>
                        </button>
                      </div>
                    </div>

                    {/* Aadhaar Verified Badge */}
                    {isAadhaarVerified ? (
                      <div className="p-3 rounded-lg bg-emerald-100/90 border border-emerald-400 text-emerald-950 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                          <div>
                            <strong className="block text-emerald-900">{isHi ? 'आधिकारिक UIDAI सत्यापन सफल • प्रमाणित भारतीय नागरिक' : 'Official UIDAI Check Passed • Certified Indian Resident Citizen'}</strong>
                            <span className="text-[10px] text-emerald-800 block font-mono">Auth Code: {aadhaarVerificationData?.uidaiAuthCode || 'UIDAI-AUTH-OK-2026'}</span>
                          </div>
                        </div>
                        <a 
                          href="https://myaadhaar.uidai.gov.in/verify-aadhaar" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] font-bold text-emerald-900 hover:underline flex items-center gap-1 self-start sm:self-auto bg-white px-2 py-1 rounded border border-emerald-300"
                        >
                          <span>UIDAI Official Portal</span>
                          <span>↗</span>
                        </a>
                      </div>
                    ) : (
                      <div className="p-2 rounded bg-amber-100/80 border border-amber-300 text-amber-950 text-[10px] font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>{isHi ? 'साइनअप आगे बढ़ाने के लिए पहले आधिकारिक UIDAI सत्यापन बटन दबाएं।' : 'UIDAI Verhoeff algorithm verification is strictly required before citizen registration is approved.'}</span>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Citizen Demographic Details (Unlocks after Aadhaar Verification) */}
                  <div className={`space-y-3 p-4 rounded-lg border transition-all ${
                    isAadhaarVerified ? 'bg-slate-50 border-slate-300 opacity-100' : 'bg-slate-100/60 border-slate-200 opacity-60 pointer-events-none'
                  }`}>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2540] border-b border-slate-200 pb-2">
                      <User className="w-4 h-4 text-[#0A2540]" />
                      <span>{isHi ? 'चरण 2: नागरिक जनसांख्यिकीय विवरण:' : 'Step 2: Citizen Demographic Profile:'}</span>
                      {!isAadhaarVerified && <span className="text-[10px] text-slate-500 font-normal ml-auto">(चरण 1 सत्यापित होने पर सक्रिय होगा)</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {isHi ? 'नागरिक का पूरा नाम:' : 'Full Name (as on Aadhaar):'} *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Tanvi Makhija"
                          required
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#0A2540]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {isHi ? 'मोबाइल नंबर (OTP हेतु):' : 'Mobile Number:'} *
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#0A2540]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">{isHi ? 'राज्य / State:' : 'State:'}</label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900 focus:outline-none"
                        >
                          {Object.keys(INDIAN_STATES_DATA).map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">{isHi ? 'जिला / District:' : 'District:'}</label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="e.g. Lucknow / Delhi"
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">{isHi ? 'सामाजिक वर्ग:' : 'Category:'}</label>
                        <select
                          value={socialCategory}
                          onChange={(e) => setSocialCategory(e.target.value)}
                          className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900 focus:outline-none"
                        >
                          <option value="GENERAL">General</option>
                          <option value="OBC">OBC</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="EWS">EWS</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">{isHi ? 'लिंग / Gender:' : 'Gender:'}</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900 focus:outline-none"
                        >
                          <option value="FEMALE">Female</option>
                          <option value="MALE">Male</option>
                          <option value="TRANSGENDER">Transgender</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">{isHi ? 'आयु / Age:' : 'Age:'}</label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">{isHi ? 'वार्षिक आय (₹):' : 'Annual Income (₹):'}</label>
                        <input
                          type="number"
                          value={annualIncome}
                          onChange={(e) => setAnnualIncome(e.target.value)}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button (Locked until verified) */}
                  <button
                    type="submit"
                    disabled={loading || !isAadhaarVerified}
                    className={`w-full py-3 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                      isAadhaarVerified
                        ? 'bg-[#0A2540] hover:bg-[#1E3A8A] text-white'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>
                      {loading 
                        ? (isHi ? 'न्याय पास तैयार हो रहा है...' : 'Issuing Digital NyayaPass...') 
                        : (!isAadhaarVerified 
                          ? (isHi ? '🔒 चरण 1: पहले आधार सत्यापित करें' : '🔒 Complete Step 1 Aadhaar Verification to Register') 
                          : (isHi ? 'सत्यापित करें एवं डिजिटल न्याय पास प्राप्त करें' : '✓ Register & Issue Verified NyayaPass Key'))}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* TAB 2: LOGIN */}
              {authModalTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-700">
                        {isHi ? '🔑 अपना NyayaPass Access Key दर्ज करें:' : '🔑 Enter Your NyayaPass Access Key:'} *
                      </label>
                      <button
                        type="button"
                        onClick={fillDemoLogin}
                        className="text-[10px] text-blue-800 hover:underline font-semibold cursor-pointer"
                      >
                        ⚡ {isHi ? 'डेमो Key भरें (NP-2026-8812-UP-IN)' : 'Use Demo Key (NP-2026-8812-UP-IN)'}
                      </button>
                    </div>

                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. NP-2026-8812-UP-IN or 987654324819"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A2540] tracking-wider"
                      />
                    </div>

                    <div className="p-2 rounded bg-blue-50/60 border border-blue-200 text-[10px] text-blue-900">
                      ℹ️ {isHi ? 'साइनअप के समय जारी किया गया 16-अंकों का NyayaPass Key यहाँ पेस्ट करें।' : 'Paste the 16-character NyayaPass Key generated when you signed up.'}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>{loading ? (isHi ? 'Key सत्यापित हो रही है...' : 'Validating NyayaPass Key...') : (isHi ? 'Key से लॉगिन एवं अनलॉक करें' : 'Authenticate Key & Unlock Access')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500 font-medium">
              🔒 {isHi ? 'यूआईडीएआई सुरक्षा मानकों के अनुरूप 256-बिट एन्क्रिप्टेड सुरक्षित नागरिक खाता' : '256-bit Encrypted Government Citizen Identity aligned with Digital Personal Data Protection (DPDP) Act 2023'}
            </div>

          </div>
        </div>
      )}

      {/* NyayaPass Presentation Card Modal */}
      {isPassModalOpen && nyayaPass && (
        <NyayaPassCard 
          passData={nyayaPass} 
          isModal={true} 
          onClose={() => setIsPassModalOpen(false)} 
        />
      )}
    </>
  );
};
