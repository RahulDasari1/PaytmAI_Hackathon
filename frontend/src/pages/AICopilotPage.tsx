import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  ArrowRight, 
  Mic,
  MicOff,
  User,
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

interface SpeechRecognitionResultEvent extends Event {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
  resultIndex: number;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const voiceCopy: Record<Language, { listening: string; unsupported: string; error: string; heard: string }> = {
  en: {
    listening: 'Listening… speak now.',
    unsupported: 'Voice input is not available in this browser. You can type your question instead.',
    error: 'Could not hear you. Please allow microphone access and try again.',
    heard: 'I heard:'
  },
  hi: {
    listening: 'सुन रहा हूँ… अब बोलें।',
    unsupported: 'इस ब्राउज़र में आवाज़ से लिखना उपलब्ध नहीं है। आप सवाल टाइप कर सकते हैं।',
    error: 'आपकी आवाज़ सुनाई नहीं दी। माइक की अनुमति देकर फिर कोशिश करें।',
    heard: 'आपने कहा:'
  },
  te: {
    listening: 'వింటున్నాను… ఇప్పుడు మాట్లాడండి.',
    unsupported: 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ లేదు. మీ ప్రశ్నను టైప్ చేయవచ్చు.',
    error: 'మీ మాట వినిపించలేదు. మైక్ అనుమతించి మళ్లీ ప్రయత్నించండి.',
    heard: 'మీరు చెప్పింది:'
  }
};

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
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    loadSuggestions(language);
    if (messages.length === 0) {
      const welcomeContent = language === 'hi'
        ? "नमस्ते शर्मा जी! मैं आपका दुकान साथी हूँ।\n\nबिक्री, स्टॉक या ग्राहकों के बारे में पूछें। नीचे दिए सवाल चुनें या अपना सवाल लिखें।"
        : language === 'te'
        ? "నమస్కారం శర్మ గారూ! నేను మీ దుకాణ్ సాథీని.\n\nఅమ్మకాలు, స్టాక్ లేదా కస్టమర్ల గురించి అడగండి. కింద ఉన్న ప్రశ్నను ఎంచుకోండి లేదా మీ ప్రశ్నను టైప్ చేయండి."
        : "Namaste Sharma ji! I am your Dukaan Saathi.\n\nAsk me about sales, stock or customers. Choose a question below, type your own, or tap the mic to speak.";

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

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus(voiceCopy[language].unsupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex]?.[0]?.transcript?.trim();
      if (transcript) {
        setInputText(transcript);
        setVoiceStatus(`${voiceCopy[language].heard} ${transcript}`);
      }
    };
    recognition.onerror = () => {
      setVoiceStatus(voiceCopy[language].error);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    setVoiceStatus(voiceCopy[language].listening);
    setIsListening(true);
    try {
      recognition.start();
    } catch (error) {
      console.error('Could not start voice input:', error);
      setIsListening(false);
      recognitionRef.current = null;
      setVoiceStatus(voiceCopy[language].error);
    }
  };

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return (
    <div className="mx-auto flex h-[calc(100dvh-11rem)] min-h-[460px] max-w-4xl flex-col gap-5 pb-3">
      
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
                <h1 className="text-base sm:text-lg font-extrabold text-[#10243A]">
                  {t.navCopilot}
                </h1>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A] animate-pulse"></span>
                      {language === 'hi' ? 'मदद के लिए तैयार' : language === 'te' ? 'సహాయానికి సిద్ధం' : 'Ready to help'}
                </span>
              </div>
                  <p className="text-xs text-[#667085]">
                    {language === 'hi' ? 'बिक्री, स्टॉक और ग्राहकों के बारे में पूछें।' : language === 'te' ? 'అమ్మకాలు, స్టాక్, కస్టమర్ల గురించి అడగండి.' : 'Ask about sales, stock or customers.'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSoundboxModal}
            className="flex min-h-10 items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#344054] shadow-xs transition-all hover:border-[#002970] hover:text-[#002970]"
            title={language === 'hi' ? 'आवाज़ का नमूना सुनें' : language === 'te' ? 'వాయిస్ నమూనా వినండి' : 'Hear a voice sample'}
          >
            <Volume2 className="h-4 w-4 text-[#00BAF2]" aria-hidden="true" />
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
                  <div className="whitespace-pre-line text-sm leading-7">
                    {msg.content}
                  </div>
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
                    <span>{language === 'hi' ? 'आपकी दुकान की जानकारी देख रहा हूँ…' : language === 'te' ? 'మీ దుకాణం వివరాలను చూస్తున్నాను…' : 'Checking your shop update…'}</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Queries Chips */}
        <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E4EAF1] overflow-x-auto flex items-center gap-2">
          <span className="text-xs font-bold text-[#667085] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00BAF2]" />
            <span>{language === 'hi' ? 'पूछें:' : language === 'te' ? 'అడగండి:' : 'Try asking:'}</span>
          </span>
          {suggestions.slice(0, 4).map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="px-3 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#EBF7FF] text-[#344054] hover:text-[#002970] border border-[#E4EAF1] hover:border-[#B9E6FE] transition-all whitespace-nowrap shadow-fintech-xs"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Persistent Input Composer */}
        <div className="p-4 bg-white border-t border-[#E4EAF1]">
          {voiceStatus && (
            <p className="mb-2 text-sm text-[#475467]" role="status" aria-live="polite">{voiceStatus}</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              aria-label={isListening ? (language === 'hi' ? 'सुनना बंद करें' : language === 'te' ? 'వినడం ఆపండి' : 'Stop listening') : (language === 'hi' ? 'बोलकर सवाल पूछें' : language === 'te' ? 'మాట్లాడి అడగండి' : 'Speak your question')}
              aria-pressed={isListening}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2] ${
                isListening ? 'border-[#F04438] bg-[#FEF3F2] text-[#B42318]' : 'border-[#E4EAF1] bg-white text-[#002970] hover:bg-[#F0F9FF]'
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" aria-hidden="true" /> : <Mic className="h-5 w-5" aria-hidden="true" />}
            </button>
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
              className="min-h-12 flex-1 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF1] focus:border-[#00BAF2] focus:bg-white text-sm focus:outline-none transition-all placeholder:text-[#98A2B3]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#002970] to-[#00BAF2] text-white hover:opacity-90 disabled:opacity-40 transition-all shadow-fintech-xs"
              aria-label={t.sendMessage}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
