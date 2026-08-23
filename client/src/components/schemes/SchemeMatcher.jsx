import React, { useState, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiEvaluateSchemes, INDIAN_STATES_DATA } from '../../services/api';
import { SchemeCard } from './SchemeCard';
import { LoadingGavel } from '../common/LoadingGavel';
import { 
  Award, Sparkles, Filter, CheckCircle2, User, 
  IndianRupee, MapPin, Layers, RefreshCw, Sliders, Info 
} from 'lucide-react';

export const SchemeMatcher = () => {
  const { userProfile, setUserProfile, showToast } = useCase();
  const { language, t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [schemesResult, setSchemesResult] = useState(null);

  const [age, setAge] = useState(userProfile.age || 28);
  const [occupation, setOccupation] = useState(userProfile.occupation || 'Student');
  const [annualIncome, setAnnualIncome] = useState(userProfile.annualIncome || 180000);
  const [state, setState] = useState(userProfile.state || 'Uttar Pradesh');
  const [socialCategory, setSocialCategory] = useState(userProfile.socialCategory || 'OBC');
  const [ownedDocs, setOwnedDocs] = useState(userProfile.ownedDocuments || ['DOC_AADHAAR', 'DOC_BANK_PASSBOOK']);

  const allDocumentsCatalog = [
    { code: 'DOC_AADHAAR', name: t.docAadhaar || 'Aadhaar Card' },
    { code: 'DOC_BANK_PASSBOOK', name: t.docPassbook || 'Bank Passbook (NPCI Seeded)' },
    { code: 'DOC_RATION', name: t.docRation || 'Ration Card (NFSA / BPL)' },
    { code: 'DOC_INCOME', name: t.docIncome || 'Income Certificate (< ₹2.5L)' },
    { code: 'DOC_DOMICILE', name: t.docDomicile || 'Domicile / Niwas Praman Patra' },
    { code: 'DOC_CASTE', name: t.docCaste || 'Caste Certificate (OBC/SC/ST)' },
    { code: 'DOC_LAND_KHATAUNI', name: t.docLand || 'Land Record (Khatauni / RoR)' },
    { code: 'DOC_VENDOR_VENDING_CERT', name: t.docVendor || 'Vending Certificate / LoR' },
  ];

  const incomeMilestones = [
    { label: '₹1.2L (BPL)', val: 120000 },
    { label: '₹2.5L (Ayushman/Legal Aid)', val: 250000 },
    { label: '₹5.0L (Tax Exempt)', val: 500000 },
    { label: '₹8.0L (EWS Cap)', val: 800000 },
    { label: '₹12.0L', val: 1200000 },
  ];

  const getIncomeCategory = (val) => {
    if (val <= 120000) return { label: t.catBPL || 'BPL / Antyodaya Priority', color: 'bg-red-50 text-red-800 border-red-200' };
    if (val <= 250000) return { label: t.catLowIncome || 'Low Income (Free Legal Aid & PM-JAY Eligible)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (val <= 500000) return { label: t.catMarginal || 'Marginal Income (Scholarship & Subsidy Eligible)', color: 'bg-blue-50 text-blue-800 border-blue-200' };
    if (val <= 800000) return { label: t.catEWSThreshold || 'EWS Threshold (Under ₹8 Lakhs)', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: t.catMiddleIncome || 'Middle / General Income', color: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  const handleDocToggle = (code) => {
    if (ownedDocs.includes(code)) {
      setOwnedDocs(ownedDocs.filter(d => d !== code));
    } else {
      setOwnedDocs([...ownedDocs, code]);
    }
  };

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await apiEvaluateSchemes({
        age: Number(age),
        occupation,
        annualIncome: Number(annualIncome),
        state,
        socialCategory,
        ownedDocuments: ownedDocs
      });

      if (res.success) {
        setSchemesResult(res);
        setUserProfile(prev => ({
          ...prev,
          age,
          occupation,
          annualIncome,
          state,
          socialCategory,
          ownedDocuments: ownedDocs
        }));
        showToast('Welfare scheme eligibility evaluated.', 'success');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleEvaluate();
  }, []);

  const category = getIncomeCategory(annualIncome);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* Header */}
      <div className="gov-card p-6 bg-gradient-to-r from-slate-50 to-slate-100/60 border-slate-300">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-800 block mb-1">
          {t.schemeTitle}
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540]">
          {t.schemeTitle}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {t.schemeSub}
        </p>
      </div>

      {/* Profile Demographic Builder */}
      <div className="gov-card p-6 border-slate-300 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#D97706]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
              {t.profileTitle || 'Citizen Demographic Profile & Document Bank'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">{t.anonymousAudit || '100% Anonymous Public Audit'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Age */}
          <div>
            <label className="text-xs text-slate-700 block mb-1 font-semibold">{t.ageLabel || 'Age (Years)'}</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="text-xs text-slate-700 block mb-1 font-semibold">{t.occupationLabel || 'Occupation / Category'}</label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
            >
              <option value="Student">{t.occStudent || 'Student / Higher Education Aspirant'}</option>
              <option value="Farmer">{t.occFarmer || 'Farmer / Agricultural Landholder'}</option>
              <option value="Street Vendor">{t.occVendor || 'Street Vendor / Urban Hawker'}</option>
              <option value="Daily Wage">{t.occDailyWage || 'Daily Wage / Construction Labor'}</option>
              <option value="Gig Worker">{t.occGigWorker || 'Gig Worker / Delivery Executive'}</option>
              <option value="Senior Citizen">{t.occSeniorCitizen || 'Senior Citizen (60+ Years)'}</option>
              <option value="Artisan">{t.occArtisan || 'Artisan / Handloom Weaver'}</option>
              <option value="Unorganized Worker">{t.occUnorganized || 'Unorganized Informal Worker'}</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="text-xs text-slate-700 block mb-1 font-semibold">{t.domicileStateLabel || 'Domicile State'}</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
            >
              {Object.keys(INDIAN_STATES_DATA).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
              <option value="All">{t.allIndiaSchemes || 'All India (Central Schemes)'}</option>
            </select>
          </div>

          {/* Social Category */}
          <div>
            <label className="text-xs text-slate-700 block mb-1 font-semibold">{t.socialCategoryLabel || 'Social Category'}</label>
            <select
              value={socialCategory}
              onChange={(e) => setSocialCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
            >
              <option value="General">{t.catGeneral || 'General'}</option>
              <option value="OBC">{t.catOBC || 'OBC (Other Backward Classes)'}</option>
              <option value="SC">{t.catSC || 'SC (Scheduled Caste)'}</option>
              <option value="ST">{t.catST || 'ST (Scheduled Tribe)'}</option>
              <option value="EWS">{t.catEWS || 'EWS (Economically Weaker Section)'}</option>
            </select>
          </div>

        </div>

        {/* INTERACTIVE ANNUAL HOUSEHOLD INCOME RANGE SLIDER / SCROLLBAR */}
        <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0A2540]" />
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                {t.incomeSliderLabel || 'Annual Household Income Scrollbar & Slider'}
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${category.color}`}>
                {category.label}
              </span>
              <div className="text-sm font-extrabold text-[#0A2540] bg-white px-3 py-1 rounded border border-slate-300 shadow-2xs font-mono">
                ₹{annualIncome.toLocaleString('en-IN')} {t.perYear || '/ yr'}
              </div>
            </div>
          </div>

          {/* Main Range Slider Input */}
          <div className="space-y-2">
            <input
              type="range"
              min={30000}
              max={1500000}
              step={10000}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0A2540] focus:outline-none"
            />

            {/* Scale Endpoints */}
            <div className="flex justify-between text-[11px] font-bold text-slate-500 font-mono">
              <span>₹30,000</span>
              <span>₹2,50,000 {t.govtAidLimit || '(Govt Aid Limit)'}</span>
              <span>₹8,00,000 {t.ewsCap || '(EWS Cap)'}</span>
              <span>₹15,00,000+</span>
            </div>
          </div>

          {/* Quick Preset Milestones */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600">{t.quickSelect || 'Quick Select:'}</span>
            {incomeMilestones.map((m) => (
              <button
                key={m.val}
                type="button"
                onClick={() => setAnnualIncome(m.val)}
                className={`text-[11px] px-2.5 py-1 rounded border font-semibold transition-all cursor-pointer ${
                  annualIncome === m.val
                    ? 'bg-[#0A2540] text-white border-[#0A2540]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

        </div>

        {/* Owned Documents Checklist */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#0A2540] block">
            {t.selectDocsInHand || 'Select Documents Currently in Your Possession (for Gap Analysis):'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {allDocumentsCatalog.map((doc) => {
              const isChecked = ownedDocs.includes(doc.code);
              return (
                <button
                  key={doc.code}
                  type="button"
                  onClick={() => handleDocToggle(doc.code)}
                  className={`p-2 rounded text-left text-xs border flex items-center gap-2 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-[#059669]' : 'text-slate-400'}`} />
                  <span className="truncate">{doc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Evaluate Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t.btnEvaluateProfile || 'Evaluate Scheme Eligibility'}</span>
          </button>
        </div>

      </div>

      {/* Loading */}
      {loading && <LoadingGavel message="Evaluating criteria across 15+ Central & State Welfare Schemes..." />}

      {/* Results */}
      {!loading && schemesResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#059669]" />
              <span>{t.matchedSchemesCount || 'Matched Welfare Schemes'} ({schemesResult.eligibleCount} {t.qualifiedCount || 'Qualified'})</span>
            </h3>
            <span className="text-xs text-slate-600 font-medium">
              {t.evaluatedFor || 'Evaluated for:'} <strong className="text-slate-900">{occupation} (₹{annualIncome.toLocaleString('en-IN')}{t.perYear || '/yr'}, {state})</strong>
            </span>
          </div>

          <div className="space-y-4">
            {schemesResult.schemes?.map((scheme) => (
              <SchemeCard key={scheme.schemeId} scheme={scheme} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
