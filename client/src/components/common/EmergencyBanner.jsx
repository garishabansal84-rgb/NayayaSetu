import React, { useState } from 'react';
import { AlertCircle, X, ShieldAlert, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const EmergencyBanner = () => {
  const [visible, setVisible] = useState(true);
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-950 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
          </span>
          <span className="font-bold text-[#0A2540] whitespace-nowrap">{t.rightsBannerTitle}</span>
          <span className="text-slate-700 text-xs font-medium">
            {t.rightsBannerSub}
          </span>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-slate-700 p-1"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
