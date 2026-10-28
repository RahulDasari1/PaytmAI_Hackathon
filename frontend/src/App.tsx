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

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [language, setLanguage] = useState<Language>('en');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Judge 3-minute guided demo
  const [isJudgeDemoActive, setIsJudgeDemoActive] = useState<boolean>(true);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(1);

  // Paytm Soundbox simulator modal
  const [isSoundboxModalOpen, setIsSoundboxModalOpen] = useState<boolean>(false);

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-sky-200 selection:text-[#0F2D6B]">
      
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
        
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            language={language}
            criticalInventoryCount={criticalCount}
          />
        </div>

        {/* Mobile Navigation bar for small screens */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around py-2.5 px-1 shadow-lg">
          {[
            { id: 'overview', label: 'Dashboard' },
            { id: 'copilot', label: 'AI Copilot' },
            { id: 'sales', label: 'Sales' },
            { id: 'campaigns', label: 'Campaigns' },
            { id: 'inventory', label: 'Inventory' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg ${
                currentTab === item.id ? 'bg-[#0F2D6B] text-white' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full pb-20 md:pb-8">
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
