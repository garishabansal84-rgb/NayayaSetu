import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, Building, ExternalLink } from 'lucide-react';

export const DocumentGapCard = ({ documentGap }) => {
  if (!documentGap) return null;
  const { verifiedDocs = [], missingDocs = [], isDocumentReady } = documentGap;

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-400" />
          <span>Document Gap & Procurement Guide</span>
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isDocumentReady ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
          {isDocumentReady ? '100% Ready' : `${missingDocs.length} Missing Document(s)`}
        </span>
      </div>

      {verifiedDocs.length > 0 && (
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 block mb-1">✓ Verified Documents in Hand:</span>
          <div className="flex flex-wrap gap-1.5">
            {verifiedDocs.map((d, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                {d.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {missingDocs.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-orange-400 block">⚠️ Missing Documents to Procure:</span>
          {missingDocs.map((doc, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-orange-500/20 space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>{doc.name}</span>
                <span className="text-[10px] text-orange-400">Mandatory</span>
              </div>
              <p className="text-[11px] text-slate-300">{doc.procurementGuide}</p>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>Authority: {doc.issuingAuthority}</span>
                <a href="https://edistrict.up.gov.in" target="_blank" rel="noreferrer" className="text-orange-400 flex items-center gap-1">
                  <span>e-District Portal</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};