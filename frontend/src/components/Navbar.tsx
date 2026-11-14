import React from 'react';
import { Info, Volume2 } from 'lucide-react';
import { Language, SystemStatus } from '../types';
import { getT } from '../i18n';
import { BrandMark } from './BrandMark';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  systemStatus: SystemStatus | null;
  onOpenSoundboxModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  systemStatus,
  onOpenSoundboxModal
}) => {
  const t = getT(language);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E4EAF1] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F9FF]">
            <BrandMark className="h-9 w-9" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold tracking-tight text-[#10243A]">{t.appTitle}</p>
            <p className="truncate text-xs text-[#667085]">
              {systemStatus?.store_profile.name || t.storeName}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSoundboxModal}
            className="hidden min-h-10 items-center gap-2 rounded-xl border border-[#E4EAF1] px-3 text-sm font-semibold text-[#344054] hover:bg-[#F8FAFC] sm:flex"
          >
            <Volume2 className="h-4 w-4 text-[#002970]" aria-hidden="true" />
            <span>{language === 'hi' ? 'आवाज़ सुनें' : language === 'te' ? 'వాయిస్ వినండి' : 'Hear a sample'}</span>
          </button>
          <label className="sr-only" htmlFor="language-select">{language === 'hi' ? 'भाषा चुनें' : language === 'te' ? 'భాష ఎంచుకోండి' : 'Choose language'}</label>
          <select
            id="language-select"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as Language)}
            className="min-h-10 rounded-xl border border-[#E4EAF1] bg-white px-2.5 text-sm font-semibold text-[#344054] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#00BAF2]"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
      </div>
      <div className="border-t border-[#E4EAF1] bg-[#F0F9FF]">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center gap-2 px-4 py-1.5 text-xs leading-snug text-[#344054] sm:px-6 lg:px-8">
          <Info className="h-4 w-4 shrink-0 text-[#002970]" aria-hidden="true" />
          <p>{t.demoNotice}</p>
        </div>
      </div>
    </header>
  );
};
