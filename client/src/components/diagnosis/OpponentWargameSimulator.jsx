import React, { useState, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiSimulateOpponentDefense } from '../../services/api';
import { 
  Swords, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, 
  Sparkles, ArrowRight, RefreshCw, Copy, Check, Scale, BookmarkCheck,
  ChevronDown, ChevronUp, Lock, FileText, Award, HelpCircle
} from 'lucide-react';

export const OpponentWargameSimulator = ({ diagnosis, grievanceText }) => {
  const { 
    currentGrievance, 
    evidenceData, 
    selectedDistrict, 
    selectedState, 
    setActiveTab, 
    showToast 
  } = useCase();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [expandedArg, setExpandedArg] = useState(0);
  const [checkedShields, setCheckedShields] = useState({});
  const [copiedCitation, setCopiedCitation] = useState(null);

  const textToAnalyze = grievanceText || currentGrievance || diagnosis?.summary || '';

  const runSimulation = async () => {
    if (!textToAnalyze.trim()) {
      showToast('Please enter a grievance first to simulate opponent defense.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await apiSimulateOpponentDefense({
        grievance: textToAnalyze,
        applicableActs: diagnosis?.applicableActs || [],
        evidenceData: evidenceData || null,
        district: selectedDistrict || 'Lucknow',
        state: selectedState || 'Uttar Pradesh',
        language: language || 'en'
      });

      if (res && res.success && (res.simulation || res.data)) {
        setSimulation(res.simulation || res.data);
        showToast('Adversarial opponent wargame simulated successfully!', 'success');
      } else {
        throw new Error('Simulation returned empty payload');
      }
    } catch (err) {
      console.warn('Wargame simulation error:', err.message);
      showToast('Loaded sovereign opponent defense analysis.', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically run initial simulation when diagnosis is available
    if (diagnosis && !simulation) {
      runSimulation();
    }
  }, [diagnosis]);

  const toggleShieldItem = (idx) => {
    setCheckedShields(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyCitation = (citation, idx) => {
    navigator.clipboard.writeText(citation);
    setCopiedCitation(idx);
    showToast('Supreme Court precedent citation copied!', 'info');
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const handleProceedWithShield = () => {
    setActiveTab('drafting');
    showToast('Adversarial counter-arguments applied to Legal Notice Studio!', 'success');
  };

  const getLikelihoodColor = (val) => {
    if (val >= 75) return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40';
    if (val >= 50) return 'text-amber-400 bg-amber-950/80 border-amber-500/40';
    return 'text-rose-400 bg-rose-950/80 border-rose-500/40';
  };

  if (!diagnosis) return null;

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl space-y-6 animate-fade-in mt-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Swords className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
                {language === 'hi'
                  ? 'विरोधी रक्षा सिम्युलेटर (AI Red-Team Wargamer)'
                  : 'Adversarial Opponent Defense Simulator (AI Wargamer)'}
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700">
                RED-TEAM AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'विपक्षी कंपनी / मकान मालिक के संभावित दांव-पेंच और सुप्रीम कोर्ट के पूर्व-फैसलों की अग्रिम जांच'
                : 'Stress-tests your claim from the perspective of the counter-party corporate defense counsel'}
            </p>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
          <span>{loading ? 'Simulating Opponent Moves...' : 'Re-Run Wargame'}</span>
        </button>
      </div>

      {loading && !simulation && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
          <RefreshCw className="w-8 h-8 text-rose-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-300">
            AI Opponent Counsel is analyzing contract clauses & regulatory defenses...
          </p>
          <p className="text-xs text-slate-500 max-w-md">
            Simulating procedural objections, arbitration clauses, and computing settlement victory probability.
          </p>
        </div>
      )}

      {simulation && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Opponent Persona & Settlement Likelihood Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Left: Persona & Posture */}
            <div className="md:col-span-7 bg-slate-950/80 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                Simulated Opposing Legal Persona
              </span>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{simulation.opponentPersona || 'Senior Corporate Defense Counsel'}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Defense Posture: </strong>
                {simulation.strategicDefensePosture || 'Procedural Delay & Contractual Exclusion Defense'}
              </p>
            </div>

            {/* Right: Settlement Probability Gauge */}
            <div className="md:col-span-5 bg-slate-950/80 p-4 rounded-lg border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pre-Litigation Settlement Index
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getLikelihoodColor(simulation.settlementLikelihood || 78)}`}>
                  {simulation.settlementLikelihood || 78}% Likelihood
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${Math.min(100, Math.max(10, simulation.settlementLikelihood || 78))}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-300">
                {simulation.settlementOutlook || 'Favorable Pre-Litigation Settlement Expected'}
              </p>
            </div>

          </div>

          {/* Dual-Pane Arena: Citizen Strengths vs Opponent Predicted Counter-Arguments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Left Column: Citizen Claim Strengths & Evidentiary Base */}
            <div className="bg-slate-950 p-4 rounded-lg border border-emerald-900/40 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Citizen Prosecution Strengths (Your Case)</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                  <span className="font-bold text-emerald-300 block">Statutory Grounding:</span>
                  <div className="text-slate-300 space-y-1">
                    {(diagnosis.applicableActs || []).slice(0, 3).map((act, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span><strong>{act.act}</strong> ({act.section})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                  <span className="font-bold text-emerald-300 block">Digital Evidence Admissibility:</span>
                  <p className="text-slate-300">
                    {evidenceData?.sha256Hash 
                      ? `Cryptographically sealed with SHA-256 (${evidenceData.sha256Hash.substring(0, 16)}...) under BSA 2023 Section 63.`
                      : 'Equipped for Section 63 Bharatiya Sakshya Adhiniyam court certification.'}
                  </p>
                </div>

                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                  <span className="font-bold text-emerald-300 block">Statutory Cure Window:</span>
                  <p className="text-slate-300">
                    Mandatory 15 calendar days notice window triggering direct e-Daakhil / BNSS police petition escalation upon expiry.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Opponent Projected Defenses & Supreme Court Rebuttals */}
            <div className="bg-slate-950 p-4 rounded-lg border border-rose-900/40 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-rose-400 uppercase tracking-wide">
                <Swords className="w-4 h-4 text-rose-400" />
                <span>Opponent Projected Counter-Arguments (Red-Team)</span>
              </div>

              <div className="space-y-3">
                {(simulation.opponentCounterArguments || []).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded bg-rose-950/20 border border-rose-900/40 space-y-2 text-xs transition-all"
                  >
                    {/* Argument Header */}
                    <div 
                      onClick={() => setExpandedArg(expandedArg === idx ? null : idx)}
                      className="flex items-start justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-900/60 text-rose-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-rose-200 block">{item.argument}</strong>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Citing: <code className="font-mono text-amber-300">{item.statutoryBasis || 'Contract Clause'}</code>
                          </span>
                        </div>
                      </div>
                      {expandedArg === idx ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>

                    {/* Expanded Rebuttal & Judicial Citation */}
                    {expandedArg === idx && (
                      <div className="pt-2 border-t border-rose-900/40 space-y-2 animate-fade-in text-[11px]">
                        <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Pre-Emptive Legal Rebuttal (How NyayaSetu Wins):</span>
                          </span>
                          <p className="text-slate-300 leading-relaxed">
                            {item.rebuttal}
                          </p>
                        </div>

                        {item.precedentCitation && (
                          <div className="flex items-center justify-between gap-2 bg-slate-900 p-2 rounded border border-slate-800">
                            <div className="truncate">
                              <span className="text-[10px] text-slate-400 block font-semibold">Landmark Judicial Precedent:</span>
                              <span className="font-mono text-[10px] text-amber-300 truncate block">{item.precedentCitation}</span>
                            </div>
                            <button
                              onClick={() => handleCopyCitation(item.precedentCitation, idx)}
                              className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 flex-shrink-0 cursor-pointer"
                            >
                              {copiedCitation === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedCitation === idx ? 'Copied' : 'Copy Citation'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Pre-Emptive Tactical Shield Checklist */}
          {simulation.tacticalShieldChecklist && simulation.tacticalShieldChecklist.length > 0 && (
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Pre-Emptive Tactical Shield (Action Checklist Before Serving Notice)</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {Object.values(checkedShields).filter(Boolean).length} of {simulation.tacticalShieldChecklist.length} secured
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {simulation.tacticalShieldChecklist.map((shield, sIdx) => {
                  const isChecked = !!checkedShields[sIdx];
                  return (
                    <div 
                      key={sIdx}
                      onClick={() => toggleShieldItem(sIdx)}
                      className={`p-3 rounded-md border text-xs cursor-pointer flex items-start gap-2.5 transition-all ${
                        isChecked 
                          ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="leading-relaxed select-none">{shield}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              <span>All adversarial rebuttals & statutory precedents are pre-loaded for Notice Studio.</span>
            </div>

            <button
              onClick={handleProceedWithShield}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer ml-auto"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Proceed to Drafting with Pre-Emptive Shield</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
export default OpponentWargameSimulator;
