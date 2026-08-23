import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DocumentGapCard } from './DocumentGapCard';
import { 
  Award, IndianRupee, ExternalLink, ChevronDown, ChevronUp, 
  CheckCircle, AlertCircle, Phone, Building2 
} from 'lucide-react';

export const SchemeCard = ({ scheme }) => {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const {
    schemeId,
    title,
    hindiTitle,
    category,
    ministry,
    benefitSummary,
    benefitAmount,
    isEligible,
    matchScore = 90,
    documentGap,
    officialApplyUrl,
    helpline
  } = scheme;

  return (
    <div className="gov-card p-5 border-slate-300 shadow-sm space-y-4 text-slate-800">
      
      {/* Top Category & Match Percentage */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {category}
          </span>
          <span className="text-[11px] text-slate-500">{ministry}</span>
        </div>

        <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
          isEligible
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          {matchScore}% {t.profileMatch || 'Profile Match'}
        </span>
      </div>

      {/* Scheme Title & Benefit Amount */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#0A2540]">
            {language === 'hi' ? hindiTitle || title : title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{benefitSummary}</p>
        </div>

        {benefitAmount && (
          <div className="bg-emerald-50 border border-emerald-300 px-3.5 py-2 rounded text-left sm:text-right flex-shrink-0">
            <span className="text-[10px] text-emerald-900 font-bold uppercase block">{t.directBenefit || 'Direct Benefit'}</span>
            <span className="text-sm font-extrabold text-[#059669]">{benefitAmount}</span>
          </div>
        )}
      </div>

      {/* Document Gap Analysis Accordion */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-2.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0A2540] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-[#059669]" />
            <span>
              {t.docGapChecklist || 'Document Gap Checklist'} ({documentGap?.missingCount || 0} {t.missingDocInstructions || 'missing document instructions'})
            </span>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {expanded && (
          <div className="mt-3">
            <DocumentGapCard documentGap={documentGap} schemeTitle={title} />
          </div>
        )}
      </div>

      {/* Footer Strip */}
      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Phone className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{t.statutoryHelpline || 'Helpline:'} <strong className="text-slate-900">{helpline || '1800-180-1551'}</strong></span>
        </div>

        <a
          href={officialApplyUrl || "https://myscheme.gov.in"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs transition-all"
        >
          <span>{t.applyOfficialPortal || 'Apply on Official Portal'}</span>
          <ExternalLink className="w-3 h-3 text-amber-400" />
        </a>
      </div>

    </div>
  );
};
