import React from 'react';
import {
  ArrowRight,
  BarChart3,
  MessageCircle,
  Megaphone,
  Package,
  ShieldCheck,
  Sparkles,
  Store
} from 'lucide-react';
import { Language } from '../types';
import { PageHeader } from '../components/PageHeader';

interface BusinessImpactPageProps {
  language: Language;
  onNavigate: (tab: string, context?: { query?: string }) => void;
}

export const BusinessImpactPage: React.FC<BusinessImpactPageProps> = ({ language, onNavigate }) => {
  const copy = language === 'hi'
    ? {
        eyebrow: 'आपकी दुकान के लिए',
        title: 'साथी आपके काम को आसान बनाता है',
        description: 'रिपोर्ट समझने की ज़रूरत नहीं। अपनी दुकान के बारे में पूछें और अगला कदम चुनें।',
        ask: 'साथी से पूछें',
        stepsTitle: 'कैसे मदद मिलती है',
        steps: [
          { title: 'दुकान का हाल समझें', text: 'बिक्री और स्टॉक की ज़रूरी बातें आसान भाषा में देखें।' },
          { title: 'सुझाव पाएँ', text: 'समझें कि किस काम पर पहले ध्यान देना ठीक रहेगा।' },
          { title: 'अपना कदम चुनें', text: 'स्टॉक देखें या ग्राहक के लिए संदेश का ड्राफ्ट बनाएँ।' }
        ],
        trustTitle: 'डेमो में क्या होता है',
        trustText: 'यह नमूना दुकान के डेटा से बना डेमो है, आपके Paytm खाते से जुड़ा नहीं है।',
        trustItems: ['बिक्री और स्टॉक का डेटा नमूना है', 'ऑफ़र सिर्फ़ ड्राफ्ट होते हैं, भेजे नहीं जाते', 'स्टॉक अपडेट से सप्लायर को ऑर्डर नहीं जाता'],
        quickTitle: 'आज क्या जानना चाहेंगे?',
        askSales: 'इस हफ़्ते बिक्री कैसी रही?',
        askStock: 'कौन-सा सामान जल्दी खत्म होगा?',
        askCustomers: 'पुराने ग्राहकों से कैसे जुड़ें?'
      }
    : language === 'te'
      ? {
          eyebrow: 'మీ దుకాణం కోసం',
          title: 'సాథీ మీ పనిని సులభం చేస్తుంది',
          description: 'రిపోర్టులు అర్థం చేసుకోవాల్సిన అవసరం లేదు. మీ దుకాణం గురించి అడిగి తదుపరి అడుగు ఎంచుకోండి.',
          ask: 'సాథీని అడగండి',
          stepsTitle: 'సహాయం ఎలా అందుతుంది',
          steps: [
            { title: 'దుకాణం పరిస్థితి తెలుసుకోండి', text: 'అమ్మకాలు, స్టాక్ గురించి ముఖ్యమైన విషయాలు సులభంగా చూడండి.' },
            { title: 'సూచన పొందండి', text: 'ముందుగా ఏ పనిపై దృష్టి పెట్టాలో తెలుసుకోండి.' },
            { title: 'మీ తదుపరి అడుగు ఎంచుకోండి', text: 'స్టాక్ చూడండి లేదా కస్టమర్ సందేశం డ్రాఫ్ట్ చేయండి.' }
          ],
          trustTitle: 'డెమోలో ఏముంటుంది',
          trustText: 'ఇది నమూనా దుకాణం డేటాతో చేసిన డెమో. మీ Paytm ఖాతాకు కనెక్ట్ కాలేదు.',
          trustItems: ['అమ్మకాలు, స్టాక్ వివరాలు నమూనావి', 'ఆఫర్లు డ్రాఫ్ట్ మాత్రమే, పంపబడవు', 'స్టాక్ అప్‌డేట్‌తో సరఫరాదారునికి ఆర్డర్ వెళ్లదు'],
          quickTitle: 'ఈ రోజు ఏమి తెలుసుకోవాలనుకుంటున్నారు?',
          askSales: 'ఈ వారం అమ్మకాలు ఎలా ఉన్నాయి?',
          askStock: 'ఏ వస్తువులు త్వరలో అయిపోతాయి?',
          askCustomers: 'పాత కస్టమర్లతో ఎలా మళ్లీ మాట్లాడాలి?'
        }
      : {
          eyebrow: 'Made for your shop',
          title: 'A helpful partner for your shop',
          description: 'Skip the complicated reports. Ask about your shop and get a clear next step you can choose to take.',
          ask: 'Ask Saathi',
          stepsTitle: 'A simpler way to run the day',
          steps: [
            { title: 'See what is happening', text: 'Get the important bits about sales, stock, and regular shoppers.' },
            { title: 'Get a useful suggestion', text: 'Understand what may need your attention first and why.' },
            { title: 'Choose what to do next', text: 'Check stock or prepare a customer message draft.' }
          ],
          trustTitle: 'Clear about this demo',
          trustText: 'This prototype uses sample shop data and is not connected to your Paytm merchant account.',
          trustItems: ['Sales and stock details are sample data', 'Offers are saved as drafts and are never sent', 'Stock updates change sample data only—no supplier order is placed'],
          quickTitle: 'What would you like to ask today?',
          askSales: 'How did my sales do this week?',
          askStock: 'What might run out soon?',
          askCustomers: 'How can I reconnect with regulars?'
        };

  const actions = [
    { query: copy.askSales, icon: BarChart3, style: 'bg-[#EAF8FF] text-[#006B9B]' },
    { query: copy.askStock, icon: Package, style: 'bg-[#FFF3DB] text-[#A15C00]' },
    { query: copy.askCustomers, icon: Megaphone, style: 'bg-[#E7F8EF] text-[#027A48]' }
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-3">
      <PageHeader
        eyebrow={copy.eyebrow}
        icon={Store}
        title={copy.title}
        description={copy.description}
        action={
          <button
            type="button"
            onClick={() => onNavigate('copilot')}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#002970] px-4 text-sm font-bold text-white shadow-[0_8px_18px_-12px_rgba(0,41,112,0.65)] transition-all hover:-translate-y-0.5 hover:bg-[#0F3B8C]"
          >
            <MessageCircle className="h-4 w-4 text-[#80E5FF]" aria-hidden="true" />
            {copy.ask}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        }
      />

      <section className="rounded-[26px] border border-[#E4EAF1] bg-white p-5 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF8FF] text-[#006B9B]">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-base font-extrabold text-[#10243A]">{copy.stepsTitle}</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {copy.steps.map((step, index) => (
            <article key={step.title} className="relative overflow-hidden rounded-[22px] border border-[#E2EDF3] bg-gradient-to-br from-white to-[#F5FBFE] p-5">
              <span className="absolute -right-4 -top-5 text-6xl font-black text-[#EAF5FA]" aria-hidden="true">0{index + 1}</span>
              <div className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-[#007EAE] shadow-sm ring-1 ring-[#D8ECF8]">{index + 1}</span>
                <h3 className="mt-4 text-sm font-extrabold text-[#10243A]">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#475467]">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#002970] via-[#06458F] to-[#008FC2] p-5 text-white shadow-[0_18px_38px_-24px_rgba(0,41,112,0.7)] sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full border-[20px] border-white/10" aria-hidden="true" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <ShieldCheck className="h-5 w-5 text-[#B9F0FF]" aria-hidden="true" />
          </span>
          <div className="max-w-3xl">
            <h2 className="text-lg font-extrabold">{copy.trustTitle}</h2>
            <p className="mt-1 text-sm leading-relaxed text-sky-100">{copy.trustText}</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-white sm:grid-cols-3">
              {copy.trustItems.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-xl bg-white/10 p-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9AF0CC]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#E4EAF1] bg-white p-5 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] sm:p-6">
        <h2 className="text-base font-extrabold text-[#10243A]">{copy.quickTitle}</h2>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.query}
                type="button"
                onClick={() => onNavigate('copilot', { query: action.query })}
                className="group flex min-h-16 items-center gap-3 rounded-2xl border border-[#E4EAF1] bg-white p-3 text-left transition-all hover:border-[#B9E6FE] hover:bg-[#F8FCFE]"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.style}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-[#344054]">{action.query}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#98A2B3] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
