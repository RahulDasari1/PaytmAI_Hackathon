import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { JudgeDemoBanner } from './components/JudgeDemoBanner';
import { VoiceSpeakerModal } from './components/VoiceSpeakerModal';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { AICopilotPage } from './pages/AICopilotPage';
import { SalesAnalyticsPage } from './pages/SalesAnalyticsPage';
import { CustomerInsightsPage } from './pages/CustomerInsightsPage';
import { CampaignStudioPage } from './pages/CampaignStudioPage';
import { InventoryPage } from './pages/InventoryPage';
import { BusinessImpactPage } from './pages/BusinessImpactPage';
import { SettingsPage } from './pages/SettingsPage';
import { Language, SystemStatus } from './types';
import { api } from './services/api';
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
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Judge 3-minute guided demo
  const [isJudgeDemoActive, setIsJudgeDemoActive] = useState<boolean>(true);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(1);

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
    if (context) {
      setNavigationContext(context);
      if (tab === 'copilot' && context.query) {
        setCopilotInitialQuery(context.query);
      }
    }
  };

  const handleJudgeDemoStep = (stepNumber: number) => {
    setJudgeDemoStep(stepNumber);
    if (stepNumber === 1) {
      setCurrentTab('overview');
    } else if (stepNumber === 2) {
      setCurrentTab('copilot');
      setCopilotInitialQuery('Why did my sales decrease this week?');
    } else if (stepNumber === 3) {
      setCurrentTab('sales');
    } else if (stepNumber === 4) {
      setCurrentTab('campaigns');
      setNavigationContext({ objective: 'EVENING_FOOTFALL_BOOST' });
    } else if (stepNumber === 5) {
      setCurrentTab('inventory');
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
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans text-[#1D2939] selection:bg-[#B9E6FE] selection:text-[#002970]">
      
      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        systemStatus={systemStatus}
        onResetDemo={handleResetDemo}
        onOpenSoundboxModal={() => setIsSoundboxModalOpen(true)}
        onToggleJudgeDemo={() => setIsJudgeDemoActive(!isJudgeDemoActive)}
        isJudgeDemoActive={isJudgeDemoActive}
      />

      {/* Optional Judge Demo Walkthrough Banner */}
      {isJudgeDemoActive && (
        <JudgeDemoBanner
          currentStep={judgeDemoStep}
          onSelectStep={handleJudgeDemoStep}
          onClose={() => setIsJudgeDemoActive(false)}
          language={language}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
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
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-y-auto max-w-full pb-20 md:pb-8">
          {currentTab === 'overview' && (
            <OverviewDashboard language={language} onNavigate={handleNavigate} />
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
            <SalesAnalyticsPage language={language} onNavigate={handleNavigate} />
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
            <BusinessImpactPage language={language} />
          )}
          {currentTab === 'settings' && (
            <SettingsPage
              language={language}
              onLanguageChange={setLanguage}
              systemStatus={systemStatus}
              onResetDemo={handleResetDemo}
            />
          )}
        </main>

      </div>

      {/* Mobile-First Bottom Navigation Bar for Smart Devices */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E4EAF1] flex justify-around items-center py-2 px-1 shadow-fintech-lg">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'copilot', label: 'Copilot', icon: Bot, isHighlight: true },
          { id: 'sales', label: 'Sales', icon: TrendingUp },
          { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
          { id: 'inventory', label: 'Inventory', icon: Package, hasBadge: criticalCount > 0 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive ? 'text-[#002970] font-bold' : 'text-[#667085]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#002970]' : 'text-[#667085]'}`} />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#F04438]" />
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* Mobile 'More' Drawer Button */}
        <button
          onClick={() => setIsMobileMoreOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#667085]`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </div>

      {/* Mobile 'More' Drawer Modal */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-5 space-y-4 border-t border-[#E4EAF1] animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAF1]">
              <span className="text-xs font-bold text-[#10243A] uppercase tracking-wider">Additional Navigation</span>
              <button onClick={() => setIsMobileMoreOpen(false)} className="p-1 text-[#667085]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {[
                { id: 'customers', label: 'Customer Insights', icon: Users },
                { id: 'impact', label: 'Business Impact & Value', icon: Award },
                { id: 'settings', label: 'Settings & Store Profile', icon: Settings },
              ].map((m) => {
                const MIcon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCurrentTab(m.id);
                      setIsMobileMoreOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold text-[#344054] hover:bg-[#F8FAFC]"
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
              className="w-full py-2.5 rounded-xl bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] font-bold text-xs flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-[#12B76A]" />
              <span>Simulate Paytm Soundbox Audio</span>
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
