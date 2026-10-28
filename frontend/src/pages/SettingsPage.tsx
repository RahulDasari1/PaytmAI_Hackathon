import React, { useState } from 'react';
import { 
  Store, 
  Cpu, 
  RotateCcw, 
  Key,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Language, SystemStatus } from '../types';
import { getT } from '../i18n';

interface SettingsPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  systemStatus: SystemStatus | null;
  onResetDemo: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  language,
  onLanguageChange,
  systemStatus,
  onResetDemo
}) => {
  const t = getT(language);
  const [geminiKey, setGeminiKey] = useState<string>(
    localStorage.getItem('DEMO_GEMINI_API_KEY') || ''
  );
  const [savedKeyToast, setSavedKeyToast] = useState<boolean>(false);

  const handleSaveKey = () => {
    localStorage.setItem('DEMO_GEMINI_API_KEY', geminiKey);
    setSavedKeyToast(true);
    setTimeout(() => setSavedKeyToast(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4EAF1] shadow-fintech-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#10243A] tracking-tight">
            {t.navSettings}
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Store metadata, AI provider configuration, and demo sandbox controls
          </p>
        </div>
      </div>

      {/* Store Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E4EAF1] shadow-fintech-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#EBF7FF] flex items-center justify-center text-[#002970] border border-[#B9E6FE]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#10243A]">
              Merchant Store Profile
            </h2>
            <p className="text-xs text-[#667085]">
              Registered Paytm Merchant Ecosystem details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1]">
            <span className="text-[#667085] font-bold uppercase tracking-wider text-[10px]">Merchant Name</span>
            <div className="font-extrabold text-[#10243A] text-sm mt-1">{systemStatus?.store_profile.name || "Sharma General Store"}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1]">
            <span className="text-[#667085] font-bold uppercase tracking-wider text-[10px]">Category & Trade</span>
            <div className="font-extrabold text-[#10243A] text-sm mt-1">{systemStatus?.store_profile.category || "Kirana & Daily Needs"}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1]">
            <span className="text-[#667085] font-bold uppercase tracking-wider text-[10px]">Location</span>
            <div className="font-extrabold text-[#10243A] text-sm mt-1">{systemStatus?.store_profile.city || "Sector 15, Noida, UP"}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1]">
            <span className="text-[#667085] font-bold uppercase tracking-wider text-[10px]">Linked Paytm UPI ID</span>
            <div className="font-bold text-[#002970] text-sm mt-1">{systemStatus?.store_profile.upi_id || "sharmastore@paytm"}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1]">
            <span className="text-[#667085] font-bold uppercase tracking-wider text-[10px]">Paytm Soundbox Serial</span>
            <div className="font-bold text-[#027A48] text-sm mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#12B76A]"></span>
              <span>{systemStatus?.store_profile.soundbox_id || "PSB-99214-NOIDA"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1]">
            <span className="text-[#667085] font-bold uppercase tracking-wider text-[10px]">Environment Mode</span>
            <div className="font-bold text-[#002970] text-sm mt-1">Hackathon Prototype (Sandbox)</div>
          </div>
        </div>
      </div>

      {/* AI Engine & Provider Architecture */}
      <div className="bg-white rounded-2xl p-6 border border-[#E4EAF1] shadow-fintech-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] flex items-center justify-center text-[#12B76A] border border-[#A6F4C5]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#10243A]">
              AI Provider Integration Layer
            </h2>
            <p className="text-xs text-[#667085]">
              Provider-agnostic service layer with zero-key fallback guarantee
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F0F9FF] border border-[#B9E6FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#12B76A] animate-pulse"></span>
            <div>
              <div className="text-xs font-bold text-[#10243A]">
                Active Engine: {systemStatus?.ai_engine.label || "Deterministic Business Analytics Engine (Local)"}
              </div>
              <div className="text-[11px] text-[#475467] mt-0.5">
                Model: {systemStatus?.ai_engine.model || "Local Analytics Engine v1.0"}
              </div>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-white border border-[#B9E6FE] text-xs font-bold text-[#002970]">
            Fully Operational
          </span>
        </div>

        {/* Optional Live Key Input */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#98A2B3]" />
            <span>Optional Live Gemini / OpenAI Key (For live cloud LLM testing)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter GEMINI_API_KEY or OPENAI_API_KEY (Optional)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E4EAF1] text-xs font-mono text-[#10243A] focus:outline-none focus:border-[#00BAF2] bg-[#F8FAFC]"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2.5 rounded-xl bg-[#002970] text-white text-xs font-bold hover:bg-[#081728] transition-colors shadow-xs"
            >
              {savedKeyToast ? "Saved!" : "Save Key"}
            </button>
          </div>
          <p className="text-[11px] text-[#667085]">
            ℹ️ No API key is required. Without a key, Dukaan Saathi AI runs the full deterministic analytics suite locally with 100% precision.
          </p>
        </div>
      </div>

      {/* Demo Sandbox Reset */}
      <div className="bg-white rounded-2xl p-6 border border-[#E4EAF1] shadow-fintech-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-[#10243A]">
            Regenerate Demo Data Sandbox
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Re-seeds 90 days of transactions, inventory levels, and the declining sales demo scenario.
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#B42318] font-bold text-xs border border-[#FECDCA] transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Regenerate 90-Day Ledger</span>
        </button>
      </div>

    </div>
  );
};
