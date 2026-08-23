import React from 'react';
import { SAMPLE_GRIEVANCES } from '../../services/mockData';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingBag, Home, FileText, ShieldAlert, ArrowRight, Zap, Scale } from 'lucide-react';

export const SampleGrievances = () => {
  const { loadPreset } = useCase();
  const { language } = useLanguage();

  const iconMap = {
    ShoppingBag: ShoppingBag,
    Home: Home,
    FileText: FileText,
    ShieldAlert: ShieldAlert
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#D97706]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
            {language === 'hi' ? 'वास्तविक कानूनी परीक्षण मामले (Benchmark Precedents)' : 'Simulate Benchmark Citizen Disputes:'}
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          {language === 'hi' ? '1-क्लिक स्वचालित परीक्षण' : '1-Click Automated Simulation'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {SAMPLE_GRIEVANCES.map((item) => {
          const Icon = iconMap[item.icon] || FileText;
          return (
            <div
              key={item.id}
              onClick={() => loadPreset(item)}
              className="gov-card gov-card-hover p-4 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-[#0A2540] group-hover:bg-slate-200 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#0A2540] group-hover:text-[#1E3A8A] transition-colors line-clamp-2">
                  {language === 'hi' ? item.hindiTitle : item.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.text}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{item.amount}</span>
                <span className="flex items-center gap-1 text-[#1E3A8A] font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>{language === 'hi' ? 'परीक्षण करें' : 'Simulate'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
