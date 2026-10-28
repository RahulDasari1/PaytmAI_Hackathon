import React from 'react';
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
  Volume2
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

  const navItems = [
    { id: 'overview', label: t.navOverview, icon: LayoutDashboard },
    { id: 'copilot', label: t.navCopilot, icon: Bot, isHighlight: true },
    { id: 'sales', label: t.navSales, icon: TrendingUp },
    { id: 'customers', label: t.navCustomers, icon: Users },
    { id: 'campaigns', label: t.navCampaigns, icon: Megaphone },
    { 
      id: 'inventory', 
      label: t.navInventory, 
      icon: Package, 
      badge: criticalInventoryCount > 0 ? `${criticalInventoryCount} alert` : undefined 
    },
    { id: 'impact', label: t.navImpact, icon: Award },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E4EAF1] flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Navigation Links */}
      <div className="p-3.5 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-[#667085] uppercase tracking-wider">
          Merchant Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#002970] text-white shadow-sm'
                  : 'text-[#475467] hover:text-[#10243A] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00BAF2]' : 'text-[#667085]'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.isHighlight && !isActive && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-[#EBF7FF] text-[#002970] border border-[#B9E6FE]">
                  AI
                </span>
              )}

              {item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1 tabular-nums ${
                  isActive ? 'bg-amber-400 text-slate-900' : 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]'
                }`}>
                  <AlertCircle className="w-3 h-3" />
                  <span>{item.badge}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Merchant Device Card */}
      <div className="p-3.5 m-3 rounded-2xl bg-[#F8FAFC] border border-[#E4EAF1]">
        <div className="flex items-center justify-between text-xs font-bold text-[#10243A]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-pulse"></span>
            <span>Paytm Soundbox</span>
          </div>
          <span className="text-[10px] font-bold text-[#027A48] bg-[#ECFDF3] px-1.5 py-0.5 rounded border border-[#A6F4C5]">
            ONLINE
          </span>
        </div>

        <p className="text-[11px] text-[#667085] mt-1.5 leading-snug">
          Instant audio receipt confirmations enabled for counter billing.
        </p>

        <div className="mt-2.5 pt-2 border-t border-[#E4EAF1] flex items-center justify-between text-[11px]">
          <span className="text-[#667085]">VPA:</span>
          <span className="font-bold text-[#002970]">sharmastore@paytm</span>
        </div>
      </div>

    </aside>
  );
};
