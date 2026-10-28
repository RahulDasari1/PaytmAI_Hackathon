import React, { useState } from 'react';
import { Volume2, X, Play, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { Language } from '../types';

interface VoiceSpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VoiceSpeakerModal: React.FC<VoiceSpeakerModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoiceSnippet, setSelectedVoiceSnippet] = useState<'payment' | 'alert' | 'campaign'>('payment');

  if (!isOpen) return null;

  const audioSnippets = {
    payment: {
      en: "Paytm received Rupees One Hundred and Eighty Six on Soundbox!",
      hi: "पेटीएम पर एक सौ छियासी रुपये प्राप्त हुए!",
      te: "పేటీఎం ద్వారా నూట ఎనభై ఆరు రూపాయలు పొందబడ్డాయి!"
    },
    alert: {
      en: "Dukaan Saathi Alert: Fortune Sunflower Oil is low on stock! 1.6 days remaining.",
      hi: "दुकान साथी अलर्ट: फॉर्च्यून तेल का स्टॉक खत्म होने वाला है! केवल 1.6 दिन बाकी।",
      te: "దుకాణ్ సాథీ హెచ్చరిక: ఫార్చ్యూన్ సన్‌ఫ్లవర్ ఆయిల్ స్టాక్ త్వరలో ముగియనుంది!"
    },
    campaign: {
      en: "Dukaan Saathi: Evening Tea and Snacks combo offer has been drafted for 85 shoppers.",
      hi: "दुकान साथी: शाम की चाय और स्नैक्स ऑफर का ड्राफ्ट 85 ग्राहकों के लिए तैयार है।",
      te: "దుకాణ్ సాథీ: 85 మంది కస్టమర్ల కోసం సాయంత్రం కాంబో ఆఫర్ డ్రాఫ్ట్ సిద్ధమైంది."
    }
  };

  const handlePlayVoice = () => {
    setIsPlaying(true);
    const textToSpeak = audioSnippets[selectedVoiceSnippet][language];

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-IN';

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F2D6B] to-[#00BAF2] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Volume2 className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Paytm Soundbox Simulator</h3>
              <p className="text-xs text-sky-100 font-medium">Device: PSB-99214-NOIDA</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device graphic representation */}
        <div className="p-6 text-center bg-slate-50 border-b border-slate-200">
          <div className="relative mx-auto w-40 h-44 rounded-3xl bg-gradient-to-b from-[#0F2D6B] to-[#0A1E42] p-4 text-white shadow-xl flex flex-col justify-between items-center border-4 border-sky-400/40">
            {/* Speaker mesh */}
            <div className="w-full flex flex-col items-center gap-1 mt-2">
              <div className="w-12 h-1 rounded-full bg-sky-400"></div>
              <div className="w-8 h-1 rounded-full bg-sky-300"></div>
              <div className="w-4 h-1 rounded-full bg-sky-200"></div>
            </div>

            {/* Audio Wave animation when playing */}
            {isPlaying ? (
              <div className="flex items-center gap-1.5 h-12">
                <span className="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-10 bg-emerald-300 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-12 bg-[#00BAF2] rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-8 bg-sky-300 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-5 bg-emerald-400 rounded-full animate-bounce"></span>
              </div>
            ) : (
              <div className="text-center">
                <Volume2 className="w-8 h-8 mx-auto text-sky-300/80 mb-1" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-sky-200">
                  Ready to Announce
                </span>
              </div>
            )}

            {/* Device branding */}
            <div className="text-[11px] font-extrabold tracking-wider text-sky-100 flex items-center gap-1">
              <span>Paytm</span>
              <span className="text-sky-300 font-normal">Soundbox</span>
            </div>
          </div>
        </div>

        {/* Audio Type Options */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Voice Announcement
          </div>

          <div className="space-y-2">
            {[
              { id: 'payment', label: 'Payment Receipt (₹186 Received)', desc: 'Standard instant audio confirmation' },
              { id: 'alert', label: 'Dukaan Saathi AI Stock Alert', desc: 'Critical inventory reorder reminder' },
              { id: 'campaign', label: 'Campaign Launch Alert', desc: 'Marketing notification for store' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedVoiceSnippet(item.id as any)}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                  selectedVoiceSnippet === item.id
                    ? 'border-[#0F2D6B] bg-sky-50 text-[#0F2D6B]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                {selectedVoiceSnippet === item.id && (
                  <Check className="w-4 h-4 text-[#0F2D6B]" />
                )}
              </button>
            ))}
          </div>

          {/* Current message preview */}
          <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-700 italic border border-slate-200/80">
            "{audioSnippets[selectedVoiceSnippet][language]}"
          </div>

          {/* Action button */}
          <button
            onClick={handlePlayVoice}
            disabled={isPlaying}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0F2D6B] to-[#00BAF2] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 fill-current ${isPlaying ? 'animate-spin' : ''}`} />
            <span>{isPlaying ? 'Playing Voice Announcement...' : 'Play Audio via Soundbox'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
