import React, { useState, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Scale, ShieldCheck, Clock, FileCheck, ArrowRight, 
  ChevronDown, ChevronUp, ExternalLink, AlertTriangle, 
  Volume2, VolumeX, CheckCircle2, BookmarkCheck, FileText, Info, 
  ShieldAlert, AlertCircle, CheckSquare, Square, Share2, Copy, Building2, Activity
} from 'lucide-react';

import { speakLegalAdvice, stopSpeech } from '../../services/voiceService';
import { LegalDispatchRelayModal } from '../drafting/LegalDispatchRelayModal';
import { OpponentWargameSimulator } from './OpponentWargameSimulator';

export const LegalResultCard = ({ diagnosis }) => {
  const { currentReferenceId, setActiveTab, showToast } = useCase();
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const [expandedSection, setExpandedSection] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [checkedEvidence, setCheckedEvidence] = useState({});
  const [isRelayModalOpen, setIsRelayModalOpen] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Stop any active speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  if (!diagnosis) return null;

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const toggleEvidenceItem = (idx) => {
    setCheckedEvidence(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSpeak = () => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
      return;
    }

    const textToSpeak = `${diagnosis.summary || ''}. ${t.block2Title || 'Applicable Laws'}. ${
      diagnosis.applicableActs?.map(a => `${a.act}, ${a.section}`).join('. ') || ''
    }. ${t.claimLabel || 'Claim'}: ${diagnosis.remedy?.reliefClaim || ''}`;

    const utt = speakLegalAdvice(
      textToSpeak,
      language,
      () => setSpeaking(false),
      () => setSpeaking(false)
    );

    if (utt) {
      setSpeaking(true);
    }
  };

  const getSeverityBadge = (sev) => {
    const s = (sev || diagnosis.urgencyLevel || 'Medium').toLowerCase();
    if (s.includes('critical')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white animate-pulse shadow-xs">
          <ShieldAlert className="w-3 h-3" />
          <span>CRITICAL SEVERITY</span>
        </span>
      );
    }
    if (s.includes('high')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500 text-white shadow-xs">
          <AlertTriangle className="w-3 h-3" />
          <span>HIGH SEVERITY</span>
        </span>
      );
    }
    if (s.includes('medium')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-xs">
          <Clock className="w-3 h-3" />
          <span>MEDIUM SEVERITY</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
        <CheckCircle2 className="w-3 h-3" />
        <span>LOW SEVERITY</span>
      </span>
    );
  };

  const evidenceList = diagnosis.evidenceChecklist || [
    { item: "Geotagged Photographs & Video Recordings", whyNeeded: "Proves exact location, time, and physical state of dispute.", tip: "Enable GPS location on camera." },
    { item: "Written Receipts & Transaction Records", whyNeeded: "Establishes payment, tenancy, medical bills, or complaint docket numbers.", tip: "Keep original copies safe." },
    { item: "Official Written Complaint Copy & Speed Post Slip", whyNeeded: "Proves statutory notice was formally delivered.", tip: "Save postal tracking barcode." }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Banner: Statutory Diagnosis Status */}
      <div className="bg-[#0A2540] text-white p-5 rounded-t-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              REF: {currentReferenceId}
            </span>
            {diagnosis.category && (
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wide shadow-xs">
                🏷️ {diagnosis.category}
              </span>
            )}
            {getSeverityBadge(diagnosis.severity)}
            <span className="text-xs font-bold text-slate-300">
              | {t.oppositePartyLabel || 'Opposite Party:'} <span className="text-white underline">{diagnosis.oppositeParty || 'Opposite Party'}</span>
            </span>
          </div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-white leading-snug">
            {diagnosis.disputeTitle || t.resultHeading || 'Citizen Statutory Grievance Assessment'}
          </h2>
        </div>

        <button
          onClick={handleSpeak}
          className={'self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold transition-all border cursor-pointer ' + (
            speaking 
              ? 'bg-red-600 text-white border-red-500 animate-pulse' 
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
          )}
          title="Text to Speech Explanation"
        >
          {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          <span>{speaking ? (t.stopAudioBtn || 'Stop Voice') : (t.listenAudioBtn || 'Listen Explanation')}</span>
        </button>
      </div>

      {/* URGENCY ALERT BANNER (If present or High/Critical) */}
      {(diagnosis.urgencyAlert || diagnosis.severity === 'Critical' || diagnosis.urgencyLevel === 'CRITICAL') && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-500 text-red-950 flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="text-red-900 font-extrabold block uppercase tracking-wide">
              ⚠️ URGENT CITIZEN SAFETY & STATUTORY ALERT
            </strong>
            <p className="text-red-800 leading-relaxed font-medium">
              {diagnosis.urgencyAlert || "⚠️ This situation may require immediate emergency intervention or administrative escalation. Please contact the appropriate authorities immediately."}
            </p>
            <div className="pt-1 flex flex-wrap gap-2 text-xs font-bold text-red-900">
              <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300">Police Emergency: 112</span>
              <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300">Women Helpline: 1090 / 181</span>
              <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300">Anti-Corruption: 1064</span>
              <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300">Civic Nodal: 1533 / 1076</span>
              <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300">Free Legal Aid: 14468</span>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL AUDIT: HOSPITAL SCHEME & DOCUMENT VERIFICATION */}
      {diagnosis.hospitalSchemeAudit && (
        <div className="gov-card p-6 border-l-4 border-l-red-600 bg-red-50/30 border-red-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-red-950 uppercase tracking-wider">
                    {language === 'hi' ? 'अस्पताल योजना एवं दस्तावेज़ वैधानिक ऑडिट' : 'Hospital Scheme & Document Empanelment Audit'}
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-600 text-white shadow-xs">
                    {diagnosis.hospitalSchemeAudit.violationSeverity === 'CRITICAL_STATUTORY_BREACH' ? 'CRITICAL STATUTORY BREACH' : 'SCHEME AUDIT ACTIVE'}
                  </span>
                </div>
                <span className="text-xs text-slate-700 font-semibold">
                  {diagnosis.hospitalSchemeAudit.hospitalName} • {diagnosis.hospitalSchemeAudit.city || 'Delhi / NCR'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white px-3 py-1 rounded-md border border-red-200 text-xs font-bold text-red-800 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{diagnosis.hospitalSchemeAudit.empanelmentStatus === 'VERIFIED_EMPANELLED_HEALTHCARE_PROVIDER' ? 'Verified NHA Empanelled Hospital' : 'Hospital Under Regulatory Duty'}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-red-300 space-y-2 text-xs">
            <div className="font-bold text-red-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{diagnosis.hospitalSchemeAudit.violationSummary}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {language === 'hi'
                ? 'मोटर वाहन अधिनियम (धारा 134a) और क्लिनिकल एस्टेब्लिशमेंट एक्ट (धारा 12) के अनुसार आपातकालीन दुर्घटना पीड़ितों से नकदी की मांग करना गैर-जमानती दंडात्मक उल्लंघन है। आयुष्मान योजना के तहत 100% कैशलेस इलाज अनिवार्य है।'
                : 'Under Section 134(a) of the Motor Vehicles Act and Section 12(2) of the Clinical Establishments Act, private and government hospitals are strictly barred from demanding cash advances before emergency trauma stabilization.'}
            </p>
            
            {diagnosis.hospitalSchemeAudit.arogyaMitraDesk && (
              <div className="pt-2 text-[11px] font-semibold text-slate-800 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-blue-900 font-bold">🏥 Arogya Mitra Desk:</span>
                <span>{diagnosis.hospitalSchemeAudit.arogyaMitraDesk}</span>
              </div>
            )}
          </div>

          {/* Emergency Hotline Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <a
              href="tel:14555"
              className="flex items-center justify-between p-2.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>📞 NHA PM-JAY Hotline (14555)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="tel:112"
              className="flex items-center justify-between p-2.5 rounded bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>🚑 Emergency Trauma (112 / 108)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="tel:1915"
              className="flex items-center justify-between p-2.5 rounded bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>⚖️ National Consumer (1915)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 5-BLOCK STRUCTURED AI RESPONSE */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* BLOCK 1: YOUR SITUATION */}
        <div className="gov-card p-6 border-l-4 border-l-blue-700">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-950">
              {t.block1Title || '1. YOUR LEGAL & FACTUAL SITUATION'}
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
            {diagnosis.summary}
          </p>
        </div>

        {/* BLOCK 2: WHAT MAY APPLY (Indian Statutes & Gazette Sections) */}
        <div className="gov-card p-6 border-l-4 border-l-indigo-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-700" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-950">
                {t.block2Title || '2. RELEVANT INDIAN LAWS & CITIZEN RIGHTS'}
              </h3>
            </div>
            <span className="text-xs text-slate-600 font-medium">
              {t.block2Sub || 'Statutory Acts & Provisions'}
            </span>
          </div>

          <div className="space-y-3">
            {diagnosis.applicableActs?.map((item, idx) => (
              <div 
                key={idx} 
                className="border border-slate-200 rounded-md overflow-hidden bg-slate-50/50"
              >
                <div 
                  onClick={() => toggleSection(idx)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="statute-tag">{item.section}</span>
                      <span className="text-xs sm:text-sm font-bold text-[#0A2540]">{item.act}</span>
                    </div>
                    <p className="text-xs text-slate-700 pt-1">
                      <span className="font-semibold text-slate-900">{t.howProtects || 'How this protects you:'} </span> 
                      {item.summary}
                    </p>
                  </div>
                  <div className="text-slate-400 pl-3">
                    {expandedSection === idx ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-700" />}
                  </div>
                </div>

                {expandedSection === idx && (
                  <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-700 space-y-2">
                    <div className="font-mono text-[11px] font-bold text-slate-900 uppercase">
                      {language === 'hi' ? 'आधिकारिक राजपत्र वैधानिक पाठ:' : 'Official Gazette Statutory Text:'}
                    </div>
                    <blockquote className="border-l-2 border-slate-400 pl-3 py-1 font-serif text-slate-800 italic bg-slate-50 p-2 rounded">
                      "{item.fullText}"
                    </blockquote>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 3: WHY THIS MATTERS & LEGAL REMEDY */}
        <div className="gov-card p-6 border-l-4 border-l-amber-600 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-950">
              {t.block3Title || '3. STATUTORY REMEDY & CLAIM SOUGHT'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50/60 border border-amber-200 rounded p-3.5">
              <span className="text-[11px] font-bold uppercase text-amber-900 block mb-1">
                {t.claimLabel || 'Claim / Remedy'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#0A2540]">
                {diagnosis.remedy?.reliefClaim || 'Full Consideration + 9% p.a.'}
              </span>
            </div>

            <div className="bg-blue-50/60 border border-blue-200 rounded p-3.5">
              <span className="text-[11px] font-bold uppercase text-blue-900 block mb-1">
                {t.noticeWindowLabel || 'Statutory Timeline'}
              </span>
              <span className="text-base font-extrabold text-[#0A2540]">
                {diagnosis.remedy?.timelineDays || 15} {language === 'hi' ? 'दिनों की कानूनी समय-सीमा' : 'Days Statutory Window'}
              </span>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 rounded p-3.5">
              <span className="text-[11px] font-bold uppercase text-emerald-900 block mb-1">
                {t.evidenceStrengthLabel || 'Evidence Strength'}
              </span>
              <span className="text-base font-extrabold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{diagnosis.remedy?.evidenceStrength || 'STRONG'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* BLOCK 4: WHAT YOU CAN DO & EVIDENCE CHECKLIST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Action Steps */}
          <div className="gov-card p-6 border-l-4 border-l-emerald-600 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950">
                  {t.block4Title || '4. RECOMMENDED ACTION PLAN'}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {diagnosis.actionPlan?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3 rounded-md bg-slate-50 border border-slate-200 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {step.step || idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#0A2540]">{step.title}</h4>
                    <p className="text-slate-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Checklist */}
          <div className="gov-card p-6 border-l-4 border-l-purple-600 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-950">
                  {isHi ? 'साक्ष्य चेकलिस्ट (Evidence Checklist)' : 'DYNAMIC EVIDENCE CHECKLIST'}
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">
                {Object.values(checkedEvidence).filter(Boolean).length} / {evidenceList.length} ready
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {evidenceList.map((evi, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleEvidenceItem(idx)}
                  className={'p-3 rounded-md border transition-all cursor-pointer flex items-start gap-2.5 ' + (
                    checkedEvidence[idx] 
                      ? 'bg-purple-50 border-purple-300 text-purple-950' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  )}
                >
                  <div className="mt-0.5">
                    {checkedEvidence[idx] ? (
                      <CheckSquare className="w-4 h-4 text-purple-700" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <strong className="font-bold">{evi.item}</strong>
                    <p className="text-[11px] text-slate-600">{evi.whyNeeded}</p>
                    {evi.tip && (
                      <span className="text-[10px] text-purple-700 font-semibold block">
                        💡 Tip: {evi.tip}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BLOCK 5: OFFICIAL SOURCES & CITATIONS */}
        <div className="gov-card p-6 border-l-4 border-l-slate-600 space-y-3">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-slate-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              {t.block5Title || '5. STATUTORY CITATIONS & PRECEDENTS'}
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {diagnosis.citations?.map((cit, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>{cit}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ADVERSARIAL OPPONENT DEFENSE SIMULATOR (RED-TEAM WARGAMER) */}
      <OpponentWargameSimulator diagnosis={diagnosis} />

      {/* BOTTOM ACTION BAR: NOTICE STUDIO & 1-CLICK DISPATCH RELAY */}

      <div className="gov-card p-6 bg-gradient-to-r from-slate-900 to-[#0A2540] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">
            {t.readyNoticeText || 'Ready to enforce your rights?'}
          </h3>
          <p className="text-xs text-slate-300">
            {language === 'hi'
              ? 'इन तथ्यों के साथ धारा 134 मोटर वाहन अधिनियम, धारा 35 उपभोक्ता मांग नोटिस, आरटीआई या औपचारिक विधिक नोटिस तैयार व प्रेषित करें।'
              : 'Generate an official QR-verified legal notice or dispatch pre-filled representation directly via WhatsApp / Email.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto justify-end">
          <button
            onClick={() => setActiveTab('readiness')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-blue-500/40"
          >
            <Activity className="w-4 h-4 text-amber-300" />
            <span>{isHi ? '📊 केस रेडीनेस इंटेलिजेंस' : '📊 Case Readiness Suite'}</span>
          </button>

          <button
            onClick={() => setIsRelayModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-100" />
            <span>{isHi ? '📱 व्हाट्सएप / ईमेल रिले' : '📱 1-Click WhatsApp & Email Relay'}</span>
          </button>

          <button
            onClick={() => setActiveTab('drafting')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t.btnGenerateNotice || 'Legal Notice Studio →'}</span>
          </button>
        </div>

      </div>

      {/* Multi-Channel Legal Dispatch Relay Modal */}
      {isRelayModalOpen && (
        <LegalDispatchRelayModal
          isOpen={isRelayModalOpen}
          onClose={() => setIsRelayModalOpen(false)}
          draftData={{
            referenceId: currentReferenceId,
            authorityName: diagnosis.oppositeParty || 'Concerned Authority / Opposite Party',
            authorityAddress: diagnosis.jurisdiction?.officeAddress || 'Designated Office',
            subject: diagnosis.disputeTitle || 'Formal Statutory Pre-Litigation Legal Notice',
            statutoryAct: (diagnosis.applicableActs && diagnosis.applicableActs[0]?.act) || 'Consumer Protection Act, 2019',
            statutoryNoticePeriodDays: diagnosis.remedy?.timelineDays || 15,
            applicantName: 'Citizen Applicant',
            applicantPhone: '+91 98765 43210',
            facts: diagnosis.summary,
            prayer: diagnosis.remedy?.reliefClaim || 'Immediate statutory compliance and full restitution.'
          }}
        />
      )}

    </div>
  );
};
