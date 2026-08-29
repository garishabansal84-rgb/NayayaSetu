import React, { useMemo } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { computeCaseReadiness } from '../../services/caseReadinessEngine';
import { EvidenceClaimMap } from '../evidence/EvidenceClaimMap';
import { WhyNeeded } from '../common/WhyNeeded';
import { 
  Activity, ShieldCheck, AlertTriangle, CheckCircle2, Clock, 
  FileText, Scale, MapPin, Award, ArrowRight, Sparkles, 
  Layers, KeyRound, AlertCircle, HelpCircle, Check, BookOpen
} from 'lucide-react';

export const CaseReadiness = () => {
  const { 
    currentDiagnosis, 
    evidenceData, 
    activeDraft, 
    currentGrievance, 
    currentReferenceId,
    selectedDistrict,
    selectedState,
    userProfile,
    casesHistory,
    setActiveTab,
    showToast
  } = useCase();

  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const readinessData = useMemo(() => {
    return computeCaseReadiness({
      diagnosis: currentDiagnosis,
      evidenceData,
      activeDraft,
      grievanceText: currentGrievance,
      selectedDistrict,
      selectedState,
      userProfile,
      casesHistory
    });
  }, [currentDiagnosis, evidenceData, activeDraft, currentGrievance, selectedDistrict, selectedState, userProfile, casesHistory]);

  const { score, readinessLevel, readinessTitle, readinessBadgeColor, pillars, nextBestAction, gaps } = readinessData;

  const getPillarIcon = (id) => {
    switch (id) {
      case 'triage': return Scale;
      case 'evidence': return Layers;
      case 'timeline': return Clock;
      case 'draft': return FileText;
      case 'jurisdiction': return MapPin;
      case 'schemes': return Award;
      default: return Activity;
    }
  };

  const getStatusBadge = (status, score, maxScore) => {
    if (status === 'complete') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isHi ? '✓ पूर्ण / मजबूत' : '✓ Strong'}</span>
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>{isHi ? '⚠ कुछ कमियां' : '⚠ Action Needed'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span>{isHi ? 'प्रतीक्षारत' : 'Pending'}</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900">
      
      {/* Official Government Institutional Header */}
      <div className="gov-card p-6 sm:p-8 bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white rounded-2xl shadow-xl border border-slate-700 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 tracking-wider">
                GOVERNMENT DECISION-SUPPORT LAYER
              </span>
              <span className="text-xs font-mono text-slate-300">
                Ref: {currentReferenceId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white flex items-center gap-3">
              <Activity className="w-7 h-7 text-amber-400 animate-pulse" />
              <span>{isHi ? 'केस इंटेलिजेंस एवं प्री-लिटिगेशन रेडीनेस' : 'Case Intelligence & Readiness Engine'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
              {isHi
                ? 'आपके मामले की वैधानिक मजबूती, फॉरेंसिक साक्ष्य पूर्णता, समय-सीमा और नोटिस तैयारी का एकीकृत वास्तविक मूल्यांकन।'
                : 'Aggregates diagnostic facts, forensic evidence custody, limitation timeline, and notice drafts into an explainable institutional readiness assessment.'}
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-xs text-slate-300 uppercase font-semibold">
              {isHi ? 'अधिकार क्षेत्र:' : 'Jurisdiction Forum:'}
            </span>
            <span className="text-sm font-bold text-amber-300">
              {selectedDistrict}, {selectedState}
            </span>
            <span className="text-[11px] text-slate-300 font-mono">
              DCDRC / DLSA Unit Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Readiness Gauge & Next Best Action Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: 0-100% Score Card */}
        <div className="lg:col-span-5 gov-card p-6 sm:p-8 bg-white border border-slate-300 rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isHi ? 'समग्र केस रेडीनेस स्कोर' : 'Overall Case Readiness Score'}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${readinessBadgeColor}`}>
                {readinessTitle}
              </span>
            </div>

            {/* Score Display */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-5xl sm:text-6xl font-extrabold font-serif text-[#0A2540] tracking-tight">
                {score}%
              </span>
              <div className="text-xs text-slate-500 space-y-0.5">
                <span className="font-bold text-slate-800 block">
                  {score >= 80 ? (isHi ? 'विधिक नोटिस के लिए तैयार' : 'Institutionally Strong') : (isHi ? 'कार्रवाई आवश्यक' : 'Gaps to Resolve')}
                </span>
                <span>{isHi ? '100 में से पारदर्शी बिंदु' : 'Calculated across 6 statutory pillars'}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${
                  score >= 80 ? 'bg-emerald-600' : score >= 50 ? 'bg-[#1E3A8A]' : 'bg-amber-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Quick Summary Pill Row */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 text-center">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-medium">{isHi ? 'विधिक जांच' : 'Legal Triage'}</span>
              <span className="text-xs font-bold text-emerald-700">
                {currentDiagnosis ? (isHi ? '✓ पूर्ण' : '✓ Strong') : (isHi ? 'लंबित' : 'Pending')}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-medium">{isHi ? 'साक्ष्य सील' : 'Evidence'}</span>
              <span className="text-xs font-bold text-[#1E3A8A]">
                {evidenceData ? (isHi ? '✓ SHA-256' : '✓ Sealed') : (isHi ? '⚠ अधूरा' : '⚠ Missing')}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-medium">{isHi ? 'विधिक नोटिस' : 'Notice Draft'}</span>
              <span className="text-xs font-bold text-slate-800">
                {activeDraft ? (isHi ? '✓ तैयार' : '✓ Ready') : (isHi ? '⏳ लंबित' : 'Pending')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Next Best Action Card */}
        <div className="lg:col-span-7 gov-card p-6 sm:p-8 bg-gradient-to-br from-blue-50/70 via-white to-amber-50/40 border border-blue-200/80 rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span>{isHi ? 'अगला सर्वोत्तम कदम' : 'NEXT BEST ACTION'}</span>
              </span>
              <WhyNeeded code={nextBestAction.whyNeededCode} variant="button" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#0A2540]">
              {isHi ? nextBestAction.hindiTitle : nextBestAction.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-slate-200">
              {nextBestAction.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {isHi ? 'स्कोर बढ़ाने और कानूनी नोटिस को मजबूत करने के लिए:' : 'To boost readiness & lock statutory notice:'}
            </span>

            <button
              onClick={() => setActiveTab(nextBestAction.targetTab)}
              className="px-5 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ml-auto"
            >
              <span>{nextBestAction.actionLabel}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

      </div>

      {/* 6 Institutional Pillars Audit Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold font-serif text-[#0A2540] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{isHi ? '6-स्तंभीय वैधानिक ऑडिट विवरण' : '6-Pillar Statutory Readiness Audit'}</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {isHi ? 'पारदर्शी नियम-आधारित स्कोर' : 'Transparent Rule-Based Breakdown'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar) => {
            const Icon = getPillarIcon(pillar.id);
            return (
              <div 
                key={pillar.id}
                className="gov-card p-5 bg-white border border-slate-300 rounded-xl shadow-2xs space-y-3 hover:border-slate-400 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0A2540] flex items-center justify-center border border-slate-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {isHi ? pillar.hindiName : pillar.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">Weight: {pillar.weight}</span>
                    </div>
                  </div>

                  <div>
                    {getStatusBadge(pillar.status, pillar.score, pillar.maxScore)}
                  </div>
                </div>

                {/* Score & Progress */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500 font-mono">{pillar.score} / {pillar.maxScore} pts</span>
                    <span className="font-bold text-[#0A2540]">{Math.round((pillar.score / pillar.maxScore) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        pillar.status === 'complete' ? 'bg-emerald-600' : pillar.status === 'warning' ? 'bg-[#1E3A8A]' : 'bg-slate-300'
                      }`}
                      style={{ width: `${(pillar.score / pillar.maxScore) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Explanatory Status Note */}
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 leading-snug">
                  {pillar.statusNote}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Feature 2: Evidence -> Claim Intelligence Map */}
      <div className="space-y-3">
        <EvidenceClaimMap />
      </div>

      {/* Missing Requirements & Gaps Action List */}
      {gaps.length > 0 && (
        <div className="gov-card p-6 bg-white border border-amber-300 shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-bold">
                {isHi ? 'पहचानी गई कमियां एवं सुधारात्मक कदम' : 'Identified Evidentiary Gaps & Actionable Recommendations'}
              </h4>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              {gaps.length} {gaps.length === 1 ? 'Gap' : 'Gaps'} Identified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gaps.slice(0, 4).map((gap, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200 flex flex-col justify-between space-y-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950">{isHi ? gap.hindiTitle : gap.title}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                      gap.priority === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {gap.priority}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {gap.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
                  <WhyNeeded code={gap.whyNeededCode} variant="button" />
                  <button
                    onClick={() => setActiveTab(gap.targetTab)}
                    className="flex items-center gap-1 font-bold text-blue-900 hover:text-blue-700 cursor-pointer"
                  >
                    <span>{gap.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Institutional Legal Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-600 text-xs flex items-start gap-3">
        <BookOpen className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Statutory Notice: </strong>
          {isHi
            ? 'न्याय सेतु एक नागरिक निर्णय-सहायता एवं केस तैयारी प्रणाली है। यह स्कोरिंग पारदर्शी कानूनी नियमों पर आधारित है और अधिवक्ता की सलाह का विकल्प नहीं है।'
            : 'NyayaSetu is a civic pre-litigation decision-support system. Readiness scoring is generated deterministically based on statutory requirements under the Consumer Protection Act 2019, Model Tenancy Act, and Bharatiya Sakshya Adhiniyam 2023.'}
        </p>
      </div>

    </div>
  );
};

export default CaseReadiness;
