import React, { useState } from 'react';
import { Download, Info, UserRound, X } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../i18n';
import { BrandMark } from './BrandMark';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange
}) => {
  const t = getT(language);
  const [dialog, setDialog] = useState<'download' | 'signin' | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-[#DCE6EF] bg-white/95 shadow-[0_3px_14px_-12px_rgba(16,36,58,0.55)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark className="h-8 w-[112px] shrink-0 sm:h-9 sm:w-40" />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <label className="sr-only" htmlFor="language-select">{language === 'hi' ? 'भाषा चुनें' : language === 'te' ? 'భాష ఎంచుకోండి' : 'Choose language'}</label>
          <select
            id="language-select"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as Language)}
            className="min-h-9 rounded-xl border border-[#E4EAF1] bg-white px-1.5 text-xs font-semibold text-[#344054] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#00BAF2] sm:min-h-10 sm:px-2.5 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
          <button
            type="button"
            onClick={() => setDialog('download')}
            aria-label={t.downloadApp}
            className="inline-flex min-h-9 w-9 items-center justify-center rounded-xl text-[#002970] transition-colors hover:bg-[#F0F9FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2] sm:min-h-10 sm:w-auto sm:gap-2 sm:px-2"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden text-sm font-semibold sm:inline">{t.downloadApp}</span>
          </button>
          <button
            type="button"
            onClick={() => setDialog('signin')}
            aria-label={t.signIn}
            className="inline-flex min-h-9 items-center gap-1 rounded-full bg-[#002970] p-1 pr-2 text-sm font-bold text-white transition-colors hover:bg-[#0F3B8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2] sm:min-h-10 sm:gap-2 sm:pr-4"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00BAF2] text-white sm:h-8 sm:w-8">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">{t.signIn}</span>
          </button>
        </div>
      </div>
      <div className="border-t border-[#E1F2FA] bg-gradient-to-r from-[#EAF8FF] via-white to-[#F0F9FF]">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center gap-2 px-4 py-1.5 text-xs leading-snug text-[#344054] sm:px-6 lg:px-8">
          <Info className="h-4 w-4 shrink-0 text-[#002970]" aria-hidden="true" />
          <p>{t.demoNotice}</p>
        </div>
      </div>
      {dialog && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialog(null);
          }}
        >
          <section
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="navbar-action-title"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="navbar-action-title" className="text-lg font-extrabold text-[#10243A]">
                {dialog === 'download' ? t.downloadUnavailableTitle : t.signInUnavailableTitle}
              </h2>
              <button
                type="button"
                onClick={() => setDialog(null)}
                aria-label={t.navClose}
                className="rounded-lg p-2 text-[#667085] hover:bg-[#F2F4F7]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#475467]">
              {dialog === 'download' ? t.downloadUnavailable : t.signInUnavailable}
            </p>
            <button
              type="button"
              onClick={() => setDialog(null)}
              className="mt-5 min-h-11 w-full rounded-xl bg-[#002970] px-4 text-sm font-bold text-white hover:bg-[#0F3B8C]"
            >
              {t.navClose}
            </button>
          </section>
        </div>
      )}
    </header>
  );
};
