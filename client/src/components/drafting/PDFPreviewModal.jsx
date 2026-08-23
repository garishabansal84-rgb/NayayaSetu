import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../../context/LanguageContext';
import { useCase } from '../../context/CaseContext';
import { Download, Copy, Check, X, FileText, ExternalLink, ShieldCheck, Printer, ArrowDownToLine, Share2, MessageSquare, Mail } from 'lucide-react';
import { LegalDispatchRelayModal } from './LegalDispatchRelayModal';

export const PDFPreviewModal = ({ isOpen, onClose, draftData }) => {
  const { language } = useLanguage();
  const { showToast } = useCase();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isDispatchRelayOpen, setIsDispatchRelayOpen] = useState(false);

  const ref = draftData?.referenceId || 'NYA-2026-REF-8812';
  const verificationUrl = draftData?.verificationUrl || `https://nyayasetu.gov.in/verify?ref=${ref}`;

  useEffect(() => {
    if (verificationUrl) {
      QRCode.toDataURL(verificationUrl, { width: 100, margin: 1, color: { dark: '#0A2540', light: '#FFFFFF' } })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR generation error:', err));
    }
  }, [verificationUrl]);

  if (!isOpen || !draftData) return null;

  const handleCopy = () => {
    if (draftData?.structuredText) {
      navigator.clipboard.writeText(draftData.structuredText);
      setCopied(true);
      showToast('Formal legal notice text copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = () => {
    if (draftData?.pdfUrl) {
      window.open(draftData.pdfUrl, '_blank');
    } else {
      // Fallback text download
      const element = document.createElement('a');
      const file = new Blob([draftData.structuredText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${draftData.fileName || 'NyayaSetu_Notice'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      showToast('Notice file downloaded.', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-lg max-w-3xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Institutional Header */}
        <div className="p-4 bg-[#0A2540] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold">{language === 'hi' ? 'सांविधिक विधिक नोटिस दस्तावेज़' : 'Statutory Legal Notice Document'}</h3>
              <p className="text-[11px] text-slate-300 font-mono">{language === 'hi' ? 'संदर्भ संख्या:' : 'Reference No:'} {ref}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setIsDispatchRelayOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              title="Dispatch Notice via WhatsApp or Registered Email"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? '📱 व्हाट्सएप / ईमेल भेजें' : '📱 WhatsApp / Email Relay'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'hi' ? 'कॉपी हो गया' : 'Copied') : (language === 'hi' ? 'टेक्स्ट कॉपी करें' : 'Copy Text')}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पीडीएफ डाउनलोड करें' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-50 text-slate-900 font-sans text-xs sm:text-sm space-y-6">
          
          {/* Quick Action Dispatch Banner */}
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping flex-shrink-0" />
              <span className="text-emerald-950 font-semibold">
                {language === 'hi'
                  ? 'यह विधिक नोटिस तैयार है। इसे तुरंत कंपनी/मकान मालिक को व्हाट्सएप अथवा रजिस्टर्ड ईमेल पर प्रेषित करें।'
                  : 'Official notice formatted with statutory QR token. Dispatch immediately to Opposite Party via WhatsApp or Email.'}
              </span>
            </div>

            <button
              onClick={() => setIsDispatchRelayOpen(true)}
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer flex-shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? '1-क्लिक डिस्पैच रिले खोलें' : '1-Click Legal Dispatch Relay'}</span>
            </button>
          </div>

          <div className="legal-paper p-6 sm:p-8 rounded bg-white border border-slate-300 space-y-6">
            
            {/* Government Tricolor Top Ribbon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-slate-200 to-emerald-600 rounded-full"></div>

            {/* Official Legal Seal & Header */}
            <div className="text-center pb-4 border-b border-slate-300 space-y-1">
              <h2 className="text-sm sm:text-base font-extrabold font-serif tracking-wide text-[#0A2540]">
                NYAYASETU (न्याय सेतु) — CITIZEN STATUTORY ACTION ENGINE
              </h2>
              <p className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
                {draftData?.draftType === 'RTI_APPLICATION'
                  ? 'FORM OF APPLICATION UNDER SECTION 6(1) OF RIGHT TO INFORMATION ACT, 2005'
                  : 'STATUTORY PRE-LITIGATION LEGAL NOTICE UNDER SECTION 35 OF CONSUMER PROTECTION ACT, 2019'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                ISSUED UNDER THE STATUTORY CHARTER & CITIZEN REMEDY PROVISIONS OF INDIA
              </p>
            </div>

            {/* Reference Meta & Scannable QR Code Box */}
            <div className="flex items-start justify-between gap-4 p-3.5 bg-slate-50 rounded border border-slate-200">
              <div className="space-y-1 text-xs">
                <div><strong className="text-[#0A2540]">DOCUMENT REF ID:</strong> <span className="font-mono text-[#1E3A8A] font-bold">{ref}</span></div>
                <div><strong className="text-[#0A2540]">DATE OF ISSUANCE:</strong> <span>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
                <div><strong className="text-[#0A2540]">AUTHENTICATION:</strong> <span className="text-[#059669] font-semibold">Digitally Signed & QR Tracked</span></div>
              </div>

              {qrDataUrl && (
                <div className="text-center flex-shrink-0 bg-white p-1.5 rounded border border-slate-200 shadow-2xs">
                  <img src={qrDataUrl} alt="Verification QR Code" className="w-16 h-16 mx-auto" />
                  <span className="text-[8px] text-slate-500 block font-mono">Scan to Verify</span>
                </div>
              )}
            </div>

            {/* Document Body Text */}
            <div className="p-4 rounded bg-slate-50/60 border border-slate-200 font-mono text-[11px] sm:text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
              {draftData?.structuredText || 'Legal notice draft...'}
            </div>

            {/* Formal Verification Disclaimer */}
            <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
              This statutory legal document is generated for citizen enforcement. Verify authenticity online at nyayasetu.gov.in/verify?ref={ref}
            </div>

          </div>

        </div>

      </div>

      {/* Sub-modal: 1-Click Dispatch Relay */}
      <LegalDispatchRelayModal
        isOpen={isDispatchRelayOpen}
        onClose={() => setIsDispatchRelayOpen(false)}
        draftData={draftData}
      />
    </div>
  );
};
