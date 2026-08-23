import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCase } from '../../context/CaseContext';
import { 
  Scale, Shield, PhoneCall, Globe, CheckCircle2, 
  ExternalLink, FileText, Award, MapPin 
} from 'lucide-react';

export const Footer = () => {
  const { language, t } = useLanguage();
  const { setActiveTab } = useCase();

  return (
    <footer className="bg-[#0A2540] text-slate-300 border-t-4 border-t-[#D97706] pt-12 pb-8 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Institutional Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-700">
          
          {/* Col 1: National Portal Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-amber-400">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-wide">
                {t.portalTitle}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footerDesc}
            </p>
            <div className="pt-2 text-[11px] text-amber-400/90 font-medium italic">
              {t.footerMotto}
            </div>
          </div>

          {/* Col 2: Citizen Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footerModulesHeading}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => setActiveTab('triage')} className="hover:text-white transition-colors">
                  {t.navTriage}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('evidence')} className="hover:text-white transition-colors">
                  {t.navEvidence}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('drafting')} className="hover:text-white transition-colors">
                  {t.navDrafting}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('schemes')} className="hover:text-white transition-colors">
                  {t.navSchemes}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('jurisdiction')} className="hover:text-white transition-colors">
                  {t.navJurisdiction}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Statutory Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footerPortalsHeading}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="https://www.india.gov.in/category/justice-law-grievances/subcategory/courts-tribunals/details/e-daakhil-portal" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>e-Daakhil / e-Jagriti (Consumer Commission)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://rtionline.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>RTI Online (Gov of India)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://nalsa.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>NALSA Tele-Law Free Legal Aid</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>CPGRAMS Public Grievances</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: National Emergency & Legal Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footerHelplinesHeading}
            </h4>
            
            <div className="bg-slate-900/80 p-3 rounded border border-slate-700 space-y-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">{t.consumerTollFreeLabel}</div>
              <div className="text-sm font-bold text-amber-400">1915 / 1800-11-4000</div>
              <div className="text-[10px] text-slate-400">{t.consumerTiming}</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded border border-slate-700 space-y-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">{t.legalAidLabel}</div>
              <div className="text-sm font-bold text-emerald-400">14468 (Tele-Law)</div>
              <div className="text-[10px] text-slate-400">{t.legalAidAct}</div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Accessibility Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} {t.footerCopyright}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('wiki')} className="hover:text-white">
              Statutory Disclaimers
            </button>
            <span>•</span>
            <span className="text-slate-400">GIGW & WCAG 2.1 AA Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
