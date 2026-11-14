import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
  eyebrow?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  action,
  eyebrow = 'Your shop, made simpler'
}) => (
  <header className="relative isolate overflow-hidden rounded-[26px] border border-[#D8ECF8] bg-gradient-to-br from-white via-white to-[#EAF8FF] p-5 shadow-[0_8px_24px_-18px_rgba(0,41,112,0.28)] sm:p-6">
    <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#00BAF2]/10" aria-hidden="true" />
    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#002970] to-[#00A8E0] text-white shadow-[0_8px_16px_-10px_rgba(0,41,112,0.7)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#0087BD]">{eyebrow}</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-[#10243A] sm:text-2xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#475467]">{description}</p>
        </div>
      </div>
      {action && <div className="relative shrink-0 sm:pl-3">{action}</div>}
    </div>
  </header>
);
