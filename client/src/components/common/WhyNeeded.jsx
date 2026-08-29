import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getWhyNeededInfo } from '../../services/whyNeededCatalog';
import { HelpCircle, Info, ShieldCheck, Scale, Check, X, Sparkles, BookOpen } from 'lucide-react';

export const WhyNeeded = ({ 
  code = 'PROOF_OF_PAYMENT', 
  customTitle = null, 
  customWhy = null,
  variant = 'button', // 'button' | 'icon' | 'badge' | 'inline'
  className = ''
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const [isOpen, setIsOpen] = useState(false);

  const info = getWhyNeededInfo(code);
  const displayTitle = customTitle || (isHi ? info.hindiTitle : info.title);
  const displayWhy = customWhy || (isHi ? info.hindiWhyNeeded : info.whyNeeded);

  return (
    <>
      {/* Trigger Variants */}
      {variant === 'button' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={`inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200/80 transition-colors cursor-pointer select-none ${className}`}
          title={isHi ? 'यह दस्तावेज़ क्यों आवश्यक है?' : 'Why is this document needed?'}
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>{isHi ? 'यह क्यों आवश्यक है?' : 'Why is this needed?'}</span>
        </button>
      )}

      {variant === 'icon' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={`p-1 rounded-full text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer select-none ${className}`}
          title={isHi ? 'यह क्यों आवश्यक है?' : 'Why is this needed?'}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      )}

      {variant === 'badge' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer ${className}`}
        >
          <Info className="w-3 h-3 text-amber-600" />
          <span>{isHi ? 'महत्व समझें' : 'Why needed?'}</span>
        </button>
      )}

      {/* Interactive Explanation Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="gov-card bg-white rounded-xl shadow-2xl border border-slate-300 max-w-md w-full p-6 text-slate-900 space-y-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    {isHi ? 'वैधानिक साक्ष्य आवश्यकता' : 'Statutory Evidentiary Basis'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {displayTitle}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Plain-Language Explanation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>{isHi ? 'यह आपके केस के लिए क्यों जरूरी है?' : 'Why is this needed for your case?'}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {displayWhy}
              </p>
            </div>

            {/* Statutory Grounding & Case Impact */}
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200/80 space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-amber-900 block">
                  {isHi ? 'संबद्ध भारतीय कानून / धारा:' : 'Governing Indian Statute:'}
                </span>
                <span className="font-semibold text-amber-950 font-serif">
                  {info.statute}
                </span>
              </div>

              <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-200/80 space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-emerald-900 block">
                  {isHi ? 'केस पर प्रभाव:' : 'Direct Impact on Case:'}
                </span>
                <span className="font-semibold text-emerald-950">
                  {info.impactOnCase}
                </span>
              </div>
            </div>

            {/* Recommended Format */}
            {info.recommendedFormats && (
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>{isHi ? 'स्वीकृत प्रारूप:' : 'Accepted Formats:'}</span>
                <span className="font-medium text-slate-700 font-mono text-[10px]">
                  {info.recommendedFormats}
                </span>
              </div>
            )}

            {/* Action Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 rounded-lg bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHi ? 'समझ गया / बंद करें' : 'Understood, Got it'}</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default WhyNeeded;
