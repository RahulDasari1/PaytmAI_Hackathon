import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Language } from '../types';

interface JudgeDemoBannerProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
  onClose: () => void;
  language: Language;
}

export const JudgeDemoBanner: React.FC<JudgeDemoBannerProps> = ({
  currentStep,
  onSelectStep,
  onClose,
  language
}) => {
  const steps = [
    {
      num: 1,
      title: "1. Observe Dip",
      desc: "7-day sales dropped -12.8% to ₹71,840",
      tab: "overview"
    },
    {
      num: 2,
      title: "2. Ask Copilot",
      desc: "Ask: 'Why did my sales decrease this week?'",
      tab: "copilot"
    },
    {
      num: 3,
      title: "3. Root Cause",
      desc: "Evening Snacks/Dairy drop & 35 inactive regulars",
      tab: "sales"
    },
    {
      num: 4,
      title: "4. Take Action",
      desc: "Draft Evening Combo Campaign in Hindi/Telugu/English",
      tab: "campaigns"
    },
    {
      num: 5,
      title: "5. Reorder Stock",
      desc: "Restock critical Fortune Oil (only 1.6 days left)",
      tab: "inventory"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-amber-50 border-b border-amber-200/80 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Header & Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
                  Judge Demo Mode
                </span>
                <span className="text-xs font-bold text-slate-800">
                  3-Minute Interactive Growth Walkthrough
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Click any step below to experience the complete problem-diagnosis-action flow.
              </p>
            </div>
          </div>

          {/* Interactive Steps */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {steps.map((s, idx) => {
              const isSelected = currentStep === s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => onSelectStep(s.num)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#0F2D6B] text-white shadow-md ring-2 ring-sky-300'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-[#00BAF2] text-white font-bold' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {s.num}
                  </span>
                  <span>{s.title}</span>
                  {idx < steps.length - 1 && (
                    <ChevronRight className={`w-3 h-3 ${isSelected ? 'text-sky-300' : 'text-slate-300'}`} />
                  )}
                </button>
              );
            })}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg ml-1"
              title="Close Judge Demo Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
