import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Globe, Eye, Type, PhoneCall, ShieldAlert 
} from 'lucide-react';

export const TopUtilityBar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSize]);

  const toggleHighContrast = () => {
    const nextState = !highContrast;
    setHighContrast(nextState);
    if (nextState) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const languagesList = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'ur', label: 'اردو (Urdu)' },
    { code: 'as', label: 'অসমীয়া (Assamese)' },
    { code: 'sa', label: 'संस्कृतम् (Sanskrit)' },
    { code: 'hinglish', label: 'Hinglish' },
  ];

  return (
    <div className="bg-[#0A2540] text-slate-200 text-xs border-b border-slate-700/60 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: National Emblem Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-bold text-white tracking-wide">भारत सरकार</span>
            <span className="text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300 font-semibold">{t.govIndia}</span>
          </div>
          <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            {t.digitalIndia}
          </span>
        </div>

        {/* Right: National Helplines & Accessibility Controls */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          
          {/* Statutory Helplines Strip */}
          <div className="hidden lg:flex items-center gap-2.5 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <PhoneCall className="w-3 h-3" />
              <span>{t.helplinesLabel}</span>
            </span>
            <a href="tel:1915" className="hover:text-white underline decoration-slate-500 hover:decoration-white font-medium">{t.consumerHelpline}</a>
            <span className="text-slate-600">•</span>
            <a href="tel:14468" className="hover:text-white underline decoration-slate-500 hover:decoration-white font-medium">{t.legalAidHelpline}</a>
            <span className="text-slate-600">•</span>
            <a href="tel:1076" className="hover:text-white underline decoration-slate-500 hover:decoration-white font-medium">{t.cmPortal}</a>
          </div>

          <div className="h-3 w-px bg-slate-700 hidden sm:block"></div>

          {/* Accessibility: Font Size Toolbar */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded px-1 py-0.5" title="Adjust text size for readability">
            <button
              onClick={() => setFontSize('small')}
              className={`px-1.5 py-0.5 rounded font-mono font-bold ${fontSize === 'small' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              title="Small Text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded font-mono font-bold ${fontSize === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              title="Standard Text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded font-mono font-bold ${fontSize === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              title="Large Text"
            >
              A+
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold transition-all shadow-xs ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-300 ring-2 ring-yellow-400'
                : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
            title="High Contrast Mode for Low-Vision & Visual Impairment"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>{highContrast ? t.standardContrast : t.highContrast}</span>
          </button>

          {/* Regional Languages Dropdown */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded px-2 py-0.5">
            <Globe className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-slate-100 text-xs font-bold focus:outline-none cursor-pointer py-0.5"
            >
              {languagesList.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-medium">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};
