import React from 'react';
import { 
  Store, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  Globe2, 
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { Language, SystemStatus } from '../types';
import { getT } from '../i18n';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  systemStatus: SystemStatus | null;
  onResetDemo: () => void;
  onOpenSoundboxModal: () => void;
  onToggleJudgeDemo: () => void;
  isJudgeDemoActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  systemStatus,
  onResetDemo,
  onOpenSoundboxModal,
  onToggleJudgeDemo,
  isJudgeDemoActive
}) => {
  const t = getT(language);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E4EAF1] shadow-fintech-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Store Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Logo Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002970] to-[#00BAF2] flex items-center justify-center text-white shadow-sm shrink-0">
                <Store className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#10243A] text-base sm:text-lg tracking-tight">
                    {t.appTitle}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF7FF] text-[#002970] border border-[#B9E6FE]">
                    <ShieldCheck className="w-3 h-3 text-[#00BAF2]" />
                    <span>Paytm Fintech Context</span>
                  </span>
                </div>

                <div className="text-[11px] text-[#667085] font-medium flex items-center gap-1.5 truncate">
                  <span className="font-semibold text-[#344054]">{t.storeName}</span>
                  <span className="text-[#D0D5DD]">•</span>
                  <span>{systemStatus?.store_profile.city || "Sector 15, Noida"}</span>
                </div>
              </div>
            </div>

            {/* Soundbox device status */}
            <button 
              onClick={onOpenSoundboxModal}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] text-xs font-semibold hover:bg-[#D1FADF] transition-all cursor-pointer"
              title="Test Paytm Soundbox Voice Announcement"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B76A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12B76A]"></span>
              </span>
              <Volume2 className="w-3.5 h-3.5 text-[#12B76A]" />
              <span className="tabular-nums">Soundbox PSB-99214 (Active)</span>
            </button>

          </div>

          {/* Right Controls: Judge Walkthrough, Language Segment, AI Engine, Reset */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Judge 3-Min Demo Button */}
            <button
              onClick={onToggleJudgeDemo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-fintech-xs ${
                isJudgeDemoActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-200 ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />
              <span>{t.judgeDemo}</span>
            </button>

            {/* Language Segmented Toggle */}
            <div className="flex items-center bg-[#F2F4F7] p-0.5 rounded-xl border border-[#E4EAF1]">
              <Globe2 className="w-3.5 h-3.5 text-[#667085] ml-2 mr-1 shrink-0" />
              {(['en', 'hi', 'te'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === lang
                      ? 'bg-white text-[#002970] shadow-fintech-xs'
                      : 'text-[#667085] hover:text-[#10243A]'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'తెలుగు'}
                </button>
              ))}
            </div>

            {/* AI Engine Status Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1] text-xs font-medium text-[#344054]">
              <span className="w-2 h-2 rounded-full bg-[#00BAF2]"></span>
              <span>{systemStatus?.ai_engine.label || "AI Analytics Engine"}</span>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetDemo}
              className="p-2 text-[#667085] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-xl transition-colors border border-transparent hover:border-[#FECDCA]"
              title="Reset Demo Data (Regenerate 90-day transactions)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
