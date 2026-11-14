import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  MessageCircle,
  Package,
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
        <p className="text-sm font-bold text-[#027A48]">{copy.greeting}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#10243A] sm:text-3xl">
          {copy.intro}
        </h1>
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-fintech-xs ring-1 ring-[#E4EAF1] sm:p-7" aria-labelledby="weekly-sales">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p id="weekly-sales" className="text-sm font-semibold text-[#667085]">{copy.thisWeek}</p>
            {loading ? (
              <div className="mt-2 h-10 w-40 animate-pulse rounded-lg bg-[#F2F4F7]" />
            ) : (
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-[#10243A] tabular-nums">
                {summary ? formatINR(summary.total_sales) : '—'}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#475467]">
              {summary ? (
                <>
                  {salesChange < 0
                    ? <TrendingDown className="h-4 w-4 text-[#B42318]" aria-hidden="true" />
                    : <TrendingUp className="h-4 w-4 text-[#027A48]" aria-hidden="true" />}
                  <span className={salesChange < 0 ? 'font-bold text-[#B42318]' : 'font-bold text-[#027A48]'}>
                    {Math.abs(salesChange)}%
                  </span>
                  <span>{copy.compared}</span>
                </>
              ) : (
                <span>{copy.loadError}</span>
              )}
            </div>
          </div>
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EBF7FF] text-[#002970] sm:flex">
            <IndianRupee className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
        {summary && (
          <div className="mt-5 border-t border-[#E4EAF1] pt-4 text-sm text-[#475467]">
            <span className="font-bold text-[#10243A]">{summary.transaction_count}</span> {copy.bills}
          </div>
        )}
      </section>

      <button
        onClick={() => onNavigate('copilot')}
        className="flex min-h-[76px] w-full items-center justify-between gap-4 rounded-2xl bg-[#002970] px-5 py-4 text-left text-white shadow-fintech-sm transition-colors hover:bg-[#0F3B8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2]"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold">{copy.ask}</span>
            <span className="mt-0.5 block text-sm text-sky-100">{copy.askHint}</span>
          </span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 text-sky-200" aria-hidden="true" />
      </button>

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
                <article key={recommendation.id} className="rounded-2xl bg-white p-5 shadow-fintech-xs ring-1 ring-[#E4EAF1] sm:p-6">
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
