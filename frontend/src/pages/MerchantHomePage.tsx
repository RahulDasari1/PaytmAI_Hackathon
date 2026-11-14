import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  MessageCircle,
  Megaphone,
  Pause,
  Package,
  Play,
  ShoppingBag,
  Store,
  Sparkles,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { getT } from '../i18n';
import { api } from '../services/api';
import { DashboardSummary, InventoryItem, Language, RecommendationItem } from '../types';

interface MerchantHomePageProps {
  language: Language;
  onNavigate: (tab: string, context?: any) => void;
}

const recommendationText: Record<string, Record<Language, { title: string; detail: string; action: string }>> = {
  REC_001: {
    en: { title: 'Bring back evening shoppers', detail: 'Evening sales were quieter last week. Try a simple tea and biscuits offer.', action: 'Make an offer' },
    hi: { title: 'शाम के ग्राहकों को वापस बुलाएँ', detail: 'पिछले हफ़्ते शाम की बिक्री कम रही। चाय और बिस्कुट का छोटा ऑफ़र आज़माएँ।', action: 'ऑफ़र बनाएँ' },
    te: { title: 'సాయంత్రం వచ్చే కస్టమర్లను తిరిగి రప్పించండి', detail: 'గత వారం సాయంత్రం అమ్మకాలు తగ్గాయి. టీ, బిస్కెట్లపై చిన్న ఆఫర్ ప్రయత్నించండి.', action: 'ఆఫర్ చేయండి' }
  },
  REC_002: {
    en: { title: 'Reconnect with regular customers', detail: 'Some regulars have not visited recently. A friendly message may bring them back.', action: 'Make an offer' },
    hi: { title: 'पुराने ग्राहकों से फिर जुड़ें', detail: 'कुछ नियमित ग्राहक कई दिनों से नहीं आए। एक अपनापन भरा संदेश उन्हें वापस ला सकता है।', action: 'ऑफ़र बनाएँ' },
    te: { title: 'పాత కస్టమర్లతో మళ్లీ మాట్లాడండి', detail: 'కొంతమంది రెగ్యులర్ కస్టమర్లు ఈ మధ్య రాలేదు. ఒక మంచి సందేశం వారిని తిరిగి రప్పించవచ్చు.', action: 'ఆఫర్ చేయండి' }
  },
  REC_003: {
    en: { title: 'Check items running low', detail: 'A few popular items may run out soon. Check what needs restocking.', action: 'Check stock' },
    hi: { title: 'कम होते सामान पर ध्यान दें', detail: 'कुछ ज़रूरी सामान जल्द खत्म हो सकता है। देखें कि क्या मंगाना है।', action: 'स्टॉक देखें' },
    te: { title: 'తగ్గుతున్న సరుకును చూడండి', detail: 'కొన్ని ముఖ్యమైన వస్తువులు త్వరలో అయిపోవచ్చు. ఏవి తెప్పించాలో చూడండి.', action: 'స్టాక్ చూడండి' }
  }
};

const pageCopy: Record<Language, {
  greeting: string;
  intro: string;
  thisWeek: string;
  compared: string;
  bills: string;
  nextSteps: string;
  quickActions: string;
  carouselHeading: string;
  carouselLabel: string;
  slideLabel: string;
  previous: string;
  next: string;
  pause: string;
  play: string;
  promos: { title: string; detail: string; action: string }[];
  ask: string;
  askHint: string;
  stockSoon: string;
  noStock: string;
  noSuggestions: string;
  retry: string;
  loadError: string;
}> = {
  en: {
    greeting: 'Namaste, Sharma ji',
    intro: 'Here are the important things for your shop today.',
    thisWeek: 'Your sales this week',
    compared: 'compared with last week',
    bills: 'bills this week',
    nextSteps: 'A few helpful next steps',
    quickActions: 'Go to',
    carouselHeading: 'A little help for your shop',
    carouselLabel: 'Helpful shop ideas',
    slideLabel: 'Slide',
    previous: 'Previous idea',
    next: 'Next idea',
    pause: 'Pause ideas',
    play: 'Play ideas',
    promos: [
      { title: 'Make sense of your sales', detail: 'Ask Saathi what changed this week and what you could try next.', action: 'Ask Saathi' },
      { title: 'See what may run out soon', detail: 'Check the items that need your attention first.', action: 'Check stock' },
      { title: 'Stay in touch with regulars', detail: 'Prepare a friendly offer in their language. Nothing will be sent.', action: 'Create offer' }
    ],
    ask: 'Ask Saathi',
    askHint: 'Type a question or speak in your language',
    stockSoon: 'Running low',
    noStock: 'Your stock looks fine for now.',
    noSuggestions: 'Nothing needs your attention right now.',
    retry: 'Try again',
    loadError: 'We could not load your shop update. Please try again.'
  },
  hi: {
    greeting: 'नमस्ते, शर्मा जी',
    intro: 'आज आपकी दुकान के लिए कुछ ज़रूरी बातें।',
    thisWeek: 'इस हफ़्ते की बिक्री',
    compared: 'पिछले हफ़्ते के मुकाबले',
    bills: 'बिल इस हफ़्ते',
    nextSteps: 'आपके लिए कुछ आसान सुझाव',
    quickActions: 'यहाँ जाएँ',
    carouselHeading: 'आपकी दुकान के लिए मदद',
    carouselLabel: 'दुकान के लिए सुझाव',
    slideLabel: 'सुझाव',
    previous: 'पिछला सुझाव',
    next: 'अगला सुझाव',
    pause: 'सुझाव रोकें',
    play: 'सुझाव चलाएँ',
    promos: [
      { title: 'बिक्री को समझें', detail: 'साथी से पूछें कि इस हफ़्ते क्या बदला और आगे क्या करें।', action: 'साथी से पूछें' },
      { title: 'कम होते स्टॉक को देखें', detail: 'पहले उन सामानों को देखें जिन पर ध्यान देना ज़रूरी है।', action: 'स्टॉक देखें' },
      { title: 'पुराने ग्राहकों से जुड़ें', detail: 'उनकी भाषा में ऑफ़र का संदेश बनाएँ। यह भेजा नहीं जाएगा।', action: 'ऑफ़र बनाएँ' }
    ],
    ask: 'साथी से पूछें',
    askHint: 'अपनी भाषा में लिखें या बोलें',
    stockSoon: 'स्टॉक कम है',
    noStock: 'अभी आपका स्टॉक ठीक है।',
    noSuggestions: 'अभी किसी काम पर ध्यान देने की ज़रूरत नहीं है।',
    retry: 'फिर कोशिश करें',
    loadError: 'दुकान की जानकारी नहीं आ पाई। कृपया फिर कोशिश करें।'
  },
  te: {
    greeting: 'నమస్కారం, శర్మ గారు',
    intro: 'ఈ రోజు మీ దుకాణం కోసం కొన్ని ముఖ్యమైన విషయాలు.',
    thisWeek: 'ఈ వారం అమ్మకాలు',
    compared: 'గత వారంతో పోలిస్తే',
    bills: 'ఈ వారం బిల్లులు',
    nextSteps: 'మీకు ఉపయోగపడే కొన్ని సూచనలు',
    quickActions: 'వెళ్లండి',
    carouselHeading: 'మీ దుకాణానికి చిన్న సహాయం',
    carouselLabel: 'దుకాణం కోసం సూచనలు',
    slideLabel: 'సూచన',
    previous: 'మునుపటి సూచన',
    next: 'తదుపరి సూచన',
    pause: 'సూచనలను ఆపండి',
    play: 'సూచనలను నడపండి',
    promos: [
      { title: 'మీ అమ్మకాలను అర్థం చేసుకోండి', detail: 'ఈ వారం ఏమి మారిందో, తర్వాత ఏమి ప్రయత్నించాలో సాథీని అడగండి.', action: 'సాథీని అడగండి' },
      { title: 'త్వరలో అయిపోయే స్టాక్ చూడండి', detail: 'ముందుగా శ్రద్ధ పెట్టాల్సిన వస్తువులను చూడండి.', action: 'స్టాక్ చూడండి' },
      { title: 'పాత కస్టమర్లతో మళ్లీ మాట్లాడండి', detail: 'వారి భాషలో ఆఫర్ సందేశం తయారు చేయండి. ఇది పంపబడదు.', action: 'ఆఫర్ చేయండి' }
    ],
    ask: 'సాథీని అడగండి',
    askHint: 'మీ భాషలో టైప్ చేయండి లేదా మాట్లాడండి',
    stockSoon: 'స్టాక్ తగ్గుతోంది',
    noStock: 'ప్రస్తుతానికి మీ స్టాక్ బాగానే ఉంది.',
    noSuggestions: 'ప్రస్తుతానికి మీ దృష్టి అవసరమైన పనులేవీ లేవు.',
    retry: 'మళ్లీ ప్రయత్నించండి',
    loadError: 'మీ దుకాణం సమాచారం లోడ్ కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.'
  }
};

const fetchShopUpdate = () => Promise.all([
  api.getSummary('7d'),
  api.getRecommendations(),
  api.getInventory('CRITICAL')
]);

export const MerchantHomePage: React.FC<MerchantHomePageProps> = ({ language, onNavigate }) => {
  const t = getT(language);
  const copy = pageCopy[language];
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [carouselHovered, setCarouselHovered] = useState(false);
  const [carouselFocused, setCarouselFocused] = useState(false);
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const loadShopUpdate = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [summaryData, recommendationData, inventoryData] = await fetchShopUpdate();
      setSummary(summaryData);
      setRecommendations(recommendationData);
      setLowStock(inventoryData);
    } catch (loadError) {
      console.error('Failed to load merchant home:', loadError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadInitialUpdate = async () => {
      try {
        const [summaryData, recommendationData, inventoryData] = await fetchShopUpdate();
        if (!active) return;
        setSummary(summaryData);
        setRecommendations(recommendationData);
        setLowStock(inventoryData);
      } catch (loadError) {
        console.error('Failed to load merchant home:', loadError);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadInitialUpdate();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (carouselPaused || carouselHovered || carouselFocused || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setCarouselIndex((index) => (index + 1) % copy.promos.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [carouselPaused, carouselHovered, carouselFocused, prefersReducedMotion, copy.promos.length]);

  const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);

  const salesChange = summary?.growth.sales_pct ?? 0;
  const actions = recommendations
    .filter((recommendation) => recommendation.id !== 'REC_003' || lowStock.length > 0)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-3">
      <header className="px-1 pt-1">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-[#027A48]">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DDF8EB] text-[#027A48]" aria-hidden="true">
            <Store className="h-4 w-4" />
          </span>
          {copy.greeting}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#10243A] sm:text-3xl">
          {copy.intro}
        </h1>
      </header>

      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#002970] via-[#063D8C] to-[#007FAE] p-5 text-white shadow-[0_20px_40px_-24px_rgba(0,41,112,0.65)] sm:p-7" aria-labelledby="weekly-sales">
        <div className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full border-[22px] border-white/5 bg-[#00BAF2]/15" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-[#00BAF2]/10 blur-2xl" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p id="weekly-sales" className="text-sm font-semibold text-sky-100">{copy.thisWeek}</p>
            {loading ? (
              <div className="mt-2 h-10 w-40 animate-pulse rounded-lg bg-white/20" />
            ) : (
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-white tabular-nums">
                {summary ? formatINR(summary.total_sales) : '—'}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#475467]">
              {summary ? (
                <>
                  {salesChange < 0
                    ? <TrendingDown className="h-4 w-4 text-rose-200" aria-hidden="true" />
                    : <TrendingUp className="h-4 w-4 text-emerald-200" aria-hidden="true" />}
                  <span className="font-bold text-white">
                    {Math.abs(salesChange)}%
                  </span>
                  <span className="text-sky-100">{copy.compared}</span>
                </>
              ) : (
                <span className="text-sky-100">{copy.loadError}</span>
              )}
            </div>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#7DE3FF]">
            <IndianRupee className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
        {summary && (
          <div className="relative mt-5 border-t border-white/15 pt-4 text-sm text-sky-100">
            <span className="font-bold text-white">{summary.transaction_count}</span> {copy.bills}
          </div>
        )}
      </section>

      <button
        onClick={() => onNavigate('copilot')}
        className="group relative flex min-h-[82px] w-full items-center justify-between gap-4 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#002970] via-[#06458F] to-[#008FC2] px-5 py-4 text-left text-white shadow-[0_14px_30px_-20px_rgba(0,41,112,0.72)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-20px_rgba(0,41,112,0.68)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2]"
      >
        <span className="pointer-events-none absolute -right-7 -top-10 h-28 w-28 rounded-full border-[14px] border-white/10" aria-hidden="true" />
        <span className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/15">
            <MessageCircle className="h-5 w-5 text-[#B9F0FF]" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold">{copy.ask}</span>
            <span className="mt-0.5 block text-sm text-sky-100">{copy.askHint}</span>
          </span>
        </span>
        <ArrowRight className="relative h-5 w-5 shrink-0 text-sky-200 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </button>

      <section aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="mb-3 px-1 text-base font-extrabold text-[#10243A]">{copy.quickActions}</h2>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {[
            { id: 'inventory', label: t.navInventory, icon: Package, highlight: lowStock.length > 0, iconStyle: 'bg-[#FFF3DB] text-[#A15C00]' },
            { id: 'campaigns', label: t.navCampaigns, icon: Megaphone, highlight: false, iconStyle: 'bg-[#E8F7FF] text-[#006B9B]' },
            { id: 'sales', label: t.navSales, icon: ShoppingBag, highlight: false, iconStyle: 'bg-[#E7F8EF] text-[#027A48]' }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onNavigate(action.id)}
                className="group relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-[22px] border border-[#E4EAF1] bg-gradient-to-br from-white to-[#F6FBFE] px-2 py-3 text-center text-sm font-bold text-[#344054] shadow-[0_8px_24px_-22px_rgba(16,36,58,0.7)] transition-all hover:-translate-y-0.5 hover:border-[#B9E6FE] hover:shadow-[0_14px_26px_-20px_rgba(0,41,112,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2]"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${action.iconStyle}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="leading-tight">{action.label}</span>
                <ArrowRight className="absolute right-2 top-2 h-3.5 w-3.5 text-[#98A2B3] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                {action.highlight && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#F04438]" aria-label={copy.stockSoon} />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="shop-ideas-title">
        <h2 id="shop-ideas-title" className="mb-3 px-1 text-base font-extrabold text-[#10243A]">{copy.carouselHeading}</h2>
        <div
          className="relative min-h-48 overflow-hidden rounded-[28px] border border-[#D1E9FF] bg-gradient-to-br from-[#EAF8FF] via-white to-[#F0F9FF] shadow-[0_12px_30px_-26px_rgba(0,41,112,0.55)]"
          role="region"
          aria-roledescription="carousel"
          aria-label={copy.carouselLabel}
          onMouseEnter={() => setCarouselHovered(true)}
          onMouseLeave={() => setCarouselHovered(false)}
          onFocusCapture={() => setCarouselFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setCarouselFocused(false);
          }}
        >
          {copy.promos.map((promo, index) => {
            if (index !== carouselIndex) return null;
            const image = ['/merchant-carousel-sales.svg', '/merchant-carousel-stock.svg', '/merchant-carousel-offer.svg'][index];
            const target = ['copilot', 'inventory', 'campaigns'][index];
            return (
              <div
                key={promo.title}
                className="relative flex min-h-48 items-center"
                role="group"
                aria-roledescription="slide"
                aria-label={`${copy.slideLabel} ${index + 1}/${copy.promos.length}`}
              >
                <img src={image} alt="" aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-full w-[47%] object-contain object-right-bottom sm:w-[42%]" />
                <div className="relative z-10 max-w-[68%] p-4 sm:max-w-[58%] sm:p-6">
                  <h3 className="text-base font-extrabold leading-snug text-[#10243A] sm:text-lg">{promo.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#475467]">{promo.detail}</p>
                  <button
                    type="button"
                    onClick={() => onNavigate(target)}
                    className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#002970] px-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0F3B8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2]"
                  >
                    {promo.action}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
          <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 rounded-full bg-white/90 p-1 shadow-fintech-xs sm:bottom-3 sm:right-3">
            <button type="button" onClick={() => setCarouselIndex((carouselIndex + copy.promos.length - 1) % copy.promos.length)} aria-label={copy.previous} className="flex h-8 w-8 items-center justify-center rounded-full text-[#002970] hover:bg-[#EBF7FF]">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="min-w-10 text-center text-xs font-semibold tabular-nums text-[#475467]">{carouselIndex + 1}/{copy.promos.length}</span>
            <button type="button" onClick={() => setCarouselIndex((carouselIndex + 1) % copy.promos.length)} aria-label={copy.next} className="flex h-8 w-8 items-center justify-center rounded-full text-[#002970] hover:bg-[#EBF7FF]">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            {!prefersReducedMotion && (
              <button type="button" onClick={() => setCarouselPaused((paused) => !paused)} aria-label={carouselPaused ? copy.play : copy.pause} className="flex h-8 w-8 items-center justify-center rounded-full text-[#002970] hover:bg-[#EBF7FF]">
                {carouselPaused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="next-steps">
        <div className="mb-3 flex items-center gap-2 px-1">
          <Sparkles className="h-5 w-5 text-[#F79009]" aria-hidden="true" />
          <h2 id="next-steps" className="text-lg font-extrabold text-[#10243A]">{copy.nextSteps}</h2>
        </div>

        {error ? (
          <div className="rounded-2xl border border-[#FECDCA] bg-white p-5 text-sm text-[#B42318]" role="alert">
            <p>{copy.loadError}</p>
            <button onClick={() => loadShopUpdate()} className="mt-3 rounded-lg bg-[#FEF3F2] px-4 py-2 font-bold">
              {copy.retry}
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3" aria-label="Loading shop suggestions">
            <div className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-[#E4EAF1]" />
            <div className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-[#E4EAF1]" />
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map((recommendation) => {
              const text = recommendationText[recommendation.id]?.[language];
              const isStock = recommendation.id === 'REC_003';
              const item = lowStock[0];
              return (
                <article key={recommendation.id} className="relative overflow-hidden rounded-[24px] border border-[#E4EAF1] bg-white p-5 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] transition-all hover:border-[#D1E9FF] hover:shadow-[0_16px_34px_-24px_rgba(0,41,112,0.4)] sm:p-6">
                  <div className={`absolute inset-y-0 left-0 w-1 ${isStock ? 'bg-[#F79009]' : 'bg-[#00A8E0]'}`} aria-hidden="true" />
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isStock ? 'bg-[#FFF9EB] text-[#B54708]' : 'bg-[#F0F9FF] text-[#002970]'}`}>
                      {isStock ? <Package className="h-5 w-5" aria-hidden="true" /> : <Sparkles className="h-5 w-5" aria-hidden="true" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-[#10243A]">{text?.title ?? recommendation.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#475467]">{text?.detail ?? recommendation.insight}</p>
                      {isStock && item && (
                        <p className="mt-2 text-sm font-semibold text-[#B54708]">
                          {copy.stockSoon}: {item.name} · {item.estimated_days_remaining} {language === 'hi' ? 'दिन' : language === 'te' ? 'రోజులు' : 'days'}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => isStock
                      ? onNavigate('inventory')
                      : onNavigate('campaigns', { objective: recommendation.id === 'REC_002' ? 'WIN_BACK_INACTIVE' : 'EVENING_FOOTFALL_BOOST' })}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#EBF7FF] px-4 py-2 text-sm font-bold text-[#002970] transition-colors hover:bg-[#D1E9FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2]"
                  >
                    {text?.action ?? (isStock ? t.reorderStock : t.draftCampaign)}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </article>
              );
            })}
            {actions.length === 0 && (
              <div className="flex items-center gap-3 rounded-2xl bg-white p-5 text-sm text-[#475467] ring-1 ring-[#E4EAF1]">
                <CheckCircle2 className="h-5 w-5 text-[#027A48]" aria-hidden="true" />
                {copy.noSuggestions}
              </div>
            )}
            {lowStock.length === 0 && !actions.some((recommendation) => recommendation.id === 'REC_003') && (
              <div className="flex items-center gap-3 rounded-2xl bg-white p-5 text-sm text-[#475467] ring-1 ring-[#E4EAF1]">
                <Package className="h-5 w-5 text-[#027A48]" aria-hidden="true" />
                {copy.noStock}
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
};
