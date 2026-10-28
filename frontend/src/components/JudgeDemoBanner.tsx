import React from 'react';
import { Sparkles, ChevronRight, X } from 'lucide-react';
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
      desc: "Weekly sales dropped to ₹71,840 (-12.8%)",
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
      desc: "Restock Fortune Sunflower Oil (1.6 days left)",
      tab: "inventory"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-[#FFF9EB] via-[#F0F9FF] to-[#FFF9EB] border-b border-[#FEE4E2] px-4 py-2.5 shadow-fintech-xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Header & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-1.5 py-0.5 rounded">
                  Judge Demo Mode
                </span>
                <span className="text-xs font-bold text-[#10243A]">
                  3-Minute Interactive Growth Walkthrough
                </span>
              </div>
              <p className="text-[11px] text-[#475467]">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#002970] text-white shadow-xs ring-2 ring-[#00BAF2]'
                      : 'bg-white text-[#344054] border border-[#E4EAF1] hover:border-slate-300 hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold tabular-nums ${
                    isSelected ? 'bg-[#00BAF2] text-[#002970]' : 'bg-[#F2F4F7] text-[#475467]'
                  }`}>
                    {s.num}
                  </span>
                  <span>{s.title}</span>
                  {idx < steps.length - 1 && (
                    <ChevronRight className={`w-3 h-3 ${isSelected ? 'text-[#00BAF2]' : 'text-[#D0D5DD]'}`} />
                  )}
                </button>
              );
            })}

            <button
              onClick={onClose}
              className="p-1.5 text-[#98A2B3] hover:text-[#475467] hover:bg-black/5 rounded-lg ml-1"
              title="Close Judge Demo Banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
