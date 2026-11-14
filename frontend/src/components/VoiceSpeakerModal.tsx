import React, { useState } from 'react';
import { Volume2, X, Play, ShieldCheck, Check } from 'lucide-react';
import { Language } from '../types';

type VoiceSnippetId = 'payment' | 'alert' | 'campaign';

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
  const [selectedVoiceSnippet, setSelectedVoiceSnippet] = useState<VoiceSnippetId>('payment');
  const [voiceError, setVoiceError] = useState('');

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
    setVoiceError('');
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setVoiceError(language === 'hi'
        ? 'इस ब्राउज़र में आवाज़ का नमूना उपलब्ध नहीं है।'
        : language === 'te'
          ? 'ఈ బ్రౌజర్‌లో వాయిస్ నమూనా అందుబాటులో లేదు.'
          : 'Voice preview is not available in this browser.');
      return;
    }

    setIsPlaying(true);
    const textToSpeak = audioSnippets[selectedVoiceSnippet][language];
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      setVoiceError(language === 'hi'
        ? 'आवाज़ का नमूना नहीं चला। कृपया फिर कोशिश करें।'
        : language === 'te'
          ? 'వాయిస్ నమూనా ప్లే కాలేదు. మళ్లీ ప్రయత్నించండి.'
          : 'The voice preview could not play. Please try again.');
    };
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002970] to-[#00BAF2] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Volume2 className="w-5 h-5 text-sky-200" />
            </div>
            <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    {language === 'hi' ? 'साउंडबॉक्स की आवाज़ का नमूना' : language === 'te' ? 'సౌండ్‌బాక్స్ వాయిస్ నమూనా' : 'Soundbox voice preview'}
                  </h3>
                  <p className="text-xs font-medium text-sky-100">
                    {language === 'hi' ? 'यह नमूना इसी डिवाइस पर बजेगा। कोई साउंडबॉक्स जुड़ा नहीं है।' : language === 'te' ? 'ఈ నమూనా ఈ పరికరంలో ప్లే అవుతుంది. సౌండ్‌బాక్స్ కనెక్ట్ కాలేదు.' : 'Played on this device. No Soundbox is connected.'}
                  </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Graphic Representation */}
        <div className="p-6 text-center bg-[#F5F8FC] border-b border-[#E4EAF1]">
          <div className="relative mx-auto w-40 h-44 rounded-3xl bg-gradient-to-b from-[#002970] to-[#0A1E42] p-4 text-white shadow-xl flex flex-col justify-between items-center border-4 border-sky-400/40">
            {/* Speaker mesh */}
            <div className="w-full flex flex-col items-center gap-1 mt-2">
              <div className="w-12 h-1 rounded-full bg-sky-400"></div>
              <div className="w-8 h-1 rounded-full bg-sky-300"></div>
              <div className="w-4 h-1 rounded-full bg-sky-200"></div>
            </div>

            {/* Audio Wave animation when playing */}
            {isPlaying ? (
              <div className="flex items-center gap-1.5 h-12">
                <span className="w-1.5 h-6 bg-[#12B76A] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-10 bg-emerald-300 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-12 bg-[#00BAF2] rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-8 bg-sky-300 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-5 bg-[#12B76A] rounded-full animate-bounce"></span>
              </div>
            ) : (
              <div className="text-center">
                <Volume2 className="w-8 h-8 mx-auto text-sky-300/80 mb-1" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-200">
                  {language === 'hi' ? 'नमूना सुनने के लिए तैयार' : language === 'te' ? 'నమూనా వినడానికి సిద్ధం' : 'Ready to preview'}
                </span>
              </div>
            )}

            {/* Device branding */}
            <div className="text-[11px] font-extrabold tracking-wider text-white flex items-center gap-1">
              <span>{language === 'hi' ? 'डेमो' : language === 'te' ? 'డెమో' : 'Demo'}</span>
              <span className="text-[#00BAF2] font-semibold">Soundbox</span>
            </div>
          </div>
        </div>

        {/* Audio Type Options */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold text-[#667085] uppercase tracking-wider">
            {language === 'hi' ? 'आवाज़ का नमूना चुनें' : language === 'te' ? 'వాయిస్ నమూనా ఎంచుకోండి' : 'Choose a voice sample'}
          </div>

          <div className="space-y-2">
            {[
              { id: 'payment' as const, label: 'Payment received (sample)', desc: 'A short payment confirmation' },
              { id: 'alert' as const, label: 'Stock reminder (sample)', desc: 'A reminder to check low stock' },
              { id: 'campaign' as const, label: 'Offer draft (sample)', desc: 'A reminder about a prepared offer' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedVoiceSnippet(item.id);
                  setVoiceError('');
                }}
                className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedVoiceSnippet === item.id
                    ? 'border-[#002970] bg-[#F0F9FF] text-[#002970]'
                    : 'border-[#E4EAF1] hover:border-[#D0D5DD] bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[11px] text-[#667085]">{item.desc}</div>
                </div>
                {selectedVoiceSnippet === item.id && (
                  <Check className="w-4 h-4 text-[#002970]" />
                )}
              </button>
            ))}
          </div>

          {/* Current message preview */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] text-xs text-[#344054] italic border border-[#E4EAF1]">
            "{audioSnippets[selectedVoiceSnippet][language]}"
          </div>
          {voiceError && <p className="rounded-xl border border-[#FECDCA] bg-[#FFF8F7] p-3 text-sm text-[#B42318]" role="alert">{voiceError}</p>}
          <p className="flex items-start gap-2 rounded-xl border border-[#CFE8F5] bg-[#F0FAFF] p-3 text-xs leading-relaxed text-[#475467]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#006B9B]" aria-hidden="true" />
            {language === 'hi' ? 'यह सिर्फ़ ब्राउज़र में आवाज़ का नमूना है, असली पेमेंट घोषणा नहीं।' : language === 'te' ? 'ఇది బ్రౌజర్‌లో వాయిస్ నమూనా మాత్రమే, నిజమైన చెల్లింపు ప్రకటన కాదు.' : 'This is only a browser voice sample, not a real payment announcement.'}
          </p>

          {/* Action button */}
          <button
            onClick={handlePlayVoice}
            disabled={isPlaying}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#002970] to-[#0F3B8C] text-white font-bold text-xs shadow-fintech-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 fill-current ${isPlaying ? 'animate-spin' : ''}`} />
            <span>{isPlaying
              ? (language === 'hi' ? 'इस डिवाइस पर नमूना चल रहा है…' : language === 'te' ? 'ఈ పరికరంలో నమూనా ప్లే అవుతోంది…' : 'Playing preview on this device…')
              : (language === 'hi' ? 'आवाज़ का नमूना सुनें' : language === 'te' ? 'వాయిస్ నమూనా వినండి' : 'Play voice preview')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
