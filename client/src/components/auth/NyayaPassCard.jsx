import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, Award, Download, Printer, CheckCircle2, 
  MapPin, User, Calendar, ExternalLink, Sparkles, Scale, X 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const NyayaPassCard = ({ passData, onClose, isModal = false }) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const [qrDataUrl, setQrDataUrl] = useState('');

  const passId = passData?.nyayaPassId || 'NP-2026-8812-UP-IN';
  const verifyUrl = passData?.qrUrl || ('https://nyayasetu.gov.in/verify-pass?id=' + passId);

  useEffect(() => {
    if (verifyUrl) {
      QRCode.toDataURL(verifyUrl, { width: 140, margin: 1, color: { dark: '#0A2540', light: '#FFFFFF' } })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [verifyUrl]);

  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(passId);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const cardContent = (
    <div className="relative bg-gradient-to-br from-slate-900 via-[#0A2540] to-blue-950 text-white rounded-xl p-6 sm:p-7 shadow-2xl border-2 border-amber-400/80 overflow-hidden font-sans max-w-lg w-full mx-auto space-y-5">
      
      {/* Background Decorative Seals */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-amber-400/5 pointer-events-none blur-xl" />
      <div className="absolute left-1/2 -top-12 -translate-x-1/2 w-64 h-24 bg-gradient-to-r from-orange-500 via-white to-emerald-600 opacity-20 blur-md rounded-full pointer-events-none" />

      {/* Top Header: Tricolor & Government Seal */}
      <div className="flex items-center justify-between border-b border-amber-400/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 font-serif font-bold text-sm shadow-inner">
            ⚖️
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-300 block">
              GOVERNMENT OF INDIA • भारत सरकार
            </span>
            <h3 className="text-sm sm:text-base font-extrabold tracking-wide text-white font-serif">
              नागरिक न्याय पास • NYAYAPASS
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
            <ShieldCheck className="w-3 h-3" />
            <span>UIDAI VERIFIED</span>
          </span>
          <span className="text-[9px] text-slate-300 block font-mono mt-0.5">
            e-KYC Authenticated
          </span>
        </div>
      </div>

      {/* Pass Body Info Grid */}
      <div className="grid grid-cols-3 gap-4 items-center">
        
        {/* Left 2 Cols: Citizen Details */}
        <div className="col-span-2 space-y-2.5 text-xs">
          <div>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-medium">
              {isHi ? 'नागरिक का नाम / Full Name' : 'Citizen Name'}
            </span>
            <h4 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              {passData?.name || 'Tanvi Makhija'}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">{isHi ? 'आधार संख्या' : 'Aadhaar (Masked)'}</span>
              <strong className="text-amber-200 font-mono">{passData?.aadhaarMasked || 'XXXX-XXXX-4819'}</strong>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">{isHi ? 'वर्ग / Category' : 'Category / Gender'}</span>
              <strong className="text-slate-200">{passData?.socialCategory || 'OBC'} • {passData?.gender || 'FEMALE'}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">{isHi ? 'राज्य / State' : 'State & District'}</span>
              <strong className="text-slate-200 truncate block">{passData?.district || 'Lucknow'}, {passData?.state || 'UP'}</strong>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">{isHi ? 'जारी तिथि' : 'Date of Issue'}</span>
              <strong className="text-slate-200">{new Date(passData?.issuedAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
            </div>
          </div>
        </div>

        {/* Right Col: QR Code Box */}
        <div className="col-span-1 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-1.5 rounded-lg border-2 border-amber-400 shadow-md">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="NyayaPass QR" className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
            ) : (
              <div className="w-20 h-20 bg-slate-200 animate-pulse" />
            )}
          </div>
          <span className="text-[8px] text-amber-300 font-mono mt-1 font-semibold">
            SCAN TO VERIFY
          </span>
        </div>

      </div>

      {/* Unique Pass ID Bar with 1-Click Copy */}
      <div className="p-3 rounded-lg bg-black/60 border-2 border-amber-400/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-[9px] text-amber-300 font-bold uppercase font-mono block">
            🔑 YOUR CITIZEN NYAYAPASS ACCESS KEY:
          </span>
          <span className="font-mono font-extrabold text-amber-200 tracking-wider text-sm sm:text-base selection:bg-amber-300 selection:text-black">
            {passId}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyKey}
          className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            copiedKey
              ? 'bg-emerald-500 text-white font-bold'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
          }`}
          title="Click to copy your unique NyayaPass Access Key"
        >
          {copiedKey ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isHi ? 'Key कॉपी हो गया!' : 'Key Copied!'}</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>{isHi ? 'Key कॉपी करें' : 'Copy Access Key'}</span>
            </>
          )}
        </button>
      </div>

      <div className="p-2 rounded bg-amber-400/10 border border-amber-400/30 text-[10px] text-amber-200 leading-relaxed text-center font-medium">
        💡 {isHi ? 'इस Key को सुरक्षित रखें। भविष्य में किसी भी डिवाइस से लॉगिन करने के लिए इस NyayaPass Key का उपयोग करें।' : 'Keep this key safe. You can use this NyayaPass Access Key to log in and unlock all features anytime.'}
      </div>

      {/* Statutory Protection Guarantee Banner */}
      <div className="pt-1 text-[10px] text-slate-300 border-t border-slate-700/80 flex items-center justify-between gap-1">
        <span>⚖️ 100% Free Legal Aid • NALSA 14468</span>
        <span>•</span>
        <span>📜 Zero FIR Right • BNSS 173</span>
      </div>

    </div>
  );

  if (!isModal) {
    return cardContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative max-w-lg w-full my-8 space-y-4">
        
        {/* Modal Top Close */}
        <div className="flex items-center justify-between text-white">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{isHi ? 'आपका विशिष्ट डिजिटल न्याय पास तैयार है' : 'Official Digital NyayaPass Issued'}</span>
          </span>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {cardContent}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-md bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isHi ? 'प्रिंट / सेव पास' : 'Print / Save Card'}</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>{isHi ? 'न्यायसेतु शुरू करें' : 'Continue to NyayaSetu →'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
