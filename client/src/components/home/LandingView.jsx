import React, { useState, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Scale, ShieldCheck, FileText, Camera, Award, MapPin, 
  Clock, BookOpen, ArrowRight, CheckCircle2, Building2, 
  PhoneCall, ExternalLink, HelpCircle, Sparkles, ChevronRight, 
  FileCheck, Users, Search, Lock, KeyRound, Fingerprint 
} from 'lucide-react';

import hero1 from '../../assets/hero/hero1.jpg';
import hero2 from '../../assets/hero/hero2.jpg';
import hero3 from '../../assets/hero/hero3.jpg';
import hero4 from '../../assets/hero/hero4.jpg';

const heroImages = [
  { src: hero1, alt: 'Lady Justice and Rule of Law' },
  { src: hero2, alt: 'Parliament House of India' },
  { src: hero3, alt: 'Citizen Empowerment and Civic Action' },
  { src: hero4, alt: 'New Parliament of India' }
];

export const LandingView = () => {
  const { setActiveTab, setCurrentGrievance } = useCase();
  const { language, t } = useLanguage();
  const { isAuthenticated, nyayaPassKey, openAuthModal } = useAuth();
  const isHi = language === 'hi';

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const quickCases = [
    {
      title: language === 'hi' ? "मकान मालिक ने ₹50,000 सिक्योरिटी डिपॉजिट रोका" : "Tenant Security Deposit Withheld",
      query: "My landlord has not returned my ₹50,000 security deposit even after 30 days of vacating with zero unpaid bills.",
      category: "Tenancy (Model Tenancy Act Sec 11)"
    },
    {
      title: language === 'hi' ? "ई-कॉमर्स खराब फोन का रिफंड अस्वीकार" : "E-Commerce Defective Product Refund",
      query: "Flipkart refused return and refund for damaged smartphone ₹19,999 saying return window is over.",
      category: "Consumer Protection (CPA 2019 Sec 35)"
    },
    {
      title: language === 'hi' ? "सड़क टेंडर व बजट पर RTI आवेदन" : "RTI on Substandard Road Budget",
      query: "The newly built PWD road broke within 3 months. I want certified copies of tender, contractor name and sanctioned funds.",
      category: "Right to Information (RTI Act Sec 6(1))"
    },
    {
      title: language === 'hi' ? "अस्पताल द्वारा आयुष्मान कैशलेस इलाज से इनकार" : "Hospital Cashless Admission Refusal",
      query: "Empanelled hospital refused emergency cashless admission under Ayushman Bharat and demanded ₹50,000 cash.",
      category: "Healthcare Rights (PM-JAY Charter)"
    }
  ];

  const handleQuickSearch = (query) => {
    setCurrentGrievance(query);
    setActiveTab('triage');
  };

  return (
    <div className="space-y-16 animate-fade-in pb-16">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200 pt-10 pb-16 bg-slate-50/50">
        {/* Sliding Background Photos */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <div 
            className="flex h-full w-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroImages.map((img, idx) => (
              <div key={idx} className="min-w-full h-full relative flex-shrink-0">
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover object-center opacity-60"
                />
              </div>
            ))}
          </div>
          {/* Frosted / Gradient Overlay for optimal text legibility and contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/45 to-white/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Key Authentication Status Banner */}
            {!isAuthenticated ? (
              <div className="inline-flex items-center justify-between gap-3 px-4 py-2 rounded-full bg-amber-50 border border-amber-300 text-xs text-amber-950 shadow-xs max-w-xl mx-auto">
                <span className="flex items-center gap-1.5 font-bold">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isHi ? 'नागरिक सुविधाएं अनलॉक करने के लिए NyayaPass Key अनिवार्य है' : 'NyayaPass Access Key required to unlock sovereign legal tools'}</span>
                </span>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-2.5 py-0.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-[10px] cursor-pointer"
                >
                  {isHi ? 'Key प्राप्त करें →' : 'Get Key →'}
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 shadow-xs text-xs font-bold text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? `प्रमाणित नागरिक Key सक्रिय: ${nyayaPassKey}` : `Verified Citizen Key Active: ${nyayaPassKey}`}</span>
              </div>
            )}

            {/* National Initiative Badge */}
            <div className="block">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-300 shadow-xs text-xs font-bold text-[#0A2540]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                <span>{t.heroBadge}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A2540] tracking-tight leading-tight">
              {t.heroTitle1} <br className="hidden sm:block" />
              <span className="text-[#1E3A8A]">{t.heroTitle2}</span>
            </h1>

            {/* Authoritative Subtext */}
            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl mx-auto">
              {t.heroSub}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('triage')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{language === 'hi' ? 'कानूनी निदान एवं अधिकार विश्लेषण' : 'AI Legal Diagnosis & Rights Analysis'}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => setActiveTab('wiki')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-700" />
                <span>{t.btnSecondaryCTA}</span>
              </button>
            </div>

            {/* Quick Benchmark Dispute Pills */}
            <div className="pt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">
                {t.benchmarkDisputesLabel}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {quickCases.map((qc, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSearch(qc.query)}
                    className="text-xs bg-white hover:bg-slate-100 text-slate-800 font-semibold px-3.5 py-2 rounded-full border border-slate-300 shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5 text-slate-600" />
                    <span>{qc.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Slider Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-3">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-6 bg-[#0A2540]' : 'w-2 bg-slate-400/50 hover:bg-slate-600'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: HOW NAYAAYSETU WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block mb-1">
            {t.pipelineBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
            {t.pipelineTitle}
          </h2>
          <p className="text-sm text-slate-700 mt-2">
            {t.pipelineSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div className="gov-card p-6 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-[#0A2540] text-white font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-[#0A2540]">{t.step1Title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-bold text-[#0A2540]">
              {t.step1Tag}
            </div>
          </div>

          {/* Step 2 */}
          <div className="gov-card p-6 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-[#0A2540] text-white font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-[#0A2540]">{t.step2Title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-bold text-[#0A2540]">
              {t.step2Tag}
            </div>
          </div>

          {/* Step 3 */}
          <div className="gov-card p-6 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-[#0A2540] text-white font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-[#0A2540]">{t.step3Title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-bold text-[#0A2540]">
              {t.step3Tag}
            </div>
          </div>

          {/* Step 4 */}
          <div className="gov-card p-6 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-[#0A2540] text-white font-bold text-sm flex items-center justify-center">
                4
              </div>
              <h3 className="text-base font-bold text-[#0A2540]">{t.step4Title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step4Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-bold text-[#0A2540]">
              {t.step4Tag}
            </div>
          </div>

        </div>

      </section>

      {/* SECTION 3: CAPABILITIES MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block mb-1">
            {t.matrixBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">
            {t.matrixTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Legal Diagnosis */}
          <div 
            onClick={() => setActiveTab('triage')}
            className="gov-card gov-card-hover p-6 cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0A2540]">{t.mod1Title}</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {t.mod1Desc}
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-[#1E3A8A] gap-1">
              <span>{t.mod1Action}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Document OCR */}
          <div 
            onClick={() => setActiveTab('evidence')}
            className="gov-card gov-card-hover p-6 cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0A2540]">{t.mod2Title}</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {t.mod2Desc}
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-[#059669] gap-1">
              <span>{t.mod2Action}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Notice Drafting Studio */}
          <div 
            onClick={() => setActiveTab('drafting')}
            className="gov-card gov-card-hover p-6 cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0A2540]">{t.mod3Title}</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {t.mod3Desc}
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-[#D97706] gap-1">
              <span>{t.mod3Action}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Scheme Matcher */}
          <div 
            onClick={() => setActiveTab('schemes')}
            className="gov-card gov-card-hover p-6 cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded bg-purple-50 text-purple-900 border border-purple-200 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0A2540]">{t.mod4Title}</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {t.mod4Desc}
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-purple-900 gap-1">
              <span>{t.mod4Action}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 5: Jurisdiction Directory */}
          <div 
            onClick={() => setActiveTab('jurisdiction')}
            className="gov-card gov-card-hover p-6 cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded bg-teal-50 text-teal-900 border border-teal-200 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0A2540]">{t.mod5Title}</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {t.mod5Desc}
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-teal-900 gap-1">
              <span>{t.mod5Action}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 6: Statutory Limitation Tracker */}
          <div 
            onClick={() => setActiveTab('tracker')}
            className="gov-card gov-card-hover p-6 cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded bg-slate-100 text-slate-900 border border-slate-300 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0A2540]">{t.mod6Title}</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {t.mod6Desc}
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-slate-800 gap-1">
              <span>{t.mod6Action}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </section>

      {/* SECTION 4: IMPORTANT GOVERNMENT & CIVIC PORTALS */}
      <section className="bg-slate-100/80 border-y border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block mb-1">
                {t.portalsBadge}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0A2540]">
                {t.portalsTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 max-w-md">
              {t.portalsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <a 
              href="https://www.india.gov.in/category/justice-law-grievances/subcategory/courts-tribunals/details/e-daakhil-portal" 
              target="_blank" 
              rel="noreferrer" 
              className="gov-card p-4 hover:border-slate-400 block group transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0A2540]">{t.p1Name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900" />
              </div>
              <p className="text-xs text-slate-700">
                {t.p1Desc}
              </p>
            </a>

            <a 
              href="https://rtionline.gov.in" 
              target="_blank" 
              rel="noreferrer" 
              className="gov-card p-4 hover:border-slate-400 block group transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0A2540]">{t.p2Name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900" />
              </div>
              <p className="text-xs text-slate-700">
                {t.p2Desc}
              </p>
            </a>

            <a 
              href="https://nalsa.gov.in" 
              target="_blank" 
              rel="noreferrer" 
              className="gov-card p-4 hover:border-slate-400 block group transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0A2540]">{t.p3Name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900" />
              </div>
              <p className="text-xs text-slate-700">
                {t.p3Desc}
              </p>
            </a>

            <a 
              href="https://pgportal.gov.in" 
              target="_blank" 
              rel="noreferrer" 
              className="gov-card p-4 hover:border-slate-400 block group transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0A2540]">{t.p4Name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900" />
              </div>
              <p className="text-xs text-slate-700">
                {t.p4Desc}
              </p>
            </a>

          </div>

        </div>
      </section>

      {/* SECTION 5: TRUST, ACCESSIBILITY & STATUTORY DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gov-card p-8 border-l-4 border-l-[#0A2540] space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#059669]" />
            <h3 className="text-base font-bold text-[#0A2540]">
              {t.trustTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {t.trustDesc}
          </p>
        </div>
      </section>

    </div>
  );
};
