import React from 'react';
import { 
  Store, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Globe2, 
  HelpCircle,
  ExternalLink
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Store Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F2D6B] to-[#00BAF2] flex items-center justify-center text-white shadow-md">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-lg tracking-tight">
                    {t.appTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0F2D6B] border border-sky-200">
                    Paytm Ecosystem
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <span>{t.storeName}</span>
                  <span className="text-slate-300">•</span>
                  <span>{systemStatus?.store_profile.city || "Noida, UP"}</span>
                </div>
              </div>
            </div>

            {/* Soundbox device status */}
            <div 
              onClick={onOpenSoundboxModal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium cursor-pointer hover:bg-emerald-100 transition-colors"
              title="Click to test Paytm Soundbox Voice Announcement"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>PSB-99214-NOIDA (Active)</span>
            </div>
          </div>

          {/* Right Controls: Judge Demo, Language Switcher, AI Status, Reset */}
          <div className="flex items-center gap-3">
            
            {/* Judge 3-Min Demo Button */}
            <button
              onClick={onToggleJudgeDemo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                isJudgeDemoActive
                  ? 'bg-amber-500 text-white shadow-amber-200 ring-2 ring-amber-300 animate-pulse-subtle'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.judgeDemo}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <Globe2 className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
              {(['en', 'hi', 'te'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    language === lang
                      ? 'bg-white text-[#0F2D6B] shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'తెలుగు'}
                </button>
              ))}
            </div>

            {/* AI Status Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>{systemStatus?.ai_engine.label || "AI Copilot Ready"}</span>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetDemo}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
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
