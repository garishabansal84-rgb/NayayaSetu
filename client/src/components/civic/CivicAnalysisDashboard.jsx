import React, { useState, useRef, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { apiAnalyzeCivicComplaint, INDIAN_STATES_DATA } from '../../services/api';
import { startSpeechRecognition, getLocalizedVoiceErrorMessage } from '../../services/voiceService';
import { LegalDispatchRelayModal } from '../drafting/LegalDispatchRelayModal';
import { 
  Sparkles, ShieldAlert, AlertTriangle, CheckCircle2, 
  Scale, FileText, Send, Copy, Printer, RotateCcw, 
  MapPin, Mic, MicOff, BookOpen, ExternalLink, HelpCircle, 
  ArrowRight, ShieldCheck, Clock, Building2, Phone, CheckSquare, Square, Share2
} from 'lucide-react';

const SAMPLE_CIVIC_PROMPTS = [
  {
    id: 'p1',
    label: '🗑️ Garbage & Sanitation Crisis',
    hindiLabel: '🗑️ कचरा भराव एवं सफाई संकट',
    category: 'Sanitation',
    text: 'A resident reports that garbage has not been collected in their locality for several weeks. The waste is overflowing and causing a foul smell and potential health risks. Multiple complaints have allegedly been made to the local authorities, but no action has been taken.'
  },
  {
    id: 'p2',
    label: '💡 Dark Streetlights & Night Theft',
    hindiLabel: '💡 बंद स्ट्रीट लाइटें एवं चोरी',
    category: 'Public Safety',
    text: 'The streetlights in my area have not been working for two months, and several accidents and theft incidents have occurred at night.'
  },
  {
    id: 'p3',
    label: '💰 Corrupt Bribe Demand by Officer',
    hindiLabel: '💰 सरकारी अधिकारी द्वारा रिश्वत मांग',
    category: 'Corruption',
    text: 'A government officer demanded money from me to process my application and refused to sign my file without cash.'
  },
  {
    id: 'p4',
    label: '🏠 Landlord Power Cut & Eviction',
    hindiLabel: '🏠 मकान मालिक द्वारा बिजली काटना',
    category: 'Housing',
    text: 'My landlord has disconnected my electricity and is threatening to throw me out without proper notice or court order.'
  },
  {
    id: 'p5',
    label: '🛣️ Dangerous Potholes & Road Hazard',
    hindiLabel: '🛣️ खतरनाक गड्ढे एवं दुर्घटना स्थल',
    category: 'Road & Infrastructure',
    text: 'The main connecting road has deep open craters and waterlogged potholes causing daily two-wheeler skid accidents. PWD contractor left the work incomplete.'
  },
  {
    id: 'p6',
    label: '🏥 Hospital Refusal of Emergency Care',
    hindiLabel: '🏥 अस्पताल द्वारा आपातकालीन इलाज से इंकार',
    category: 'Healthcare',
    text: 'A private hospital empaneled under PM-JAY refused emergency trauma admission to an accident victim without an upfront cash advance deposit of ₹50,000.'
  }
];

export const CivicAnalysisDashboard = () => {
  const { 
    selectedDistrict, 
    setSelectedDistrict, 
    selectedState, 
    setSelectedState, 
    setJurisdiction,
    showToast,
    setActiveTab,
    setCurrentDraftText,
    setCaseCategory
  } = useCase();

  const { language } = useLanguage();
  const { user, nyayaPass } = useAuth();
  const isHi = language === 'hi';

  const [complaintText, setComplaintText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [checkedEvidence, setCheckedEvidence] = useState({});
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [isRelayModalOpen, setIsRelayModalOpen] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState(() => {
    try {
      const saved = localStorage.getItem('nyayasetu_recent_civic_analyses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Inline voice recording
  const [isRecording, setIsRecording] = useState(false);
  const sessionRef = useRef(null);

  const stateKeys = Object.keys(INDIAN_STATES_DATA);
  const currentStateInfo = INDIAN_STATES_DATA[selectedState] || INDIAN_STATES_DATA['Uttar Pradesh'];
  const districtList = currentStateInfo.districts || [];

  const handleStateChange = (newSt) => {
    setSelectedState(newSt);
    const newStInfo = INDIAN_STATES_DATA[newSt];
    const defaultDist = newStInfo && newStInfo.districts && newStInfo.districts.length > 0 
      ? newStInfo.districts[0] 
      : 'Lucknow';
    setSelectedDistrict(defaultDist);
    setJurisdiction(defaultDist, newSt);
  };

  const handleDistrictChange = (newDist) => {
    setSelectedDistrict(newDist);
    setJurisdiction(newDist, selectedState);
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (sessionRef.current) {
        try { sessionRef.current.stop(); } catch (e) {}
        sessionRef.current = null;
      }
      setIsRecording(false);
      showToast(isHi ? 'आवाज़ रिकॉर्डिंग समाप्त।' : 'Voice recording stopped.', 'info');
      return;
    }

    const initial = complaintText.trim();
    setIsRecording(true);

    const session = startSpeechRecognition({
      language,
      onResult: (liveText) => {
        setComplaintText(initial ? (initial + ' ' + liveText) : liveText);
      },
      onError: (errCode) => {
        setIsRecording(false);
        const msg = getLocalizedVoiceErrorMessage(errCode, language);
        showToast(msg, 'error');
      },
      onEnd: () => {
        setIsRecording(false);
      }
    });

    if (session) {
      sessionRef.current = session;
      showToast(isHi ? 'माइक सक्रिय! अपनी शिकायत बोलें...' : 'Microphone active! Speak your complaint naturally...', 'success');
    }
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    const text = complaintText.trim();
    if (!text || text.length < 5) {
      showToast(isHi ? 'कृपया अपनी शिकायत का न्यूनतम 5 अक्षरों में विवरण लिखें।' : 'Please enter at least 5 characters describing your complaint.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await apiAnalyzeCivicComplaint({
        complaintText: text,
        district: selectedDistrict,
        state: selectedState,
        language
      });

      if (res.success && res.data) {
        setAnalysisResult(res.data);
        const refId = res.analysisId || ('CIVIC-' + Date.now());
        setAnalysisId(refId);

        // Save to recent analyses
        const newRecord = {
          id: refId,
          text: text.slice(0, 100) + '...',
          summary: res.data.summary,
          severity: res.data.severity,
          categories: res.data.categories,
          district: selectedDistrict,
          state: selectedState,
          timestamp: new Date().toISOString(),
          fullData: res.data
        };

        const updatedRecent = [newRecord, ...recentAnalyses.filter(r => r.id !== refId)].slice(0, 8);
        setRecentAnalyses(updatedRecent);
        try {
          localStorage.setItem('nyayasetu_recent_civic_analyses', JSON.stringify(updatedRecent));
        } catch (e) {}

        showToast(isHi ? 'नागरिक शिकायत का सफल AI विश्लेषण!' : 'Civic Complaint Analysis Completed!', 'success');
      } else {
        throw new Error(res.error || 'Failed to analyze complaint');
      }
    } catch (err) {
      showToast(err.message || 'Analysis error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDraft = () => {
    if (!analysisResult?.complaintDraft) return;
    navigator.clipboard.writeText(analysisResult.complaintDraft);
    setCopiedDraft(true);
    showToast(isHi ? 'शिकायत प्रारूप कॉपी हो गया!' : 'Complaint draft copied to clipboard!', 'success');
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadSample = (sampleText) => {
    setComplaintText(sampleText);
    setAnalysisResult(null);
  };

  const handleLoadRecent = (rec) => {
    setComplaintText(rec.fullData?.summary || rec.text);
    setAnalysisResult(rec.fullData);
    setAnalysisId(rec.id);
    setSelectedDistrict(rec.district || selectedDistrict);
    setSelectedState(rec.state || selectedState);
    showToast(isHi ? 'पिछला विश्लेषण लोड किया गया।' : 'Loaded past analysis report.', 'info');
  };

  const toggleEvidenceItem = (idx) => {
    setCheckedEvidence(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getSeverityBadge = (sev) => {
    const s = (sev || 'Medium').toLowerCase();
    if (s === 'critical') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>CRITICAL SEVERITY</span>
        </span>
      );
    }
    if (s === 'high') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>HIGH SEVERITY</span>
        </span>
      );
    }
    if (s === 'medium') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>MEDIUM SEVERITY</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>LOW SEVERITY</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] rounded-xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-amber-400/5 -skew-x-12 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI CIVIC COMPLAINT & PUBLIC GRIEVANCE ANALYZER</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
            {isHi ? 'नागरिक शिकायत एवं लोक समाधान AI विश्लेषण' : 'Civic Complaint Analysis & Statutory Guidance Engine'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {isHi
              ? 'सफाई, भ्रष्टाचार, सड़क, बिजली, मकान मालिक विवाद, उपभोक्ता अधिकार, महिला सुरक्षा अथवा किसी भी प्रशासनिक समस्या का AI द्वारा विधिक मूल्यांकन, अधिकार एवं शिकायत प्रारूप प्राप्त करें।'
              : 'Describe any civic, public service, safety, corruption, consumer, or governance issue. Our AI instantly classifies severity, cites relevant Indian acts & constitutional provisions, maps responsible authorities, generates evidence checklists, and drafts a ready-to-file formal application.'}
          </p>
        </div>
      </div>

      {/* Main Input Studio & Jurisdiction Control */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-6">
        
        {/* Jurisdiction Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{isHi ? 'राज्य / State:' : 'Select State:'}</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
            >
              {stateKeys.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{isHi ? 'जिला / District:' : 'Select District:'}</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
            >
              {districtList.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <div className="p-2 rounded bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
              <span>{isHi ? 'अधिकार क्षेत्र: ' : 'Active Jurisdiction: '}<strong>{selectedDistrict}, {selectedState}</strong></span>
            </div>
          </div>
        </div>

        {/* Sample Prompt Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            {isHi ? '💡 त्वरित उदाहरण शिकायतें (1-Click Sample Issues):' : '💡 Common Civic Issues (Click to populate):'}
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_CIVIC_PROMPTS.map(sample => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample.text)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
              >
                {isHi ? sample.hindiLabel : sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea Input */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                {isHi ? 'अपनी नागरिक/विधिक समस्या का विवरण दर्ज करें:' : 'Describe Your Civic, Public Service, or Legal Complaint:'} *
              </label>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>{complaintText.length} characters</span>
                {complaintText && (
                  <button
                    type="button"
                    onClick={() => { setComplaintText(''); setAnalysisResult(null); }}
                    className="text-red-600 hover:underline cursor-pointer"
                  >
                    {isHi ? 'साफ करें' : 'Clear'}
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={5}
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder={isHi 
                  ? 'उदा. "हमारे इलाके में पिछले 3 हफ्तों से कचरा नहीं उठाया गया है। कूड़ा सड़ रहा है और बदबू के कारण बीमारियां फैलने का खतरा है। कई बार नगर निगम में शिकायत की मगर कोई कार्रवाई नहीं हुई..."' 
                  : 'E.g., "A resident reports that garbage has not been collected in their locality for several weeks. The waste is overflowing and causing a foul smell and potential health risks. Multiple complaints have been made to local authorities, but no action has been taken..."'}
                className="w-full p-4 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:border-transparent leading-relaxed"
                required
              />

              {/* Voice Mic Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={'absolute right-3 bottom-4 p-2.5 rounded-full transition-all cursor-pointer shadow-sm ' + (
                  isRecording 
                    ? 'bg-red-600 text-white animate-bounce' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                )}
                title={isRecording ? 'Stop Voice Recording' : 'Dictate Complaint in your Voice'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Analyze Action Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !complaintText.trim()}
              className="flex-1 py-3 px-6 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{loading ? (isHi ? 'AI द्वारा विश्लेषण हो रहा है...' : 'Analyzing Complaint with AI Engine...') : (isHi ? 'शिकायत का विश्लेषण करें' : 'Analyse Complaint (AI Civic Engine)')}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </form>

      </div>

      {/* RESULTS DISPLAY DASHBOARD */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Actions & Reference Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 text-white rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                CASE ID: {analysisId || 'CIVIC-2026-REPORT'}
              </span>
              <span className="text-[11px] text-slate-400">
                • {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isHi ? 'प्रिंट रिपोर्ट' : 'Print Report'}</span>
              </button>

              <button
                onClick={() => { setAnalysisResult(null); setComplaintText(''); }}
                className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isHi ? 'नई शिकायत दर्ज करें' : 'Submit Another Complaint'}</span>
              </button>
            </div>
          </div>

          {/* 8. Urgency Alert (If present or High/Critical) */}
          {(analysisResult.urgencyAlert || analysisResult.severity === 'Critical') && (
            <div className="p-4 rounded-xl bg-red-50 border-2 border-red-500 text-red-950 flex items-start gap-3 shadow-md">
              <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <strong className="text-red-900 font-extrabold block uppercase tracking-wide">
                  ⚠️ URGENT CIVIC & SAFETY ALERT
                </strong>
                <p className="text-red-800 leading-relaxed font-medium">
                  {analysisResult.urgencyAlert || "⚠️ This situation may require immediate emergency assistance. Please contact the appropriate emergency services or local authorities immediately."}
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-xs font-bold text-red-900">
                  <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300">Police: 112</span>
                  <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300">Women Helpline: 1090 / 181</span>
                  <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300">Anti-Corruption: 1064</span>
                  <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300">Civic Nodal: 1533</span>
                </div>
              </div>
            </div>
          )}

          {/* 1, 2, 3. Summary, Category & Severity Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  1. ISSUE CLASSIFICATION & SUMMARY
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {analysisResult.summary}
                </h3>
              </div>

              <div>
                {getSeverityBadge(analysisResult.severity)}
              </div>
            </div>

            {/* Categories & Key Concerns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="font-bold text-slate-700 block mb-2">
                  2. {isHi ? 'पहचाने गए श्रेणी वर्ग / Categories:' : 'Detected Categories:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(analysisResult.categories || []).map((cat, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 font-bold border border-blue-200">
                      🏷️ {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-2">
                  {isHi ? 'पहचाने गए मुख्य बिंदु / Key Concerns:' : 'Key Concerns Detected:'}
                </span>
                <ul className="space-y-1 text-slate-600">
                  {(analysisResult.keyConcerns || []).map((concern, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 4. Citizen Rights & Relevant Indian Laws */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Scale className="w-5 h-5 text-[#0A2540]" />
              <span>4. {isHi ? 'नागरिक अधिकार एवं प्रासंगिक भारतीय कानून (Citizen Rights & Laws)' : 'Citizen Rights & Relevant Indian Laws'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(analysisResult.rightsAndLaws || []).map((law, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#0A2540] font-extrabold text-sm block">
                      📜 {law.lawOrArticle}
                    </strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      STATUTORY
                    </span>
                  </div>
                  <span className="text-slate-800 font-bold block">{law.provision}</span>
                  <p className="text-slate-600 leading-relaxed">{law.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Responsible Authorities */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-blue-700" />
              <span>5. {isHi ? 'उत्तरदायी प्रशासनिक संस्थाएं एवं निवारण पटल (Responsible Authorities)' : 'Responsible Authorities & Redressal Channels'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {(analysisResult.responsibleAuthorities || []).map((auth, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-blue-50/40 border border-blue-200 space-y-2">
                  <strong className="text-blue-950 font-bold text-sm block">
                    🏛️ {auth.name}
                  </strong>
                  <span className="text-[11px] text-slate-700 block font-medium">
                    <strong>Dept:</strong> {auth.department}
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    <strong>Role:</strong> {auth.role}
                  </p>
                  <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-bold text-blue-800">
                    <span>{auth.portalOrContact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6 & 7. Recommended Actions & Dynamic Evidence Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 6. Recommended Next Steps */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>6. {isHi ? 'नागरिक हेतु संस्तुत कदम (Recommended Actions)' : 'Recommended Next Steps'}</span>
              </div>

              <div className="space-y-3">
                {(analysisResult.recommendedActions || []).map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/40 border border-emerald-200 text-xs">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                      {act.step || (idx + 1)}
                    </span>
                    <div className="space-y-0.5">
                      <strong className="text-slate-900 font-bold">{act.title}</strong>
                      <p className="text-slate-600 leading-relaxed">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Evidence Checklist */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                  <span>7. {isHi ? 'साक्ष्य चेकलिस्ट (Evidence Checklist)' : 'Dynamic Evidence Checklist'}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {Object.values(checkedEvidence).filter(Boolean).length} / {(analysisResult.evidenceChecklist || []).length} ready
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {(analysisResult.evidenceChecklist || []).map((evi, idx) => (
                  <div 
                    key={idx}
                    onClick={() => toggleEvidenceItem(idx)}
                    className={'p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ' + (
                      checkedEvidence[idx] 
                        ? 'bg-purple-50 border-purple-300 text-purple-950' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    )}
                  >
                    <div className="mt-0.5">
                      {checkedEvidence[idx] ? (
                        <CheckSquare className="w-4 h-4 text-purple-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <strong className="font-bold">{evi.item}</strong>
                      <p className="text-[11px] text-slate-600">{evi.whyNeeded}</p>
                      {evi.tip && (
                        <span className="text-[10px] text-purple-700 font-semibold block">
                          💡 Tip: {evi.tip}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 9. Suggested Formal Complaint Draft */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <FileText className="w-5 h-5 text-[#0A2540]" />
                <span>9. {isHi ? 'प्रस्तावित औपचारिक शिकायत प्रारूप (Suggested Complaint Draft)' : 'Suggested Formal Complaint Application'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDraft}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedDraft ? (isHi ? '✓ कॉपी हुआ' : '✓ Copied!') : (isHi ? 'ड्राफ्ट कॉपी करें' : 'Copy Draft')}</span>
                </button>

                <button
                  onClick={() => setIsRelayModalOpen(true)}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isHi ? '1-क्लिक व्हाट्सएप / ईमेल रिले' : '1-Click WhatsApp & Email Relay'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-96 overflow-y-auto">
              {analysisResult.complaintDraft}
            </div>
          </div>

          {/* 10. Important Disclaimer */}
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-bold uppercase tracking-wider block">10. IMPORTANT CIVIC DISCLAIMER</strong>
              <p className="text-amber-900 leading-relaxed font-medium">
                {analysisResult.disclaimer || "This analysis is intended for informational and civic guidance purposes only. It does not constitute professional legal advice. Please verify legal information and consult a qualified professional where necessary."}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* RECENT ANALYSES HISTORY SECTION */}
      {recentAnalyses.length > 0 && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Clock className="w-5 h-5 text-slate-600" />
              <span>{isHi ? 'हाल के शिकायत विश्लेषण (Recent Analyses)' : 'Recent Complaint Analyses History'}</span>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {recentAnalyses.length} saved
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentAnalyses.map((rec) => (
              <div
                key={rec.id}
                onClick={() => handleLoadRecent(rec)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-[#0A2540] bg-slate-50 hover:bg-white transition-all cursor-pointer space-y-2 text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-bold">{rec.id}</span>
                  {getSeverityBadge(rec.severity)}
                </div>

                <p className="font-bold text-slate-900 line-clamp-2 group-hover:text-[#0A2540]">
                  {rec.summary || rec.text}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>📍 {rec.district}, {rec.state}</span>
                  <span>{new Date(rec.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Channel Legal Dispatch Relay Modal */}
      {isRelayModalOpen && analysisResult?.complaintDraft && (
        <LegalDispatchRelayModal
          isOpen={isRelayModalOpen}
          onClose={() => setIsRelayModalOpen(false)}
          draftText={analysisResult.complaintDraft}
          referenceId={analysisId || 'CIVIC-2026'}
          statutoryDiagnosis={{
            primaryStatute: (analysisResult.rightsAndLaws && analysisResult.rightsAndLaws[0]?.lawOrArticle) || 'Civic Empowerment Act',
            forum: (analysisResult.responsibleAuthorities && analysisResult.responsibleAuthorities[0]?.name) || 'Municipal Corporation',
            statuteTitle: (analysisResult.categories && analysisResult.categories[0]) || 'Civic Grievance'
          }}
        />
      )}

    </div>
  );
};
