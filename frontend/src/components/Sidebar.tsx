import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  TrendingUp, 
  Users, 
  Megaphone, 
  Package, 
  Award, 
  Settings,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { Language } from '../types';
import { getT } from '../i18n';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  criticalInventoryCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  language,
  criticalInventoryCount
}) => {
  const t = getT(language);

  const primaryItems = [
    { id: 'overview', label: t.navHome, icon: LayoutDashboard },
    { id: 'copilot', label: t.navCopilot, icon: Bot },
    { id: 'inventory', label: t.navInventory, icon: Package },
    { id: 'campaigns', label: t.navCampaigns, icon: Megaphone }
  ];
  const moreItems = [
    { id: 'sales', label: t.navSales, icon: TrendingUp },
    { id: 'customers', label: t.navCustomers, icon: Users },
    { id: 'impact', label: t.navImpact, icon: Award },
    { id: 'settings', label: t.navSettings, icon: Settings }
  ];
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isMoreActive = moreItems.some((item) => item.id === currentTab);
  const showMoreItems = isMoreOpen || isMoreActive;

  const renderItem = (item: typeof primaryItems[number] | typeof moreItems[number]) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => onSelectTab(item.id)}
        aria-current={isActive ? 'page' : undefined}
        className={`w-full flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all ${
          isActive
            ? 'bg-[#EAF8FF] text-[#002970] ring-1 ring-[#B9E6FE] shadow-[0_5px_16px_-12px_rgba(0,41,112,0.5)]'
            : 'text-[#475467] hover:bg-[#F4FAFD] hover:text-[#10243A]'
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#0087BD]' : 'text-[#667085]'}`} />
          <span>{item.label}</span>
        </span>
        {item.id === 'inventory' && criticalInventoryCount > 0 && (
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
            isActive ? 'bg-amber-400 text-slate-900' : 'bg-[#FEF3F2] text-[#B42318]'
          }`}>
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {criticalInventoryCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="sticky top-[5.75rem] flex min-h-[calc(100vh-5.75rem)] w-60 shrink-0 flex-col justify-between border-r border-[#E4EAF1] bg-white/90">
      <div className="p-3">
        <nav aria-label={t.navMoreTools} className="space-y-1">
          {primaryItems.map(renderItem)}
          <button
            onClick={() => setIsMoreOpen((open) => !open)}
            aria-expanded={showMoreItems}
            className="mt-2 flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-semibold text-[#667085] transition-colors hover:bg-[#F4FAFD] hover:text-[#10243A]"
          >
            <span>{t.navMoreTools}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showMoreItems ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {showMoreItems && <div className="space-y-1 border-l border-[#B9E6FE] pl-2">{moreItems.map(renderItem)}</div>}
        </nav>
        <div className="m-3 mt-4 rounded-2xl border border-[#D4ECF8] bg-gradient-to-br from-[#EFFAFF] to-white p-4">
          <p className="text-sm font-bold text-[#002970]">{t.navCopilot}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#475467]">
            {language === 'hi' ? 'बिक्री, स्टॉक या ऑफ़र के बारे में पूछें।' : language === 'te' ? 'అమ్మకాలు, స్టాక్ లేదా ఆఫర్ల గురించి అడగండి.' : 'Ask about sales, stock or offers.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
