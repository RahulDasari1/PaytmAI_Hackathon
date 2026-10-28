import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  ChevronRight, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Package, 
  Megaphone,
  User,
  CheckCircle2,
  AlertTriangle
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
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial greeting and suggestions
    loadSuggestions(language);
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome_1',
          sender: 'assistant',
          content: language === 'hi' 
            ? "नमस्ते शर्मा जी! मैं आपका **दुकान साथी AI** सलाहकार हूँ।\n\nआप मुझसे बिक्री में गिरावट, नए ऑफर्स, स्टॉक खत्म होने का समय या ग्राहकों को वापस लाने के तरीके पूछ सकते हैं। नीचे दिए गए सुझावों में से चुनें या अपना प्रश्न टाइप करें।"
            : language === 'te'
            ? "నమస్కారం శర్మ గారూ! నేను మీ **దుకాణ్ సాథీ AI** వ్యాపార సహాయకుడిని.\n\nమీరు మీ విక్రయాల మార్పులు, స్టాక్ అవసరాలు లేదా ప్రచార ఆఫర్ల గురించి నన్ను అడగవచ్చు. క్రింద ఉన్న ప్రశ్నలను ఎంచుకోండి లేదా మీ సందేశాన్ని టైప్ చేయండి."
            : "Namaste Sharma ji! I am **Dukaan Saathi AI**, your business growth partner.\n\nI can help you understand sales variations, identify why footfall changed, re-engage inactive customers, and plan stock before the weekend. Choose a query below or ask anything about your store!",
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
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Copilot Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-sky-50/50 to-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F2D6B] to-[#00BAF2] flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">
                {t.navCopilot}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Advisor
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tool-connected intelligence: Analytics Engine • Inventory Velocity • Campaign Studio
            </p>
          </div>
        </div>

        {/* Quick Voice Soundbox Trigger */}
        <button
          onClick={onOpenSoundboxModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#0F2D6B] text-xs font-semibold text-slate-700 hover:text-[#0F2D6B] transition-all shadow-sm"
          title="Simulate Paytm Soundbox audio"
        >
          <Volume2 className="w-4 h-4 text-[#00BAF2]" />
          <span className="hidden sm:inline">{t.soundboxVoiceBtn}</span>
        </button>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-slate-700'
                  : 'bg-gradient-to-tr from-[#0F2D6B] to-[#00BAF2] shadow-sm'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0F2D6B] text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Formatted Content */}
                <div className="whitespace-pre-line prose prose-sm max-w-none">
                  {msg.content}
                </div>

                {/* Tool badge if executed */}
                {msg.tool_called && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    <span>Tool executed: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#0F2D6B]">{msg.tool_called}</code></span>
                  </div>
                )}
              </div>

              {/* Embedded Actionable Cards based on Tool Response */}
              {msg.recommended_action && (
                <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-200/80 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00BAF2] shrink-0" />
                    <span className="text-xs font-bold text-[#0F2D6B]">
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
                    className="px-3.5 py-1.5 rounded-xl bg-[#0F2D6B] hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                  >
                    <span>Proceed</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div
                className={`text-[10px] text-slate-400 font-medium ${
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
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
              <span>Analyzing transaction ledger & calculating insights...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-500" />
          <span>Ask:</span>
        </span>
        {suggestions.slice(0, 4).map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sug)}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0F2D6B] border border-slate-200 hover:border-sky-300 transition-all whitespace-nowrap shadow-2xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200">
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
                ? "दुकान साथी से पूछें (उदा. बिक्री क्यों कम हुई, क्या सामान मंगाना है)..."
                : language === 'te'
                ? "దుకాణ్ సాథీని అడగండి (ఉదా. విక్రయాలు ఎందుకు తగ్గాయి, ఏ స్టాక్ కావాలి)..."
                : "Ask Dukaan Saathi (e.g., Why did sales drop? Which products to promote?)..."
            }
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 border border-transparent focus:border-sky-400 focus:bg-white text-sm focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-3 rounded-2xl bg-gradient-to-r from-[#0F2D6B] to-[#00BAF2] text-white hover:opacity-90 disabled:opacity-40 transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
