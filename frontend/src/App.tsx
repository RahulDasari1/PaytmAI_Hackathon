import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { VoiceSpeakerModal } from './components/VoiceSpeakerModal';
import { MerchantHomePage } from './pages/MerchantHomePage';
import { AICopilotPage } from './pages/AICopilotPage';
import { SalesAnalyticsPage } from './pages/SalesAnalyticsPage';
import { CustomerInsightsPage } from './pages/CustomerInsightsPage';
import { CampaignStudioPage } from './pages/CampaignStudioPage';
import { InventoryPage } from './pages/InventoryPage';
import { BusinessImpactPage } from './pages/BusinessImpactPage';
import { SettingsPage } from './pages/SettingsPage';
import { Language, SystemStatus } from './types';
import { api } from './services/api';
import { getT } from './i18n';
import { 
  LayoutDashboard, 
  Bot, 
  TrendingUp, 
  Megaphone, 
  Package, 
  MoreHorizontal,
  Users,
  Award,
  Settings,
  Volume2,
  X
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [language, setLanguage] = useState<Language>('en');
  const t = getT(language);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Paytm Soundbox simulator modal
  const [isSoundboxModalOpen, setIsSoundboxModalOpen] = useState<boolean>(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState<boolean>(false);

  // Navigation context
  const [navigationContext, setNavigationContext] = useState<any>(null);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState<string>('');
  const [criticalCount, setCriticalCount] = useState<number>(2);

  useEffect(() => {
    loadSystemStatus();
    loadCriticalCount();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
  }, [language]);

  const loadSystemStatus = async () => {
    try {
      const status = await api.getSystemStatus();
      setSystemStatus(status);
    } catch (err) {
      console.error('Failed to load system status:', err);
    }
  };

  const loadCriticalCount = async () => {
    try {
      const inv = await api.getInventory();
      setCriticalCount(inv.filter(i => i.priority === 'CRITICAL').length);
    } catch (err) {
      console.error('Failed to load inventory count:', err);
    }
  };

  const handleNavigate = (tab: string, context?: any) => {
    setCurrentTab(tab);
    if (tab === 'copilot') {
      setCopilotInitialQuery(context?.query ?? '');
    }
    if (context) {
      setNavigationContext(context);
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm("Are you sure you want to regenerate the 90-day demo dataset for Sharma General Store?")) {
      try {
        await api.resetDemoData();
        loadSystemStatus();
        loadCriticalCount();
        alert("Demo data successfully regenerated with 4,600+ fresh transactions!");
        window.location.reload();
      } catch (err) {
        alert("Reset failed: " + err);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#F0F8FD_0%,#F7FAFC_260px,#F5F8FC_100%)] font-sans text-[#1D2939] selection:bg-[#B9E6FE] selection:text-[#002970]">
      
      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Main Container */}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        
        {/* Left Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            language={language}
            criticalInventoryCount={criticalCount}
          />
        </div>

        {/* Dynamic Page Content */}
        <main className="min-w-0 max-w-full flex-1 overflow-y-auto px-3.5 py-5 pb-24 sm:px-5 lg:px-7 lg:py-7 md:pb-8">
          {currentTab === 'overview' && (
            <MerchantHomePage language={language} onNavigate={handleNavigate} />
          )}
          {currentTab === 'copilot' && (
            <AICopilotPage
              language={language}
              onNavigate={handleNavigate}
              onOpenSoundboxModal={() => setIsSoundboxModalOpen(true)}
              initialQuery={copilotInitialQuery}
            />
          )}
          {currentTab === 'sales' && (
            <SalesAnalyticsPage language={language} />
          )}
          {currentTab === 'customers' && (
            <CustomerInsightsPage language={language} onNavigate={handleNavigate} />
          )}
          {currentTab === 'campaigns' && (
            <CampaignStudioPage language={language} presetContext={navigationContext} />
          )}
          {currentTab === 'inventory' && (
            <InventoryPage language={language} onRefreshCriticalCount={setCriticalCount} />
          )}
          {currentTab === 'impact' && (
            <BusinessImpactPage language={language} onNavigate={handleNavigate} />
          )}
          {currentTab === 'settings' && (
            <SettingsPage
              language={language}
              systemStatus={systemStatus}
              onResetDemo={handleResetDemo}
            />
          )}
        </main>

      </div>

      {/* Mobile-First Bottom Navigation Bar for Smart Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#DCE6EF] bg-white/95 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_28px_-20px_rgba(16,36,58,0.55)] backdrop-blur-md md:hidden">
        {[
          { id: 'overview', label: t.navHome, icon: LayoutDashboard },
          { id: 'copilot', label: t.navCopilot, icon: Bot, isHighlight: true },
          { id: 'inventory', label: t.navInventory, icon: Package, hasBadge: criticalCount > 0 },
          { id: 'campaigns', label: t.navCampaigns, icon: Megaphone },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-h-12 min-w-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 transition-all ${
                isActive ? 'bg-[#EAF8FF] font-bold text-[#002970]' : 'text-[#667085] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#002970]' : 'text-[#667085]'}`} />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#F04438]" />
                )}
              </div>
              <span className="text-[10px] leading-none">{item.label}</span>
            </button>
          );
        })}

        {/* Mobile 'More' Drawer Button */}
        <button
          onClick={() => setIsMobileMoreOpen(true)}
          aria-expanded={isMobileMoreOpen}
          className={`flex min-h-12 min-w-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 text-[#667085] transition-colors hover:bg-[#F8FAFC] ${isMobileMoreOpen ? 'bg-[#EAF8FF] text-[#002970]' : ''}`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t.navMore}</span>
        </button>
      </div>

      {/* Mobile 'More' Drawer Modal */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="space-y-4 rounded-t-[28px] border-t border-[#DCE6EF] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-16px_40px_-24px_rgba(16,36,58,0.55)] animate-in slide-in-from-bottom"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-more-title"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAF1]">
              <span id="mobile-more-title" className="text-sm font-bold text-[#10243A]">{t.navMoreTools}</span>
              <button onClick={() => setIsMobileMoreOpen(false)} aria-label={t.navClose} className="p-2 text-[#667085]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {[
                { id: 'sales', label: t.navSales, icon: TrendingUp },
                { id: 'customers', label: t.navCustomers, icon: Users },
                { id: 'impact', label: t.navImpact, icon: Award },
                { id: 'settings', label: t.navSettings, icon: Settings },
              ].map((m) => {
                const MIcon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCurrentTab(m.id);
                      setIsMobileMoreOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm font-semibold text-[#344054] hover:bg-[#F8FAFC]"
                  >
                    <MIcon className="w-4 h-4 text-[#002970]" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsMobileMoreOpen(false);
                setIsSoundboxModalOpen(true);
              }}
              className="w-full min-h-11 rounded-xl bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] font-bold text-sm flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-[#12B76A]" />
              <span>{t.soundboxVoiceBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Paytm Soundbox Voice Announcement Simulator Modal */}
      <VoiceSpeakerModal
        isOpen={isSoundboxModalOpen}
        onClose={() => setIsSoundboxModalOpen(false)}
        language={language}
      />

    </div>
  );
}

export default App;
