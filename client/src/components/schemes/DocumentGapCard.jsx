import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { WhyNeeded } from '../common/WhyNeeded';
import { CheckCircle2, AlertTriangle, ExternalLink, FileText, ArrowRight, Building, HelpCircle } from 'lucide-react';

export const DocumentGapCard = ({ documentGap, schemeTitle }) => {
  const { language, t } = useLanguage();
  if (!documentGap) return null;

  const { verifiedDocs = [], missingDocs = [], isDocumentReady } = documentGap;

  return (
    <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4 text-xs text-slate-800">
      
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#D97706]" />
          <span className="font-bold text-[#0A2540]">
            {t.docGapAnalysisTitle || 'Document Gap Analysis & Procurement Guide'}
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
          isDocumentReady
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-amber-50 text-amber-900 border-amber-300'
        }`}>
          {isDocumentReady ? (t.readyToApply || '✓ 100% Ready to Apply') : `⚠️ ${missingDocs.length} ${t.missingCountTag || 'Missing Certificate(s)'}`}
        </span>
      </div>

      {/* Verified Ready Documents */}
      {verifiedDocs.length > 0 && (
        <div>
          <span className="text-[11px] font-bold text-[#059669] block mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.verifiedDocsInHand || 'Verified Documents in Hand:'}</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {verifiedDocs.map((doc, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px] font-medium">
                ✓ {language === 'hi' ? doc.hindiName || doc.name : doc.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Documents with Step-by-Step Resolution Guide */}
      {missingDocs.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#D97706] block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.missingCertificatesProcure || 'Missing Certificates & Procurement Action:'}</span>
          </span>

          <div className="space-y-2">
            {missingDocs.map((doc, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#0A2540] flex-wrap gap-2">
                  <span>{language === 'hi' ? doc.hindiName || doc.name : doc.name}</span>
                  <div className="flex items-center gap-1.5">
                    <WhyNeeded code={doc.code} variant="button" />
                    <span className="text-[10px] text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {t.mandatoryTag || 'Mandatory'}
                    </span>
                  </div>
                </div>

                
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">{t.procurementProcedure || 'Procurement Procedure:'} </strong>{doc.procurementGuide}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{t.issuingAuthority || 'Issuing Authority:'} {doc.issuingAuthority}</span>
                  </span>
                  <a
                    href="https://edistrict.up.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1E3A8A] font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <span>{t.eDistrictPortal || 'e-District Portal'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
