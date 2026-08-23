import React, { useState, useEffect } from 'react';
import { Scale, CheckCircle2, Loader2 } from 'lucide-react';

export const LoadingGavel = ({ message = 'Analyzing legal statutes...' }) => {
  const steps = [
    'Parsing plain-language grievance & factual claims...',
    'Correlating statutory sections (CPA 2019, Model Tenancy Act, RTI 2005)...',
    'Evaluating District Commission (DCDRC) & DLSA jurisdiction...',
    'Synthesizing chronological action plan & formal notice parameters...'
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gov-card p-6 rounded-lg max-w-md mx-auto my-8 border-slate-300 shadow-md text-slate-800">
      
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded bg-[#0A2540] flex items-center justify-center text-amber-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0A2540]">
            {message}
          </h3>
          <span className="text-[11px] text-slate-500">Government of India Civic Intelligence Core</span>
        </div>
      </div>

      <div className="space-y-2 mt-4 text-xs">
        {steps.map((s, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 p-2 rounded transition-all ${
                isDone
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : isCurrent
                  ? 'bg-slate-100 text-[#0A2540] font-semibold border border-slate-300'
                  : 'text-slate-400'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isDone ? 'text-[#059669]' : 'text-slate-400'}`} />
              <span className="truncate">{s}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
