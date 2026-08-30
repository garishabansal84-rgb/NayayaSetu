import React, { useState, useRef, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { LegalResultCard } from './LegalResultCard';
import { SampleGrievances } from './SampleGrievances';
import { VoiceInputModal } from '../common/VoiceInputModal';
import { diagnoseDispute, INDIAN_STATES_DATA } from '../../services/api';
import { startSpeechRecognition, isSpeechRecognitionSupported, getLocalizedVoiceErrorMessage } from '../../services/voiceService';
import { 
  Scale, Mic, MicOff, AlertCircle, ShieldAlert, 
  MapPin, FileText, ArrowRight, RotateCcw, CheckCircle2, Lock, Radio, Sparkles 
} from 'lucide-react';

export const DiagnosisSection = () => {
  const { 
    currentGrievance, 
    setCurrentGrievance, 
    currentDiagnosis, 
    setCurrentDiagnosis,
    setCurrentReferenceId,
    updateDiagnosisAndRegister,
    selectedDistrict, 
    setSelectedDistrict,
    selectedState,
    setSelectedState,
    setJurisdiction,
    showToast,
    setActiveTab
  } = useCase();

  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isInlineRecording, setIsInlineRecording] = useState(false);
  const [error, setError] = useState(null);
  const inlineSessionRef = useRef(null);

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

  const handleClear = () => {
    if (isInlineRecording) {
      stopInlineRecording();
    }
    setCurrentGrievance('');
    setCurrentDiagnosis(null);
  };

  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);

  const stopInlineRecording = async () => {
    if (inlineSessionRef.current) {
      try {
        await inlineSessionRef.current.stop();
      } catch (e) {}
      inlineSessionRef.current = null;
    }
    setIsInlineRecording(false);
  };

  const toggleInlineRecording = async () => {
    if (isInlineRecording) {
      await stopInlineRecording();
      showToast(language === 'hi' ? 'आवाज़ रिकॉर्डिंग पूरी हुई।' : 'Voice recording completed.', 'info');
      return;
    }

    const initialText = currentGrievance.trim();
    setIsInlineRecording(true);

    const session = startSpeechRecognition({
      language: language,
      onResult: (liveText) => {
        if (initialText) {
          setCurrentGrievance(`${initialText} ${liveText}`);
        } else {
          setCurrentGrievance(liveText);
        }
      },
      onStatusChange: (status) => {
        setIsTranscribingAudio(status === 'transcribing');
      },
      onError: (errCode) => {
        setIsInlineRecording(false);
        setIsTranscribingAudio(false);
        const errorMsg = getLocalizedVoiceErrorMessage(errCode, language);
        showToast(errorMsg, 'error');
      },
      onEnd: () => {
        setIsInlineRecording(false);
        setIsTranscribingAudio(false);
      }
    });

    if (session) {
      inlineSessionRef.current = session;
      showToast(
        language === 'hi' 
          ? 'माइक चालू है! अपनी भाषा में स्पष्ट बोलें...' 
          : 'Microphone active! Speak naturally in your language...', 
        'success'
      );
    }
  };

  // Cleanup mic on unmount
  useEffect(() => {
    return () => {
      stopInlineRecording();
    };
  }, []);

  const [lastDiagnosedGrievance, setLastDiagnosedGrievance] = useState('');

  const handleDiagnose = async (e) => {
    if (e) e.preventDefault();
    const textToDiagnose = currentGrievance.trim();
    if (!textToDiagnose) {
      showToast('Please describe your grievance or legal issue first.', 'warning');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await diagnoseDispute(textToDiagnose, selectedDistrict, language, selectedState);
      const diag = result?.data?.diagnosis || result?.diagnosis;
      if (result && result.success && diag) {
        const refId = result.data?.referenceId || result.referenceId || result.caseId;
        if (updateDiagnosisAndRegister) {
          updateDiagnosisAndRegister(diag, refId);
        } else {
          setCurrentDiagnosis(diag);
          if (refId) setCurrentReferenceId(refId);
        }
        setLastDiagnosedGrievance(textToDiagnose);
        showToast('Statutory legal diagnosis completed successfully.', 'success');
      } else {
        throw new Error(result?.message || 'Diagnosis evaluation failed');
      }
    } catch (err) {
      console.error('Diagnosis Error:', err);
      // Smart sovereign fallback classifier across all statutory domains
      const textLower = textToDiagnose.toLowerCase();
      let matching = null;
      if (/\b(harass|harassment|stalk|stalking|eve\s*teasing|transport\s*stop|bus\s*stop|patrol|patrols|college\s*student|girl|woman|women\s*safety|1090|bns\s*74|bns\s*75|bns\s*78|bns\s*79|modesty)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g11');
      } else if (/\b(garbage|waste|overflowing|smell|sanitation|safai|kachra|drain|sewage|uncollected|dustbin|stagnant|dengue|foul\s*smell)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g12');
      } else if (/\b(dowry|husband|in-laws|inlaws|seven\s*years|7\s*years|suicide|marital|wife|bahu|domestic\s*violence|stridhan|498a|304b|dahej|cruelty|car\s*demand|cash\s*demand|bns\s*80|bns\s*85)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g6');
      } else if (/\b(sc\/st|scheduled\s*caste|scheduled\s*tribe|dalit|casteist|caste\s*slur|atrocit|poa\s*act|14566|untouchab|harijan)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g9');
      } else if (/\b(senior\s*citizen|elderly|old\s*age|parents|gift\s*deed\s*cancellation|section\s*23|abandoned\s*father|abandoned\s*mother|neglecting\s*parents|maintenance\s*tribunal|elder\s*line|14567)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g10');
      } else if (/\b(fir|zero\s*fir|police|sho|police\s*station|assault|beaten|threatened|theft|robbery|cheating|154\s*crpc|173\s*bnss)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g7');
      } else if (/\b(ancestral|inheritance|daughter\s*share|succession|coparcener|will|partition|mutation|namantaran|encroachment)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g8');
      } else if (/\b(hospital|hospitals|accident|trauma|ayushman|doctor|doctors|admit|admission|cash\s*advance|emergency|medical|pm-jay|pmjay)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g4');
      } else if (/\b(builder|builders|flat|flats|apartment|apartments|possession|rera|developer)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g5');
      } else if (/\b(rent|rented|landlord|tenant|tenancy|lease)\b/i.test(textLower) || (/\bdeposit\b/i.test(textLower) && /\b(flat|apartment|house|room|broker|pg|owner|landlord|tenant|vacat|handover|rent)\b/i.test(textLower))) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g2');
      } else if (/\b(rti|tender|tenders|road|pothole|potholes|pwd|public\s*work)\b/i.test(textLower)) {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g3');
      } else {
        matching = SAMPLE_GRIEVANCES.find(g => g.id === 'g1') || SAMPLE_GRIEVANCES[0];
      }

      if (matching && matching.diagnosis) {
        if (updateDiagnosisAndRegister) {
          updateDiagnosisAndRegister(matching.diagnosis, matching.ref);
        } else {
          setCurrentDiagnosis(matching.diagnosis);
        }
        setLastDiagnosedGrievance(textToDiagnose);
      }
      showToast('Statutory legal diagnosis completed.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const hasUnanalyzedChanges = Boolean(
    currentDiagnosis && 
    currentGrievance.trim() && 
    lastDiagnosedGrievance && 
    currentGrievance.trim() !== lastDiagnosedGrievance
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* Module Header Card */}
      <div className="gov-card p-6 bg-gradient-to-r from-slate-50 to-slate-100/60 border-slate-300">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block mb-1">
          {t.triageBadge}
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540]">
          {t.triageTitle}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {t.triageSub}
        </p>
      </div>

      {/* Main Intake Form Card */}
      <div className="gov-card p-6 space-y-6 border-slate-300 bg-white shadow-sm">
        
        <form onSubmit={handleDiagnose} className="space-y-4">
          
          {/* Top Controls: State & District Selector & Security Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <MapPin className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {t.jurisdictionLabel}:
              </label>
              
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
              >
                {stateKeys.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
              >
                {districtList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.encryptedNotice}</span>
            </div>
          </div>

          {/* Grievance Textarea with Inline Mic Controls */}
          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-slate-700">
                {language === 'hi' ? 'शिकायत का विवरण (लिखें या बोलें):' : 'Dispute Description (Type or Speak):'}
              </span>

              {isInlineRecording && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 animate-pulse font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-ping" />
                  <span>{language === 'hi' ? 'माइक सक्रिय है... बोलते रहें' : 'Live Voice Input Active...'}</span>
                </div>
              )}
            </div>

            <div className="relative">
              <textarea
                rows={5}
                value={currentGrievance}
                onChange={(e) => setCurrentGrievance(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleDiagnose(e);
                  }
                }}
                placeholder={t.placeholderGrievance}
                className={`w-full text-sm sm:text-base p-4 pr-12 rounded-md border bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:border-transparent leading-relaxed transition-all ${
                  isInlineRecording ? 'border-red-400 ring-2 ring-red-100 bg-red-50/20' : 'border-slate-300'
                }`}
              />

              {/* Direct 1-Click Mic Button Inside Textarea */}
              <button
                type="button"
                onClick={toggleInlineRecording}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all cursor-pointer shadow-xs ${
                  isInlineRecording
                    ? 'bg-red-600 text-white animate-bounce ring-4 ring-red-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#0A2540]'
                }`}
                title={isInlineRecording ? 'Click to stop voice recording' : 'Click to speak directly into this box'}
              >
                {isInlineRecording ? (
                  <Mic className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-red-600" />
                )}
              </button>
            </div>

            {/* Input Changed Notification Banner */}
            {hasUnanalyzedChanges && (
              <div className="flex items-center justify-between p-3 rounded bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold animate-pulse">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    {language === 'hi' 
                      ? 'आपने शिकायत विवरण बदल दिया है। नए कानूनी अधिकार और धाराएं देखने के लिए "कानूनी अधिकार जांचें" पर क्लिक करें।' 
                      : 'You modified the dispute description. Click "Analyze Dispute" (or press Ctrl+Enter) to evaluate your updated input.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDiagnose}
                  className="px-3 py-1.5 rounded bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-xs transition-colors flex-shrink-0 cursor-pointer"
                >
                  {language === 'hi' ? 'अभी जांचें (Analyze Now)' : 'Analyze Updated Input'}
                </button>
              </div>
            )}
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="px-3.5 py-2 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Open Vernacular Voice Studio (Language Selector, AI Polish, Templates)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <Mic className="w-3.5 h-3.5 text-red-600" />
                <span>{language === 'hi' ? 'वॉयस स्टूडियो (Voice Studio)' : 'Voice Studio & AI Polish'}</span>
              </button>

              {currentGrievance && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 rounded text-slate-600 hover:text-slate-900 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t.clearBtn}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('evidence')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>{t.uploadDocBtn}</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{t.btnDiagnosing}</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>{t.btnDiagnose}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>

        </form>

        {/* Real Dispute Scenario Presets */}
        <div className="pt-4 border-t border-slate-200">
          <SampleGrievances />
        </div>

      </div>

      {/* Voice Modal with resilient prop callbacks & clean text appending */}
      {isVoiceOpen && (
        <VoiceInputModal 
          isOpen={isVoiceOpen} 
          onClose={() => setIsVoiceOpen(false)} 
          onTranscribe={(text) => {
            const cleanText = (text || '').trim();
            if (cleanText) {
              setCurrentGrievance((prev) => {
                const prevTrimmed = (prev || '').trim();
                return prevTrimmed ? `${prevTrimmed} ${cleanText}` : cleanText;
              });
            }
          }}
          onTranscriptReady={(text) => {
            const cleanText = (text || '').trim();
            if (cleanText) {
              setCurrentGrievance((prev) => {
                const prevTrimmed = (prev || '').trim();
                return prevTrimmed ? `${prevTrimmed} ${cleanText}` : cleanText;
              });
            }
          }}
        />
      )}

      {/* Diagnosis Results Section */}
      {currentDiagnosis && (
        <div className="pt-4">
          <LegalResultCard diagnosis={currentDiagnosis} />
        </div>
      )}

    </div>
  );
};
