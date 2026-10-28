import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Cpu, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  Volume2,
  Key
} from 'lucide-react';
import { Language, SystemStatus } from '../types';
import { getT } from '../i18n';
import { api } from '../services/api';

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
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.navSettings}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store metadata, AI provider configuration, and demo sandbox controls
          </p>
        </div>
      </div>

      {/* Store Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-[#0F2D6B]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Merchant Store Profile
            </h2>
            <p className="text-xs text-slate-500">
              Registered Paytm Merchant Ecosystem details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Merchant Name</span>
            <div className="font-bold text-slate-900 text-sm mt-1">{systemStatus?.store_profile.name || "Sharma General Store"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Category & Trade</span>
            <div className="font-bold text-slate-900 text-sm mt-1">{systemStatus?.store_profile.category || "Kirana & Daily Needs"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Location</span>
            <div className="font-bold text-slate-900 text-sm mt-1">{systemStatus?.store_profile.city || "Sector 15, Noida, UP"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Linked Paytm UPI ID</span>
            <div className="font-bold text-[#0F2D6B] text-sm mt-1">{systemStatus?.store_profile.upi_id || "sharmastore@paytm"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Paytm Soundbox Serial</span>
            <div className="font-bold text-emerald-700 text-sm mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{systemStatus?.store_profile.soundbox_id || "PSB-99214-NOIDA"}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Environment Mode</span>
            <div className="font-bold text-sky-700 text-sm mt-1">Hackathon Prototype (Sandbox)</div>
          </div>
        </div>
      </div>

      {/* AI Engine & Provider Architecture */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              AI Provider Integration Layer
            </h2>
            <p className="text-xs text-slate-500">
              Provider-agnostic service layer with zero-key fallback guarantee
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Active Provider: {systemStatus?.ai_engine.label || "Deterministic Business Analytics Engine (Local)"}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Model: {systemStatus?.ai_engine.model || "Local Analytics Engine v1.0"}
              </div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl bg-white border border-sky-300 text-xs font-bold text-[#0F2D6B]">
            Status: Fully Operational
          </span>
        </div>

        {/* Optional Live Key Input */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-slate-400" />
            <span>Optional Live Gemini / OpenAI Key (For live cloud LLM testing)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter GEMINI_API_KEY or OPENAI_API_KEY (Optional)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-400"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2.5 rounded-xl bg-[#0F2D6B] text-white text-xs font-bold hover:bg-slate-900 transition-colors shadow-xs"
            >
              {savedKeyToast ? "Saved!" : "Save Key"}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            ℹ️ No API key is required. Without a key, Dukaan Saathi AI runs the full deterministic analytics suite locally with 100% precision.
          </p>
        </div>
      </div>

      {/* Demo Sandbox Reset */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Regenerate Demo Data Sandbox
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Re-seeds 90 days of transactions, inventory levels, and the declining sales demo scenario.
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Regenerate 90-Day Ledger</span>
        </button>
      </div>

    </div>
  );
};
