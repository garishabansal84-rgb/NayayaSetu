import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, X, Check, Volume2, VolumeX, Sparkles, AlertCircle, 
  RefreshCw, Globe, Wand2, Loader2, Play, Square, HelpCircle, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { 
  startSpeechRecognition, 
  isSpeechRecognitionSupported, 
  SUPPORTED_VOICE_LANGUAGES, 
  normalizeVernacularTranscript,
  getLocalizedVoiceErrorMessage,
  speakLegalAdvice,
  stopSpeech
} from '../../services/voiceService';
import { apiCleanVoiceTranscript } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceInputModal = ({ isOpen, onClose, onTranscribe, onTranscriptReady }) => {
  const { language, t } = useLanguage();
  const [selectedVoiceLang, setSelectedVoiceLang] = useState('en-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioVolume, setAudioVolume] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const textareaRef = useRef(null);

  const supported = isSpeechRecognitionSupported();

  // Sync initial voice language based on app language when modal opens
  useEffect(() => {
    if (language === 'hi' || language === 'hinglish') setSelectedVoiceLang('hi-IN');
    else if (language === 'bn') setSelectedVoiceLang('bn-IN');
    else if (language === 'ta') setSelectedVoiceLang('ta-IN');
    else if (language === 'te') setSelectedVoiceLang('te-IN');
    else if (language === 'mr') setSelectedVoiceLang('mr-IN');
    else if (language === 'gu') setSelectedVoiceLang('gu-IN');
    else if (language === 'kn') setSelectedVoiceLang('kn-IN');
    else if (language === 'ml') setSelectedVoiceLang('ml-IN');
    else if (language === 'pa') setSelectedVoiceLang('pa-IN');
    else if (language === 'or' || language === 'od') setSelectedVoiceLang('or-IN');
    else if (language === 'ur') setSelectedVoiceLang('ur-IN');
    else if (language === 'as') setSelectedVoiceLang('as-IN');
    else if (language === 'sa') setSelectedVoiceLang('sa-IN');
    else setSelectedVoiceLang('en-IN');
  }, [language, isOpen]);

  const samplePresets = [
    {
      label: language === 'hi' ? 'ई-कॉमर्स खराब फोन' : 'E-Commerce Damaged Phone',
      text: language === 'hi' 
        ? 'फ्लिपकार्ट से ₹19,999 का फोन मंगाया था जो टूटा हुआ निकला। उन्होंने रिटर्न और रिफंड देने से मना कर दिया।'
        : 'I purchased a smartphone for ₹19,999 on Flipkart. The screen was delivered broken and customer support refused my return and refund.'
    },
    {
      label: language === 'hi' ? 'मकान मालिक डिपॉजिट' : 'Landlord Security Deposit',
      text: language === 'hi'
        ? 'मकान खाली करने के 30 दिन बाद भी मकान मालिक ने मेरा ₹50,000 का सिक्योरिटी डिपॉजिट वापस नहीं किया है।'
        : 'My landlord has unlawfully withheld my ₹50,000 security deposit even after 30 days of vacating with zero unpaid bills.'
    },
    {
      label: language === 'hi' ? 'आयुष्मान अस्पताल' : 'Hospital Ayushman Refusal',
      text: language === 'hi'
        ? 'निजी अस्पताल ने आयुष्मान भारत योजना के तहत कैशलेस इलाज देने से मना किया और ₹50,000 नकद मांगे।'
        : 'A private empanelled hospital refused emergency cashless admission under Ayushman Bharat and demanded ₹50,000 cash advance.'
    },
    {
      label: language === 'hi' ? 'सड़क टेंडर RTI' : 'PWD Road Tender RTI',
      text: language === 'hi'
        ? '3 महीने पहले बनी सड़क टूट गई है। मुझे ठेकेदार का नाम, टेंडर और स्वीकृत बजट की प्रमाणित कॉपी चाहिए।'
        : 'The newly constructed PWD road developed deep potholes within 3 months. I want certified copies of contractor tender, sanctioned budget, and quality test reports under RTI Act.'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setErrorMsg('');
      setIsRecording(false);
      setIsTranscribing(false);
      setIsPlayingBack(false);
      setAudioVolume(0);
    } else {
      handleStopListening();
      stopSpeech();
    }
  }, [isOpen]);

  const handleStartListening = (langOverride) => {
    setErrorMsg('');
    setIsRecording(true);
    setIsTranscribing(false);
    stopSpeech();
    setIsPlayingBack(false);

    const voiceLang = langOverride || selectedVoiceLang;

    const session = startSpeechRecognition({
      language: voiceLang,
      onResult: (text) => {
        setTranscript(text);
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      },
      onVolumeChange: (vol) => {
        setAudioVolume(vol);
      },
      onStatusChange: (status) => {
        setIsTranscribing(status === 'transcribing');
      },
      onError: (errCode) => {
        setIsRecording(false);
        setIsTranscribing(false);
        setAudioVolume(0);
        const userMsg = getLocalizedVoiceErrorMessage(errCode, language);
        setErrorMsg(userMsg);
      },
      onEnd: () => {
        setIsRecording(false);
        setIsTranscribing(false);
        setAudioVolume(0);
      }
    });

    if (session) {
      setRecognitionInstance(session);
    }
  };

  const handleStopListening = async () => {
    if (recognitionInstance) {
      try {
        await recognitionInstance.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    setAudioVolume(0);
  };

  const handleLanguageChange = (newLang) => {
    setSelectedVoiceLang(newLang);
    if (recognitionInstance) {
      recognitionInstance.setLanguage(newLang);
    }
    if (isRecording) {
      handleStopListening().then(() => {
        setTimeout(() => handleStartListening(newLang), 150);
      });
    }
  };

  const handleAIClean = async () => {
    if (!transcript.trim()) return;
    setIsCleaning(true);
    setErrorMsg('');
    try {
      const polished = await apiCleanVoiceTranscript(transcript, selectedVoiceLang);
      if (polished) {
        setTranscript(polished);
      }
    } catch (e) {
      console.warn('AI clean error:', e);
      const localCleaned = normalizeVernacularTranscript(transcript, selectedVoiceLang);
      setTranscript(localCleaned);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleTogglePlayback = () => {
    if (!transcript.trim()) return;
    if (isPlayingBack) {
      stopSpeech();
      setIsPlayingBack(false);
    } else {
      setIsPlayingBack(true);
      speakLegalAdvice(
        transcript,
        selectedVoiceLang,
        () => setIsPlayingBack(false),
        () => setIsPlayingBack(false)
      );
    }
  };

  const handleDone = () => {
    handleStopListening();
    stopSpeech();
    const finalTranscript = transcript.trim();
    if (finalTranscript) {
      // Prop resilience: Call onTranscriptReady if supplied, otherwise fallback to onTranscribe (prevents double insertion)
      if (typeof onTranscriptReady === 'function') {
        onTranscriptReady(finalTranscript);
      } else if (typeof onTranscribe === 'function') {
        onTranscribe(finalTranscript);
      }
    }
    onClose();
  };

  const handleLoadPreset = (presetText) => {
    setTranscript(presetText);
    setErrorMsg('');
  };

  if (!isOpen) return null;

  const currentLangObj = SUPPORTED_VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang) || SUPPORTED_VOICE_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-xl max-w-xl w-full p-6 shadow-2xl relative text-center text-slate-800 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#D97706]" />
            <span>{language === 'hi' ? 'बोलकर अपनी शिकायत दर्ज करें' : 'Record Your Dispute by Voice'}</span>
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-4 max-w-md mx-auto leading-relaxed">
          {language === 'hi'
            ? 'अपनी भाषा चुनें, माइक दबाकर लगातार बोलें। AI स्वचालित रूप से रुपये (₹) और कानूनी तथ्यों को सही करेगा।'
            : 'Select your spoken language, tap the microphone to speak freely with continuous speech recognition and auto ₹ currency formatting.'}
        </p>

        {/* 1. In-Modal Spoken Language Switcher Bar */}
        <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-left">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#0A2540]" />
              <span>{language === 'hi' ? 'बोली जाने वाली भाषा:' : 'Spoken Voice Language:'}</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              Model: {currentLangObj.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {SUPPORTED_VOICE_LANGUAGES.map((lang) => {
              const isSelected = selectedVoiceLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A2540] text-white shadow-xs ring-1 ring-[#0A2540]'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                >
                  <span>{lang.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Microphone Button & Real-time Sound Wave Visualizer */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="relative">
            {isRecording && (
              <span className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping" />
            )}
            <button
              type="button"
              onClick={isRecording ? handleStopListening : () => handleStartListening()}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer relative z-10 ${
                isRecording
                  ? 'bg-red-600 text-white shadow-xl shadow-red-500/40 scale-105 ring-4 ring-red-300'
                  : 'bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-[#0A2540] border-2 border-slate-300 shadow-md'
              }`}
              title={isRecording ? 'Click to stop recording' : 'Click to start recording'}
            >
              {isRecording ? (
                <Mic className="w-9 h-9 text-white animate-pulse" />
              ) : (
                <Mic className="w-9 h-9 text-[#0A2540]" />
              )}
            </button>
          </div>

          {/* Live Sound Wave / VU Level Indicator */}
          {isRecording && (
            <div className="flex items-center justify-center gap-1 mt-3.5 h-6">
              {[0.4, 0.7, 1.0, 0.6, 0.9, 1.2, 0.8, 0.5, 1.1, 0.7, 0.3].map((factor, i) => {
                const heightPct = Math.max(15, Math.min(100, (audioVolume * factor * 1.5) + 15));
                return (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-emerald-500 transition-all duration-75"
                    style={{ height: `${heightPct}%` }}
                  />
                );
              })}
            </div>
          )}

          <div className="mt-2.5">
            {isRecording ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block animate-ping" />
                  <span>{language === 'hi' ? `माइक चालू है (${currentLangObj.short})... बोलते रहें` : `Listening in ${currentLangObj.short}... Speak naturally`}</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === 'hi' ? '(बोलना पूरा होने पर फिर से माइक दबाएं)' : '(Continuous recording active • Tap mic to finish)'}
                </span>
              </div>
            ) : isTranscribing ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>{language === 'hi' ? '✨ AI बहुभाषी रूपांतरण जारी...' : '✨ Multimodal AI audio transcribing...'}</span>
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-700">
                {language === 'hi' ? 'माइक शुरू करने के लिए क्लिक करें' : 'Click microphone to start speaking'}
              </span>
            )}
          </div>
        </div>

        {/* 3. Editable Transcript Area with AI Polish & Listen Back Preview */}
        <div className="space-y-1.5 text-left mb-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="font-bold text-slate-800">
              {language === 'hi' ? 'शिकायत विवरण (संपादनीय):' : 'Dispute Description (Editable):'}
            </span>

            <div className="flex items-center gap-2">
              {transcript && (
                <button
                  type="button"
                  onClick={handleTogglePlayback}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  title="Listen back to preview speech"
                >
                  {isPlayingBack ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-blue-700" />
                      <span>{language === 'hi' ? 'रोकें' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                      <span>{language === 'hi' ? 'सुनें' : 'Listen Back'}</span>
                    </>
                  )}
                </button>
              )}

              {transcript && (
                <button
                  type="button"
                  onClick={handleAIClean}
                  disabled={isCleaning}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  title="Auto-correct spelling, format amounts as ₹, and fix punctuation using AI"
                >
                  {isCleaning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 text-amber-700" />
                  )}
                  <span>{isCleaning ? 'Cleaning...' : (language === 'hi' ? '✨ AI सुधार' : '✨ AI Fix & Format')}</span>
                </button>
              )}

              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-slate-400 hover:text-slate-700 underline text-xs cursor-pointer"
                >
                  {language === 'hi' ? 'साफ़ करें' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={language === 'hi'
                ? 'यहाँ बोलें या लिखें... (उदा. "फ्लिपकार्ट से ₹19,999 का फोन मंगाया था जो टूटा हुआ निकला...")'
                : 'Speak or type your dispute here... (e.g. "My landlord has withheld my ₹50,000 security deposit without any bills...")'}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-blue-100 resize-none font-normal"
            />
          </div>
          
          {transcript && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>{transcript.split(/\s+/).filter(Boolean).length} {language === 'hi' ? 'शब्द रिकॉर्ड किए गए' : 'words spoken'}</span>
              <span className="text-[10px] text-slate-400">{language === 'hi' ? 'आप ऊपर दिए गए टेक्स्ट को कभी भी संपादित कर सकते हैं।' : 'You can edit the text directly above at any time.'}</span>
            </div>
          )}
        </div>

        {/* Error Notification with Permission Recovery Guide */}
        {errorMsg ? (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 mb-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">{errorMsg}</span>
              <span className="text-[11px] text-slate-600 block">
                {language === 'hi' 
                  ? 'टिप: ब्राउज़र एड्रेस बार में लॉक/माइक आइकन पर क्लिक करके अनुमति "Allow" करें।' 
                  : 'Tip: Click the lock or microphone icon in your browser URL bar to allow microphone access.'}
              </span>
            </div>
          </div>
        ) : null}

        {/* 4. Quick Dispute Presets */}
        <div className="text-left space-y-1.5 mb-5 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
          <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wide">
            {language === 'hi' ? 'या त्वरित कानूनी उदाहरण लोड करें:' : 'Or Load Quick Verified Dispute Template:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadPreset(preset.text)}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-md border border-slate-300 bg-white cursor-pointer"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleDone}
            disabled={!transcript.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'शिकायत में जोड़ें' : 'Use This Description'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
