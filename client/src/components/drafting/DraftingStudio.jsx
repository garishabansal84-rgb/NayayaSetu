import React, { useState, useEffect, useMemo } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiGenerateDraft } from '../../services/api';
import { PDFPreviewModal } from './PDFPreviewModal';
import { LegalDispatchRelayModal } from './LegalDispatchRelayModal';
import { LoadingGavel } from '../common/LoadingGavel';
import { 
  FileText, Shield, Sparkles, Send, Download, 
  CheckCircle, ArrowRight, BookOpen, RefreshCw, Scale, Share2, MessageSquare, Mail 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DraftingStudio = () => {
  const { 
    currentDiagnosis, 
    currentReferenceId, 
    evidenceData, 
    userProfile, 
    activeDraft, 
    setActiveDraft,
    selectedDistrict,
    selectedState,
    showToast 
  } = useCase();

  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);

  const TEMPLATE_CONFIGS = useMemo(() => ({
    CONSUMER_NOTICE: {
      id: 'CONSUMER_NOTICE',
      title: t.consumerNoticeTitle || 'Consumer Legal Notice',
      act: 'CPA 2019 (Sec 35)',
      statuteBadge: 'Section 35, Consumer Protection Act 2019',
      cureWindow: t.cureWindow15Days || '15-Day Statutory Cure Period',
      description: t.consumerNoticeDesc || 'Formal pre-litigation legal notice served on companies/sellers before approaching District Consumer Disputes Redressal Commission (DCDRC).',
      getDefaults: (diag) => ({
        authorityName: diag?.oppositeParty || diag?.counterParty || 'Flipkart India Pvt Ltd & RetailNet Seller',
        authorityAddress: 'Outer Ring Road, Devarabeesanahalli, Bengaluru, Karnataka - 560103',
        subject: diag?.disputeTitle 
          ? `Formal Statutory Legal Notice under Section 35 of CPA 2019: ${diag.disputeTitle}`
          : 'Formal Statutory Legal Notice under Section 35 of CPA 2019 (Ref: Defective Goods / Refund)',
        facts: diag?.summary || 'The applicant purchased a smartphone for ₹19,999 on 12/08/2026. The package was delivered with a broken display. Customer support arbitrarily rejected return within the mandatory warranty window.',
        prayer: diag?.remedy?.reliefClaim 
          ? `Immediate full refund and compensation: ${diag.remedy.reliefClaim} within mandatory 15-day statutory window.`
          : 'Immediate refund of ₹19,999 along with ₹10,000 compensation for mental harassment and litigation expenses within 15 days of receipt of this notice.'
      })
    },
    RTI_APPLICATION: {
      id: 'RTI_APPLICATION',
      title: t.rtiAppTitle || 'RTI Application Form',
      act: 'RTI Act 2005 (Sec 6(1))',
      statuteBadge: 'Section 6(1) & 7(1), Right to Information Act 2005',
      cureWindow: t.cureWindow30Days || '30-Day Mandatory Disclosure Timeline',
      description: t.rtiAppDesc || 'Statutory application to Public Information Officer (PIO) demanding certified copies of government records, public works data, and budget allocations.',
      getDefaults: (diag) => ({
        authorityName: diag?.category === 'RTI Application' && (diag?.oppositeParty || diag?.counterParty) 
          ? (diag.oppositeParty || diag.counterParty) 
          : 'The Public Information Officer (PIO), Public Works Department (PWD)',
        authorityAddress: 'Office of the Superintending Engineer / Designated PIO Cell, Lucknow - 226001',
        subject: 'Application for Certified Public Records under Section 6(1) of Right to Information Act, 2005',
        facts: diag?.category === 'RTI Application' && diag?.summary 
          ? diag.summary 
          : 'The applicant seeks certified copies of tender agreements, contractor work orders, sanctioned budgets, and quality inspection test reports for public road construction in Ward No. 14 executed during 2025-2026.',
        prayer: 'Please furnish certified physical and digital copies of the requested information within the mandatory statutory timeline of 30 days under Section 7(1) of the RTI Act 2005. Requisite application fee of ₹10 is enclosed herewith.'
      })
    },
    TENANCY_NOTICE: {
      id: 'TENANCY_NOTICE',
      title: t.tenancyNoticeTitle || 'Tenancy Deposit Demand',
      act: 'Model Tenancy Act (Sec 11)',
      statuteBadge: 'Section 11 & Section 30, Model Tenancy Act 2021',
      cureWindow: t.cureWindow15Days || '15-Day Statutory Cure Period',
      description: t.tenancyNoticeDesc || 'Formal statutory demand notice served on landlord for unlawful withholding or arbitrary deductions of rental security deposit.',
      getDefaults: (diag) => ({
        authorityName: diag?.category === 'Tenancy & Housing' && (diag?.oppositeParty || diag?.counterParty) 
          ? (diag.oppositeParty || diag.counterParty) 
          : 'The Property Owner / Landlord',
        authorityAddress: 'Flat No. 402, Shanti Vihar Apartments, Indiranagar, Lucknow - 226016',
        subject: 'Formal Statutory Demand Notice for Unconditional Refund of Security Deposit under Model Tenancy Act, 2021',
        facts: diag?.category === 'Tenancy & Housing' && diag?.summary 
          ? diag.summary 
          : 'The applicant vacated the rented apartment upon serving a 1-month prior written notice and completed full handover of keys with zero pending utility bills. The landlord has unlawfully retained the ₹50,000 security deposit without furnishing verified GST maintenance invoices.',
        prayer: 'Immediate unconditional refund of the withheld ₹50,000 security deposit along with 12% p.a. penal interest within 15 days of this notice, failing which summary recovery proceedings before the Rent Authority (SDM) under Section 30 will be initiated.'
      })
    },
    CPGRAMS_PETITION: {
      id: 'CPGRAMS_PETITION',
      title: t.publicGrievanceTitle || 'Public Grievance Petition',
      act: 'DARPG Charter',
      statuteBadge: 'DARPG Public Grievance Charter & Article 21 Constitution',
      cureWindow: t.cureWindow21Days || '21-Day Redressal SLA',
      description: t.publicGrievanceDesc || 'Administrative grievance petition addressed to central/state grievance nodal officers for administrative defaults and public healthcare violations.',
      getDefaults: (diag) => ({
        authorityName: diag?.category === 'Civic & Municipal' && (diag?.oppositeParty || diag?.counterParty) 
          ? (diag.oppositeParty || diag.counterParty) 
          : 'The Nodal Public Grievance Officer, DARPG / Ministry of Health & Family Welfare',
        authorityAddress: 'Central Public Grievance Redressal Cell, New Delhi - 110001',
        subject: 'Citizen Grievance Petition for Urgent Administrative Intervention (Ref: Ayushman Bharat / Civic Rights)',
        facts: diag?.category === 'Civic & Municipal' && diag?.summary 
          ? diag.summary 
          : 'The applicant encountered severe administrative failure regarding emergency medical care denial under Ayushman Bharat (PM-JAY) and unlawful cash deposit demands in clear breach of central hospital empanelment norms.',
        prayer: 'Immediate administrative inquiry against the defaulting authorities, enforcement of cashless reimbursement, and punitive compliance action within 21 days as mandated by DARPG Citizen Charter.'
      })
    },
    POLICE_COMPLAINT_FIR: {
      id: 'POLICE_COMPLAINT_FIR',
      title: language === 'hi' ? 'आपराधिक शिकायत एवं एफआईआर प्रार्थना पत्र' : 'Criminal FIR Complaint & Police Petition',
      act: 'BNS 2023 / BNSS (Sec 173)',
      statuteBadge: 'Section 173 BNSS, Section 80 & 85 BNS, Dowry Prohibition Act & Section 118 BSA',
      cureWindow: 'Immediate 24-Hour FIR & SDM Inquest Mandate',
      description: 'Formal criminal complaint submitted to Station House Officer (SHO) / Superintendent of Police / SDM for Dowry Death, Cruelty, Domestic Violence, or Cognizable Crimes.',
      getDefaults: (diag) => ({
        authorityName: diag?.category?.includes('Women') || diag?.category?.includes('Criminal')
          ? 'The Station House Officer (SHO) / Sub-Divisional Magistrate (SDM) / Superintendent of Police'
          : 'The Station House Officer (SHO), Local Police Station',
        authorityAddress: 'Police Station / SDM Court / District SP Office, India',
        subject: diag?.disputeTitle 
          ? `CRIMINAL COMPLAINT FOR IMMEDIATE REGISTRATION OF FIR: ${diag.disputeTitle}`
          : 'CRIMINAL COMPLAINT FOR IMMEDIATE REGISTRATION OF FIR UNDER SECTIONS 80 & 85 BNS, DOWRY PROHIBITION ACT & SECTION 196 BNSS SDM INQUEST',
        facts: diag?.summary || 'The deceased woman was married within the past 7 years. The husband and in-laws repeatedly harassed and tortured her with demands for ₹5,00,000 cash and a motor car, leading to her unnatural death under suspicious circumstances.',
        prayer: 'Immediate registration of FIR under Section 80 (Dowry Death) and Section 85 BNS, arrest of all named accused persons, mandatory SDM Inquest under Section 196 BNSS, preservation of post-mortem viscera, and recovery of all Stridhan properties under Section 6 Dowry Prohibition Act.'
      })
    },
    HOSPITAL_EMERGENCY_NOTICE: {
      id: 'HOSPITAL_EMERGENCY_NOTICE',
      title: language === 'hi' ? 'अस्पताल आपातकालीन वैधानिक नोटिस' : 'Hospital Emergency Statutory Notice',
      act: 'MVA Sec 134(a) & Clinical Act',
      statuteBadge: 'Section 134(a) MVA 1988, Section 12(2) Clinical Establishments Act & PM-JAY Clause 7.2',
      cureWindow: 'Immediate / 48-Hour Statutory Cure',
      description: 'Statutory emergency notice served on hospital administration for denying emergency trauma treatment or demanding illegal cash advances.',
      getDefaults: (diag) => ({
        authorityName: diag?.oppositeParty || diag?.counterParty || 'The Medical Superintendent / Hospital Management',
        authorityAddress: 'Emergency Trauma Centre & Administrative Office, India',
        subject: 'STATUTORY LEGAL NOTICE: UNLAWFUL REFUSAL OF EMERGENCY ADMISSION & CASH ADVANCE DEMAND (SECTION 134 MVA)',
        facts: diag?.summary || 'The hospital administration refused emergency trauma stabilization for an accident victim and demanded ₹50,000 cash advance, in direct violation of Section 134(a) Motor Vehicles Act and Ayushman Bharat PM-JAY cashless norms.',
        prayer: 'Immediate 100% cashless admission, refund of any unlawfully demanded deposit, and compliance with statutory trauma guidelines within 48 hours, failing which complaints before the District Consumer Commission, State Medical Council, and NHA will be pursued.'
      })
    }
  }), [t, language]);

  const [draftType, setDraftType] = useState('CONSUMER_NOTICE');
  const [applicantName, setApplicantName] = useState(userProfile?.name || 'Tanvi Makhija');
  const [applicantPhone, setApplicantPhone] = useState(userProfile?.phone || '+91 98765 43210');
  const [applicantEmail, setApplicantEmail] = useState(userProfile?.email || 'citizen@nyayasetu.in');
  const [applicantAddress, setApplicantAddress] = useState(`${selectedDistrict || userProfile?.district || 'Lucknow'}, ${selectedState || userProfile?.state || 'Uttar Pradesh'}, India`);

  const [authorityName, setAuthorityName] = useState('');
  const [authorityAddress, setAuthorityAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [facts, setFacts] = useState('');
  const [prayer, setPrayer] = useState('');

  // Initial load or diagnosis update
  useEffect(() => {
    let initialType = 'CONSUMER_NOTICE';
    if (currentDiagnosis) {
      if (currentDiagnosis.category?.includes('Women') || currentDiagnosis.category?.includes('Matrimonial') || currentDiagnosis.category?.includes('Criminal')) {
        initialType = 'POLICE_COMPLAINT_FIR';
      } else if (currentDiagnosis.category?.includes('Health') || currentDiagnosis.hospitalSchemeAudit) {
        initialType = 'HOSPITAL_EMERGENCY_NOTICE';
      } else if (currentDiagnosis.category === 'RTI Application') {
        initialType = 'RTI_APPLICATION';
      } else if (currentDiagnosis.category === 'Tenancy & Housing') {
        initialType = 'TENANCY_NOTICE';
      } else if (currentDiagnosis.category === 'Civic & Municipal') {
        initialType = 'CPGRAMS_PETITION';
      } else {
        initialType = 'CONSUMER_NOTICE';
      }
    }
    
    setDraftType(initialType);
    const config = TEMPLATE_CONFIGS[initialType];
    if (config) {
      const defaults = config.getDefaults(currentDiagnosis);
      setAuthorityName(defaults.authorityName);
      setAuthorityAddress(defaults.authorityAddress);
      setSubject(defaults.subject);
      setFacts(defaults.facts);
      setPrayer(defaults.prayer);
    }
  }, [currentDiagnosis, TEMPLATE_CONFIGS]);

  // Handle dynamic template switching on click
  const handleSelectTemplate = (typeId) => {
    setDraftType(typeId);
    const config = TEMPLATE_CONFIGS[typeId];
    if (config) {
      const defaults = config.getDefaults(currentDiagnosis);
      setAuthorityName(defaults.authorityName);
      setAuthorityAddress(defaults.authorityAddress);
      setSubject(defaults.subject);
      setFacts(defaults.facts);
      setPrayer(defaults.prayer);
      showToast(`Switched form to ${config.title}`, 'info');
    }
  };

  const handleResetDefaults = () => {
    const config = TEMPLATE_CONFIGS[draftType];
    if (config) {
      const defaults = config.getDefaults(currentDiagnosis);
      setAuthorityName(defaults.authorityName);
      setAuthorityAddress(defaults.authorityAddress);
      setSubject(defaults.subject);
      setFacts(defaults.facts);
      setPrayer(defaults.prayer);
      showToast(`Reset fields to ${config.title} defaults`, 'info');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiGenerateDraft({
        draftType,
        referenceId: currentReferenceId,
        applicantName,
        applicantAddress,
        applicantPhone,
        applicantEmail,
        authorityName,
        authorityAddress,
        subject,
        facts,
        legalSections: currentDiagnosis?.statutes || [
          { section: 'Section 35(1)(a)', title: 'Consumer Forum Action', relevance: 'Remedy for deficiency of service' },
          { section: 'Section 2(47)', title: 'Unfair Trade Practice', relevance: 'Refusal of return on defective delivery' }
        ],
        prayer
      });

      if (res.success) {
        setActiveDraft(res.draft);
        setIsPreviewOpen(true);
        try {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
        } catch (err) {}
        showToast('Official Legal Notice generated with QR verification.', 'success');
      }
    } finally {
      setLoading(false);
    }
  };

  const activeConfig = TEMPLATE_CONFIGS[draftType] || TEMPLATE_CONFIGS.CONSUMER_NOTICE;

  const currentDraftPreviewObject = useMemo(() => {
    return activeDraft || {
      referenceId: currentReferenceId,
      draftType,
      title: activeConfig.title,
      statutoryAct: activeConfig.statuteBadge,
      applicantName,
      applicantPhone,
      applicantEmail,
      applicantAddress,
      authorityName: authorityName || 'Opposite Party / Nodal Grievance Officer',
      authorityAddress: authorityAddress || 'Corporate Office / Nodal Division Address',
      subject,
      facts,
      prayer,
      statutoryNoticePeriodDays: activeConfig.cureWindow?.includes('30') ? 30 : activeConfig.cureWindow?.includes('24') ? 1 : activeConfig.cureWindow?.includes('48') ? 2 : 15,
      structuredText: `STATUTORY LEGAL NOTICE\nRef: ${currentReferenceId}\nTo: ${authorityName}\nSubject: ${subject}\n\nFacts:\n${facts}\n\nPrayer:\n${prayer}`
    };
  }, [activeDraft, currentReferenceId, draftType, activeConfig, applicantName, applicantPhone, applicantEmail, applicantAddress, authorityName, authorityAddress, subject, facts, prayer]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* Header */}
      <div className="gov-card p-6 bg-gradient-to-r from-slate-50 to-slate-100/60 border-slate-300">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block mb-1">
          {t.draftingEyebrow || 'STATUTORY NOTICE & RTI APPLICATION STUDIO'}
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540]">
          {t.draftingTitle}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {t.draftingSub}
        </p>
      </div>

      {/* Notice Template Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t.selectTemplateHeading || 'SELECT STATUTORY DOCUMENT TEMPLATE:'}
          </span>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
            title="Reset form fields to this template's defaults"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t.resetTemplateDefaults || 'Reset Template Defaults'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.values(TEMPLATE_CONFIGS).map((type) => {
            const isSelected = draftType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleSelectTemplate(type.id)}
                className={`p-3.5 rounded-md text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/90 border-[#D97706] text-[#0A2540] shadow-sm font-bold ring-2 ring-[#D97706]/30'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{type.title}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#D97706]" />}
                </div>
                <div className="text-[10px] text-[#D97706] font-mono mt-1 font-semibold">{type.act}</div>
              </button>
            );
          })}
        </div>

        {/* Active Template Context Bar */}
        <div className="p-3.5 rounded-md bg-slate-100 border border-slate-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#0A2540] flex-shrink-0" />
            <div>
              <strong className="text-[#0A2540]">{activeConfig.title}</strong>
              <span className="text-slate-500 mx-1.5">•</span>
              <span className="text-slate-600">{activeConfig.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-bold">
              {activeConfig.cureWindow}
            </span>
          </div>
        </div>
      </div>

      {/* Main Drafting Form */}
      <form onSubmit={handleGenerate} className="gov-card p-6 sm:p-8 border-slate-300 shadow-sm space-y-6">
        
        {/* Section 1: Citizen Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Shield className="w-3.5 h-3.5 text-[#059669]" />
            <span>{t.applicantSection || '1. Citizen / Applicant Details'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-600 block mb-1 font-medium">{t.fullNameLabel || 'Full Name'}</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block mb-1 font-medium">{t.contactPhoneLabel || 'Contact Phone'}</label>
              <input
                type="text"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block mb-1 font-medium">{t.postalAddressLabel || 'Postal Address'}</label>
              <input
                type="text"
                value={applicantAddress}
                onChange={(e) => setApplicantAddress(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Authority Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <BookOpen className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>{t.authoritySection || '2. Opposite Party / Public Authority Details'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-600 block mb-1 font-medium">{t.authorityNameLabel || 'Recipient / Authority Name'}</label>
              <input
                type="text"
                value={authorityName}
                onChange={(e) => setAuthorityName(e.target.value)}
                required
                placeholder="e.g. Public Information Officer / Flipkart India Pvt Ltd"
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block mb-1 font-medium">{t.authorityAddressLabel || 'Official Office Address'}</label>
              <input
                type="text"
                value={authorityAddress}
                onChange={(e) => setAuthorityAddress(e.target.value)}
                required
                placeholder="Corporate headquarters or nodal division address"
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Subject */}
        <div>
          <label className="text-[11px] text-slate-600 block mb-1 font-semibold">{t.subjectLabel || 'Subject Matter'}</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0A2540]"
          />
        </div>

        {/* Section 4: Facts */}
        <div>
          <label className="text-[11px] text-slate-600 block mb-1 font-semibold">{t.factsLabel || 'Statement of Facts & Evidence'}</label>
          <textarea
            rows={4}
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:border-[#0A2540] resize-none"
          />
        </div>

        {/* Section 5: Prayer */}
        <div>
          <label className="text-[11px] text-slate-600 block mb-1 font-semibold">{t.prayerLabel || 'Statutory Relief Demanded (Prayer)'}</label>
          <textarea
            rows={3}
            value={prayer}
            onChange={(e) => setPrayer(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:border-[#0A2540] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#059669]" />
            <span>
              {language === 'hi'
                ? 'दस्तावेज़ सत्यापन क्यूआर कोड एवं वैधानिक संदर्भ संख्या के साथ तैयार होगा।'
                : 'Document will be generated with verification QR code & statutory reference number.'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsDispatchOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="1-Click WhatsApp & Registered Email Legal Dispatch Relay"
            >
              <Share2 className="w-4 h-4 text-emerald-100" />
              <span>{language === 'hi' ? '📱 व्हाट्सएप / ईमेल रिले' : '📱 1-Click WhatsApp & Email Relay'}</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{loading ? (t.generatingNoticeBtn || 'Compiling Statutory Sections & Notice...') : (t.generateSignedNoticeBtn || t.btnGeneratePDF || 'Generate Signed Legal Notice (QR-Verified)')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </form>

      {/* Loading */}
      {loading && (
        <LoadingGavel 
          message={language === 'hi' 
            ? 'वैधानिक विधिक नोटिस एवं क्यूआर कोड तैयार किया जा रहा है...' 
            : 'Formatting statutory legal notice & generating QR certificate...'} 
        />
      )}

      {/* PDF Modal */}
      <PDFPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        draftData={activeDraft}
      />

      {/* 1-Click Legal Dispatch Relay Modal */}
      <LegalDispatchRelayModal
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        draftData={currentDraftPreviewObject}
      />

    </div>
  );
};
