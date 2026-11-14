import React, { useState } from 'react';
import { 
  Store, 
  Cpu, 
  RotateCcw
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4EAF1] shadow-fintech-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#10243A] tracking-tight">
            {t.navSettings}
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Shop details and demo controls
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
              Sample shop details for this demo
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
            <span className="text-[#667085] font-bold uppercase tracking-wider text-[10px]">Sample UPI ID</span>
            <div className="font-bold text-[#002970] text-sm mt-1">{systemStatus?.store_profile.upi_id || "sharmastore@paytm"}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1]">
            <span className="text-[#667085] font-bold uppercase tracking-wider text-[10px]">Sample Soundbox number</span>
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

      {/* Demo service and privacy note */}
      <div className="bg-white rounded-2xl p-6 border border-[#E4EAF1] shadow-fintech-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] flex items-center justify-center text-[#12B76A] border border-[#A6F4C5]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#10243A]">
              About Saathi
            </h2>
            <p className="text-xs text-[#667085]">
              This demo uses sample shop information to answer questions.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F0F9FF] border border-[#B9E6FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#12B76A] animate-pulse"></span>
            <div>
              <div className="text-xs font-bold text-[#10243A]">
                Help service: {systemStatus?.ai_engine.label || "Demo shop helper"}
              </div>
              <div className="text-[11px] text-[#475467] mt-0.5">
                It does not access a live Paytm merchant account.
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[#FEF0C7] bg-[#FFFCF5] p-4 text-sm leading-relaxed text-[#7A2E0E]">
          Do not enter passwords, UPI PINs, or API keys in this demo.
        </div>
      </div>

      {/* Demo Sandbox Reset */}
      <div className="bg-white rounded-2xl p-6 border border-[#E4EAF1] shadow-fintech-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-[#10243A]">
            Start the demo again
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Reset the sample sales and stock information to its starting point.
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#B42318] font-bold text-xs border border-[#FECDCA] transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset demo data</span>
        </button>
      </div>

    </div>
  );
};
