import React, { createContext, useContext, useState, useEffect } from 'react';

const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentGrievance, setCurrentGrievance] = useState('');
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [currentReferenceId, setCurrentReferenceId] = useState(`NYA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [evidenceData, setEvidenceData] = useState(null);
  const [activeDraft, setActiveDraft] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('Lucknow');
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');
  
  const [userProfile, setUserProfile] = useState({
    name: 'Tanvi Makhija',
    phone: '+91 98765 43210',
    email: 'citizen@nyayasetu.in',
    age: 28,
    occupation: 'Student',
    annualIncome: 180000,
    gender: 'FEMALE',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    socialCategory: 'OBC',
    ownedDocuments: ['DOC_AADHAAR', 'DOC_BANK_PASSBOOK']
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');

  const showToast = (msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const setJurisdiction = (dist, st) => {
    if (dist) setSelectedDistrict(dist);
    if (st) setSelectedState(st);
    setUserProfile(prev => ({
      ...prev,
      district: dist || prev.district,
      state: st || prev.state
    }));
  };

  const [casesHistory, setCasesHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('nyayasetu_registered_cases');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeTrackingCaseId, setActiveTrackingCaseId] = useState(null);

  const saveComplaintToHistory = (newCase) => {
    setCasesHistory((prev) => {
      const filtered = prev.filter(c => c.ref !== newCase.ref && c.id !== newCase.id);
      const updated = [newCase, ...filtered];
      try {
        localStorage.setItem('nyayasetu_registered_cases', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActiveTrackingCaseId(newCase.id || newCase.ref);
  };

  const updateDiagnosisAndRegister = (diag, customRefId = null) => {
    const ref = customRefId || currentReferenceId || `NYA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const registeredAt = diag?.registeredAt || now.toISOString();
    const timelineDays = diag?.timelineDays || diag?.remedy?.timelineDays || diag?.statutoryDeadlineDays || 15;
    const deadlineAt = diag?.deadlineAt || new Date(new Date(registeredAt).getTime() + (timelineDays * 24 * 60 * 60 * 1000)).toISOString();

    const enrichedDiag = {
      ...diag,
      registeredAt,
      deadlineAt,
      timelineDays
    };

    setCurrentDiagnosis(enrichedDiag);
    setCurrentReferenceId(ref);

    const caseObj = {
      id: ref,
      ref: ref,
      title: enrichedDiag.disputeTitle || enrichedDiag.category || 'Registered Dispute',
      category: enrichedDiag.category || 'Citizen Dispute',
      counterParty: enrichedDiag.oppositeParty || enrichedDiag.counterParty || 'Opposite Party',
      registeredAt,
      deadlineAt,
      timelineDays,
      rawText: currentGrievance,
      diagnosis: enrichedDiag
    };

    saveComplaintToHistory(caseObj);
  };

  const loadPreset = (preset) => {
    setCurrentGrievance(preset.text);
    if (preset.district) setSelectedDistrict(preset.district);
    if (preset.state) setSelectedState(preset.state);
    const ref = preset.ref || `NYA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setCurrentReferenceId(ref);
    if (preset.diagnosis) {
      updateDiagnosisAndRegister(preset.diagnosis, ref);
    }
    setActiveTab('triage');
  };

  return (
    <CaseContext.Provider value={{
      activeTab,
      setActiveTab,
      currentGrievance,
      setCurrentGrievance,
      currentDiagnosis,
      setCurrentDiagnosis,
      currentReferenceId,
      setCurrentReferenceId,
      evidenceData,
      setEvidenceData,
      activeDraft,
      setActiveDraft,
      casesHistory,
      setCasesHistory,
      selectedDistrict,
      setSelectedDistrict,
      selectedState,
      setSelectedState,
      setJurisdiction,
      userProfile,
      setUserProfile,
      loadPreset,
      updateDiagnosisAndRegister,
      saveComplaintToHistory,
      activeTrackingCaseId,
      setActiveTrackingCaseId,
      toastMessage,
      toastType,
      showToast
    }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};
