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
  AlertCircle
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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Merchant Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#0F2D6B] to-[#002970] text-white shadow-sm shadow-blue-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00BAF2]' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.isHighlight && !isActive && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-sky-100 text-[#0F2D6B]">
                  AI
                </span>
              )}

              {item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1 ${
                  isActive ? 'bg-amber-400 text-slate-900' : 'bg-rose-100 text-rose-700'
                }`}>
                  <AlertCircle className="w-3 h-3" />
                  <span>{item.badge}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Merchant Quick Info */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/80">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Paytm UPI Soundbox</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Instant audio receipt alerts active for Sharma General Store.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-[#0F2D6B] font-semibold">
          <span>UPI: sharmastore@paytm</span>
        </div>
      </div>
    </aside>
  );
};
