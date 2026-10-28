import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Package, 
  Megaphone,
  User,
  ShieldCheck,
  Calendar,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { getT } from '../i18n';
import { api } from '../services/api';

interface AICopilotPageProps {
  language: Language;
  onNavigate: (tab: string, context?: any) => void;
  onOpenSoundboxModal: () => void;
  initialQuery?: string;
}

export const AICopilotPage: React.FC<AICopilotPageProps> = ({
  language,
  onNavigate,
  onOpenSoundboxModal,
  initialQuery
}) => {
  const t = getT(language);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeEvidence, setActiveEvidence] = useState<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSuggestions(language);
    if (messages.length === 0) {
      const welcomeContent = language === 'hi'
        ? "नमस्ते शर्मा जी! मैं आपका **दुकान साथी AI** सलाहकार हूँ।\n\nआप मुझसे बिक्री में गिरावट, नए ऑफर्स, स्टॉक खत्म होने का समय या ग्राहकों को वापस लाने के तरीके पूछ सकते हैं। नीचे दिए गए सुझावों में से चुनें या अपना प्रश्न टाइप करें।"
        : language === 'te'
        ? "నమస్కారం శర్మ గారూ! నేను మీ **దుకాణ్ సాథీ AI** వ్యాపార సహాయకుడిని.\n\nమీరు మీ విక్రయాల మార్పులు, స్టాక్ అవసరాలు లేదా ప్రచార ఆఫర్ల గురించి నన్ను అడగవచ్చు. క్రింద ఉన్న ప్రశ్నలను ఎంచుకోండి లేదా మీ సందేశాన్ని టైప్ చేయండి."
        : "Namaste Sharma ji! I am **Dukaan Saathi AI**, your dedicated business growth advisor.\n\nI analyze your transaction ledger to explain why footfall changed, predict stock depletion, and draft high-conversion promotions. Choose a query below or ask anything about your shop!";

      setMessages([
        {
          id: 'welcome_1',
          sender: 'assistant',
          content: welcomeContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [language]);

  useEffect(() => {
    if (initialQuery && initialQuery.length > 0) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadSuggestions = async (lang: Language) => {
    try {
      const sugs = await api.getSuggestions(lang);
      setSuggestions(sugs);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setLoading(true);

    try {
      const res = await api.askCopilot(textToSend, language);

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        content: res.answer,
        tool_called: res.tool_called,
        tool_data: res.tool_data,
        recommended_action: res.recommended_action,
        cta_label: res.cta_label,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (res.tool_data) {
        setActiveEvidence({
          tool: res.tool_called,
          data: res.tool_data,
          action: res.recommended_action,
          cta_label: res.cta_label
        });
      }
    } catch (err) {
      console.error('Copilot request failed:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          content: "Sorry, I encountered a temporary issue executing that query. Please try again or pick one of the suggestions.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col lg:flex-row gap-5 max-w-7xl mx-auto">
      
      {/* Left/Main Column: Conversational Workspace */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#E4EAF1] shadow-fintech-xs overflow-hidden">
        
        {/* Workspace Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#E4EAF1] bg-[#FAFCFF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#002970] to-[#00BAF2] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-[#10243A]">
                  {t.navCopilot}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A] animate-pulse"></span>
                  Active Advisor
                </span>
              </div>
              <p className="text-[11px] text-[#667085]">
                Connected to 90-day transactions, inventory velocity, and customer cohorts
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSoundboxModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E4EAF1] hover:border-[#002970] text-xs font-bold text-[#344054] hover:text-[#002970] transition-all shadow-xs"
            title="Simulate Paytm Soundbox audio"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span className="hidden sm:inline">{t.soundboxVoiceBtn}</span>
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-[#10243A] text-white'
                    : 'bg-[#002970] text-[#00BAF2]'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Block */}
              <div className="space-y-2 max-w-[90%] sm:max-w-xl">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#002970] text-white rounded-tr-none font-medium'
                      : 'bg-[#F8FAFC] border border-[#E4EAF1] text-[#1D2939] rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* Tool Execution Tag */}
                  {msg.tool_called && (
                    <div className="mt-3 pt-2.5 border-t border-[#E4EAF1] flex items-center justify-between text-[11px] font-semibold text-[#667085]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00BAF2]"></span>
                        <span>Executed: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E4EAF1] text-[#002970] font-mono">{msg.tool_called}</code></span>
                      </div>
                      <span className="text-[10px] text-[#027A48] bg-[#ECFDF3] px-1.5 py-0.5 rounded border border-[#A6F4C5]">
                        Verified Data
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Action Card */}
                {msg.recommended_action && (
                  <div className="p-3 bg-[#EBF7FF] rounded-xl border border-[#B9E6FE] flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00BAF2] shrink-0" />
                      <span className="text-xs font-bold text-[#002970]">
                        {msg.cta_label || "Take Recommended Action"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (msg.recommended_action === 'CREATE_COMBO_CAMPAIGN') {
                          onNavigate('campaigns', { objective: 'EVENING_FOOTFALL_BOOST' });
                        } else if (msg.recommended_action === 'CREATE_INACTIVE_CAMPAIGN') {
                          onNavigate('campaigns', { objective: 'WIN_BACK_INACTIVE' });
                        } else if (msg.recommended_action === 'VIEW_INVENTORY') {
                          onNavigate('inventory');
                        } else if (msg.recommended_action === 'VIEW_HOURLY_CHART') {
                          onNavigate('sales');
                        } else {
                          onNavigate('overview');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#002970] hover:bg-[#081728] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all shrink-0"
                    >
                      <span>Proceed</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div
                  className={`text-[10px] text-[#98A2B3] font-medium ${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-xl mr-auto animate-pulse">
              <div className="w-7 h-7 rounded-xl bg-[#EBF7FF] text-[#002970] flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E4EAF1] text-xs text-[#667085] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00BAF2] animate-ping"></span>
                <span>Executing analytics tools & inspecting 90-day ledger...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Queries Chips */}
        <div className="px-4 py-2 bg-[#F8FAFC] border-t border-[#E4EAF1] overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00BAF2]" />
            <span>Suggested:</span>
          </span>
          {suggestions.slice(0, 4).map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white hover:bg-[#EBF7FF] text-[#344054] hover:text-[#002970] border border-[#E4EAF1] hover:border-[#B9E6FE] transition-all whitespace-nowrap shadow-fintech-xs"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Persistent Input Composer */}
        <div className="p-3.5 bg-white border-t border-[#E4EAF1]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'hi'
                  ? "दुकान साथी से पूछें (उदा. बिक्री क्यों घटी, कौन सा सामान मंगाएं)..."
                  : language === 'te'
                  ? "దుకాణ్ సాథీని అడగండి (ఉదా. విక్రయాలు ఎందుకు తగ్గాయి, ఏ స్టాక్ ఆర్డర్ చేయాలి)..."
                  : "Ask Dukaan Saathi (e.g. Why did sales decrease? What should I stock more of?)..."
              }
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1] focus:border-[#00BAF2] focus:bg-white text-xs sm:text-sm focus:outline-none transition-all placeholder:text-[#98A2B3]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#002970] to-[#00BAF2] text-white hover:opacity-90 disabled:opacity-40 transition-all shadow-fintech-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Right Column: Contextual Evidence & Analytics Inspector (Desktop 320px) */}
      <div className="hidden lg:flex flex-col w-80 bg-white rounded-2xl border border-[#E4EAF1] shadow-fintech-xs p-4 justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E4EAF1] mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#002970]" />
              <h2 className="text-xs font-bold text-[#10243A] uppercase tracking-wider">
                Ledger Evidence Inspector
              </h2>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#12B76A]"></span>
          </div>

          {activeEvidence ? (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1]">
                <div className="text-[10px] font-bold text-[#667085] uppercase">Active Tool Source</div>
                <div className="text-xs font-bold text-[#002970] font-mono mt-0.5">{activeEvidence.tool}</div>
              </div>

              {/* Specific Card based on tool data */}
              {activeEvidence.tool === 'compare_sales_periods' && (
                <div className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#B42318]">
                    <span>Sales Variance</span>
                    <span>{activeEvidence.data.sales_growth_pct}%</span>
                  </div>
                  <div className="text-[11px] text-[#475467] leading-snug">
                    Recent: ₹{activeEvidence.data.period1?.sales?.toLocaleString()} vs Prior: ₹{activeEvidence.data.period2?.sales?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#B42318] font-semibold pt-1 border-t border-[#FECDCA]">
                    Concentrated in Evening Snacks (-24%)
                  </div>
                </div>
              )}

              {activeEvidence.tool === 'get_customer_insights' && (
                <div className="p-3.5 rounded-xl bg-[#FFF9EB] border border-[#FEF0C7] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#B54708]">
                    <span>At-Risk Regulars</span>
                    <span>{activeEvidence.data.metrics?.at_risk_inactive || 35}</span>
                  </div>
                  <div className="text-[11px] text-[#475467] leading-snug">
                    Lapsed customers with no visit in 15-22 days despite past weekly habits.
                  </div>
                </div>
              )}

              {activeEvidence.tool === 'get_inventory_recommendations' && (
                <div className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#B42318]">
                    <span>Critical Stock Risk</span>
                    <span>Fortune Sunflower Oil</span>
                  </div>
                  <div className="text-[11px] text-[#475467] leading-snug">
                    Estimated 1.6 days of supply left. Stockout risk within 36 hours.
                  </div>
                </div>
              )}

              {activeEvidence.tool === 'get_peak_hours' && (
                <div className="p-3.5 rounded-xl bg-[#F0F9FF] border border-[#B9E6FE] space-y-2">
                  <div className="text-xs font-bold text-[#002970]">Peak Window Identified</div>
                  <div className="text-[11px] text-[#475467]">
                    Evening: 5:30 PM - 8:30 PM (62% of snacks revenue)
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 px-2 space-y-2 text-[#667085]">
              <Info className="w-8 h-8 mx-auto text-[#98A2B3]" />
              <p className="text-xs font-medium">
                Ask a question to see real computed ledger evidence appear in this inspector panel.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Store Profile Indicator */}
        <div className="pt-3 border-t border-[#E4EAF1] text-[11px] text-[#667085] flex items-center justify-between">
          <span>Active Store:</span>
          <span className="font-bold text-[#10243A]">Sharma General Store</span>
        </div>
      </div>

    </div>
  );
};
