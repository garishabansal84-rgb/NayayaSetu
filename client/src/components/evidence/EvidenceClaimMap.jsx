import React, { useMemo } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { mapEvidenceToClaims } from '../../services/evidenceClaimEngine';
import { WhyNeeded } from '../common/WhyNeeded';
import { 
  FileCheck, ShieldCheck, AlertCircle, AlertTriangle, 
  CheckCircle2, ArrowRight, Upload, KeyRound, Sparkles, 
  Layers, FileText, PlusCircle, ArrowUpRight, Scale
} from 'lucide-react';

export const EvidenceClaimMap = ({ onUploadClick = null, onSampleClick = null }) => {
  const { currentDiagnosis, currentGrievance, evidenceData, setActiveTab, showToast } = useCase();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const claimMapping = useMemo(() => {
    return mapEvidenceToClaims({
      diagnosis: currentDiagnosis,
      grievanceText: currentGrievance,
      evidenceData: evidenceData
    });
  }, [currentDiagnosis, currentGrievance, evidenceData]);

  const { claims, evidenceScore, supportedClaimsCount, totalClaims } = claimMapping;

  const getStrengthBadge = (strength) => {
    if (strength === 'STRONG') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isHi ? 'मजबूत साक्ष्य' : 'STRONG SUPPORT'}</span>
        </span>
      );
    }
    if (strength === 'MODERATE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>{isHi ? 'मध्यम साक्ष्य' : 'MODERATE SUPPORT'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>{isHi ? 'साक्ष्य आवश्यक' : 'NEEDS SUPPORT'}</span>
      </span>
    );
  };

  return (
    <div className="gov-card p-6 bg-white border border-slate-300 shadow-sm rounded-xl space-y-6 text-slate-800 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1E3A8A]" />
            <h3 className="text-base font-bold text-[#0A2540]">
              {isHi ? 'साक्ष्य → दावा इंटेलिजेंस मैप' : 'Evidence → Claim Intelligence Map'}
            </h3>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              INTELLIGENCE LAYER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi 
              ? 'आपके मामले के प्रत्येक वैधानिक दावे और उससे जुड़े प्रमाणित साक्ष्यों का वास्तविक संबंध'
              : 'Maps extracted statutory claims directly to supporting forensic documents & SHA-256 integrity proofs'}
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {isHi ? 'दावा समर्थन अनुपात' : 'Claims Supported'}
            </span>
            <span className="text-xs font-bold text-[#0A2540]">
              {supportedClaimsCount} / {totalClaims} Claims
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs border border-slate-800 flex items-center gap-1.5">
            <span className="text-amber-300">Score:</span>
            <span className="text-emerald-400">{evidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim, idx) => (
          <div 
            key={claim.id || idx}
            className={`p-4 rounded-lg border transition-all ${
              claim.strength === 'STRONG'
                ? 'bg-emerald-50/40 border-emerald-200'
                : claim.strength === 'MODERATE'
                ? 'bg-blue-50/40 border-blue-200'
                : 'bg-amber-50/40 border-amber-200'
            }`}
          >
            {/* Claim Top Bar */}
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex items-start gap-2 max-w-xl">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  C{idx + 1}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {isHi ? claim.hindiTitle : claim.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                    <span className="text-[#1E3A8A] font-semibold">{claim.category}</span>
                    <span>•</span>
                    <span className="font-serif text-slate-700 italic">{claim.statute}</span>
                  </div>
                </div>
              </div>

              <div>
                {getStrengthBadge(claim.strength)}
              </div>
            </div>

            {/* Supported By Items */}
            {claim.supportedBy && claim.supportedBy.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {isHi ? 'समर्थक साक्ष्य दस्तावेज:' : 'Supporting Evidence Document:'}
                </span>
                <div className="space-y-1.5">
                  {claim.supportedBy.map((doc, dIdx) => (
                    <div 
                      key={dIdx}
                      className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-white border border-slate-200 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-900">{doc.docName}</strong>
                          <p className="text-[11px] text-slate-600">{doc.extractedFact}</p>
                        </div>
                      </div>

                      {doc.sha256Hash && (
                        <span className="font-mono text-[9px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <KeyRound className="w-2.5 h-2.5 text-emerald-600" />
                          <span>SHA-256: {doc.sha256Hash.substring(0, 12)}...</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Evidence / Recommendation */}
            {claim.missingEvidence && claim.missingEvidence.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2 bg-amber-50/80 p-2.5 rounded">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-amber-950 block">
                      {isHi ? 'दावे को मजबूत करने के लिए आवश्यक:' : 'To Strengthen this Claim:'}
                    </span>
                    <span className="text-xs text-amber-900 font-medium">
                      {claim.missingEvidence.map(m => m.name).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {claim.missingEvidence.map((m, mIdx) => (
                    <WhyNeeded 
                      key={mIdx}
                      code={m.whyNeededCode}
                      variant="button"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Footer Navigation Strip */}
      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-600 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>{isHi ? 'साक्ष्य जोड़ने पर केस रेडीनेस स्कोर अपने आप बढ़ता है।' : 'Uploading supporting evidence dynamically boosts your overall Case Readiness Score.'}</span>
        </div>

        <button
          onClick={() => setActiveTab('readiness')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer ml-auto"
        >
          <span>{isHi ? 'केस इंटेलिजेंस स्कोर देखें →' : 'View Full Case Readiness Score'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

    </div>
  );
};

export default EvidenceClaimMap;
