import React, { useState } from 'react';
import { useCase } from './context/CaseContext';
import { useLanguage } from './context/LanguageContext';
import { TopUtilityBar } from './components/common/TopUtilityBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { LandingView } from './components/home/LandingView';
import { DiagnosisSection } from './components/diagnosis/DiagnosisSection';
import { EvidenceVault } from './components/evidence/EvidenceVault';
import { DraftingStudio } from './components/drafting/DraftingStudio';
import { SchemeMatcher } from './components/schemes/SchemeMatcher';
import { JurisdictionFinder } from './components/jurisdiction/JurisdictionFinder';
import { CaseTracker } from './components/tracker/CaseTracker';
import { KnowledgeWiki } from './components/wiki/KnowledgeWiki';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedFeatureGate } from './components/auth/ProtectedFeatureGate';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const App = () => {
  const { activeTab, toastMessage, toastType } = useCase();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0A2540] selection:text-white">
      
      {/* Top Government Utility & Accessibility Bar */}
      <TopUtilityBar />

      {/* Main Institutional Navigation Bar */}
      <Navbar />

      {/* Emergency & Citizen Helpline Alert Banner */}
      <EmergencyBanner />

      {/* Main Workspace / View Router */}
      <main className="flex-1">
        {activeTab === 'home' && <LandingView />}
        {activeTab === 'triage' && (
          <ProtectedFeatureGate featureTitle="AI Legal Triage & Rights Diagnosis">
            <DiagnosisSection />
          </ProtectedFeatureGate>
        )}
        {activeTab === 'evidence' && (
          <ProtectedFeatureGate featureTitle="Forensic Document OCR & Evidence Vault">
            <EvidenceVault />
          </ProtectedFeatureGate>
        )}
        {activeTab === 'drafting' && (
          <ProtectedFeatureGate featureTitle="Statutory Notice & Formal Legal Drafting Studio">
            <DraftingStudio />
          </ProtectedFeatureGate>
        )}
        {activeTab === 'schemes' && (
          <ProtectedFeatureGate featureTitle="Reverse Welfare Scheme Matcher & Document Gap Engine">
            <SchemeMatcher />
          </ProtectedFeatureGate>
        )}
        {activeTab === 'jurisdiction' && (
          <ProtectedFeatureGate featureTitle="National Jurisdiction Directory & Legal Aid Finder">
            <JurisdictionFinder />
          </ProtectedFeatureGate>
        )}
        {activeTab === 'tracker' && (
          <ProtectedFeatureGate featureTitle="Statutory Timeline & Action Tracker">
            <CaseTracker />
          </ProtectedFeatureGate>
        )}
        {activeTab === 'wiki' && <KnowledgeWiki />}
      </main>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
          <div className={`p-4 rounded-lg shadow-xl border flex items-start gap-3 ${
            toastType === 'success'
              ? 'bg-[#0A2540] text-white border-slate-700'
              : toastType === 'error'
              ? 'bg-red-900 text-white border-red-700'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}>
            {toastType === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
            {toastType === 'error' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
            {toastType === 'info' && <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />}
            <div className="text-xs font-medium leading-relaxed pr-2">
              {toastMessage}
            </div>
          </div>
        </div>
      )}

      {/* Citizen Authentication & NyayaPass Modal */}
      <AuthModal />

      {/* Official Institutional Footer */}
      <Footer />

    </div>
  );
};

export default App;
