import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Language, ProductPerformanceItem } from '../types';
import { getT } from '../i18n';
import { api, API_BASE } from '../services/api';
import { PageHeader } from '../components/PageHeader';

interface SalesAnalyticsPageProps {
  language: Language;
}

export const SalesAnalyticsPage: React.FC<SalesAnalyticsPageProps> = ({ language }) => {
  const t = getT(language);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [products, setProducts] = useState<ProductPerformanceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    setLoading(true);
    try {
      const [prodRes, hourlyRes, compareRes] = await Promise.all([
        api.getProducts('7d', 10),
        fetch(`${API_BASE}/sales/hourly?range_key=7d`).then(r => r.json()),
        fetch(`${API_BASE}/sales/compare`).then(r => r.json())
      ]);

      setHourlyData(hourlyRes.hourly_data || []);
      setComparison(compareRes);
      setProducts(prodRes);
    } catch (err) {
      console.error('Failed to load sales analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const timePeriods = [
    {
      startHour: 7,
      endHour: 11,
      label: language === 'hi' ? 'सुबह' : language === 'te' ? 'ఉదయం' : 'Morning',
      range: language === 'hi' ? 'सुबह 7–11 बजे' : language === 'te' ? 'ఉదయం 7–11' : '7–11 AM'
    },
    {
      startHour: 12,
      endHour: 16,
      label: language === 'hi' ? 'दोपहर' : language === 'te' ? 'మధ్యాహ్నం' : 'Afternoon',
      range: language === 'hi' ? 'दोपहर 12–4 बजे' : language === 'te' ? 'మధ్యాహ్నం 12–4' : '12–4 PM'
    },
    {
      startHour: 17,
      endHour: 22,
      label: language === 'hi' ? 'शाम' : language === 'te' ? 'సాయంత్రం' : 'Evening',
      range: language === 'hi' ? 'शाम 5–10 बजे' : language === 'te' ? 'సాయంత్రం 5–10' : '5–10 PM'
    }
  ].map((period) => ({
    ...period,
    transactions: hourlyData
      .filter((hour) => hour.hour >= period.startHour && hour.hour <= period.endHour)
      .reduce((total, hour) => total + hour.transactions, 0)
  }));
  const busiestPeriod = timePeriods
    .filter((period) => period.transactions > 0)
    .sort((a, b) => b.transactions - a.transactions)[0];
  const maxPeriodTransactions = Math.max(...timePeriods.map((period) => period.transactions), 1);

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-3" aria-busy={loading}>
      <PageHeader
        eyebrow={language === 'hi' ? 'बिक्री का हाल' : language === 'te' ? 'అమ్మకాల వివరాలు' : 'Your sales at a glance'}
        icon={TrendingUp}
        title={t.navSales}
        description={language === 'hi'
          ? 'पिछले हफ़्ते से तुलना करें और देखें कि कौन-सा सामान ज़्यादा बिक रहा है।'
          : language === 'te'
            ? 'గత వారంతో పోల్చి, ఏ వస్తువులు ఎక్కువగా అమ్ముడవుతున్నాయో చూడండి.'
            : 'Compare this week with last week and see what is selling well.'}
        action={
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#CBE8F6] bg-white/80 px-3.5 text-xs font-bold text-[#17456A] shadow-sm">
            <Calendar className="h-4 w-4 text-[#0087BD]" aria-hidden="true" />
            {language === 'hi' ? 'पिछले 7 दिन' : language === 'te' ? 'గత 7 రోజులు' : 'Last 7 days'}
          </span>
        }
      />

      {/* Week-to-week comparison */}
      {comparison && (
        <section className="relative overflow-hidden rounded-[26px] border border-[#CFE8F5] bg-gradient-to-br from-white via-white to-[#EAF8FF] p-5 shadow-[0_12px_30px_-24px_rgba(0,41,112,0.5)] sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[#00BAF2]/10" aria-hidden="true" />
          <div className="relative mb-4 flex flex-col gap-3 border-b border-[#E4EAF1] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E3F6FF] text-[#007EAE]">
                {comparison.sales_growth_pct < 0
                  ? <TrendingDown className="h-5 w-5" aria-hidden="true" />
                  : <TrendingUp className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div>
                <h2 className="text-base font-extrabold text-[#10243A]">
                  {language === 'hi' ? 'पिछले हफ़्ते से बिक्री की तुलना' : language === 'te' ? 'గత వారంతో అమ్మకాల పోలిక' : 'How did sales change?'}
                </h2>
                <p className="text-xs text-[#667085]">{language === 'hi' ? 'इस हफ़्ते और पिछले हफ़्ते का हिसाब' : language === 'te' ? 'ఈ వారం, గత వారం లెక్కలు' : 'This week compared with the week before'}</p>
              </div>
            </div>
            <div className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold tabular-nums ${
              comparison.sales_growth_pct < 0
                ? 'bg-[#FEF3F2] text-[#B42318]'
                : 'bg-[#ECFDF3] text-[#027A48]'
            }`}>
              {comparison.sales_growth_pct < 0
                ? <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                : <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
              {comparison.sales_growth_pct > 0 ? '+' : ''}{comparison.sales_growth_pct}%
              <span className="text-xs font-semibold">{language === 'hi' ? 'बदलाव' : language === 'te' ? 'మార్పు' : 'change'}</span>
            </div>
          </div>

          <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#D5EDF8] bg-white/85 p-4">
              <div className="text-xs font-semibold text-[#667085]">{language === 'hi' ? 'इस हफ़्ते' : language === 'te' ? 'ఈ వారం' : 'This week'}</div>
              <div className="mt-1 text-2xl font-extrabold text-[#002970] tabular-nums">{formatINR(comparison.period1.sales)}</div>
              <div className="mt-1 text-xs text-[#667085]">{comparison.period1.transactions} {language === 'hi' ? 'बिल' : language === 'te' ? 'బిల్లులు' : 'bills'}</div>
            </div>

            <div className="rounded-2xl border border-[#E4EAF1] bg-[#F8FAFC] p-4">
              <div className="text-xs font-semibold text-[#667085]">{language === 'hi' ? 'पिछला हफ़्ता' : language === 'te' ? 'గత వారం' : 'Last week'}</div>
              <div className="mt-1 text-2xl font-extrabold text-[#10243A] tabular-nums">{formatINR(comparison.period2.sales)}</div>
              <div className="mt-1 text-xs text-[#667085]">{comparison.period2.transactions} {language === 'hi' ? 'बिल' : language === 'te' ? 'బిల్లులు' : 'bills'}</div>
            </div>

            <div className={`rounded-2xl border p-4 ${comparison.sales_difference < 0 ? 'border-[#FECDCA] bg-[#FFF8F7]' : 'border-[#A6F4C5] bg-[#F4FCF7]'}`}>
              <div className="text-xs font-semibold text-[#667085]">{language === 'hi' ? 'फ़र्क' : language === 'te' ? 'తేడా' : 'Difference'}</div>
              <div className={`mt-1 text-2xl font-extrabold tabular-nums ${comparison.sales_difference < 0 ? 'text-[#B42318]' : 'text-[#027A48]'}`}>
                {comparison.sales_difference < 0 ? '−' : '+'}{formatINR(Math.abs(comparison.sales_difference))}
              </div>
              <div className="mt-1 text-xs text-[#667085]">{language === 'hi' ? 'कुल बिक्री का अंतर' : language === 'te' ? 'మొత్తం అమ్మకాల తేడా' : 'Total sales difference'}</div>
            </div>
          </div>

          {comparison.category_changes?.length > 0 && (
            <div className="relative mt-5">
              <h3 className="mb-2 text-sm font-bold text-[#344054]">
                {language === 'hi' ? 'किस सामान में सबसे ज़्यादा बदलाव हुआ?' : language === 'te' ? 'ఏ వస్తువులలో ఎక్కువ మార్పు వచ్చింది?' : 'Which items changed the most?'}
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {comparison.category_changes.slice(0, 4).map((category: any) => (
                  <div key={category.category} className="flex items-center justify-between gap-2 rounded-xl border border-[#E4EAF1] bg-white/80 px-3 py-2.5">
                    <span className="min-w-0 truncate text-xs font-semibold text-[#344054]">{category.category}</span>
                    <span className={`shrink-0 text-xs font-extrabold tabular-nums ${category.diff_amount < 0 ? 'text-[#B42318]' : 'text-[#027A48]'}`}>
                      {category.diff_amount < 0 ? '−' : '+'}{formatINR(Math.abs(category.diff_amount))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Busy times */}
      <section className="rounded-[26px] border border-[#E4EAF1] bg-white p-5 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#10243A]">
              {language === 'hi' ? 'आपकी दुकान के व्यस्त घंटे' : language === 'te' ? 'మీ దుకాణం రద్దీ సమయాలు' : 'When do customers visit?'}
            </h2>
            <p className="text-sm text-[#667085]">
              {language === 'hi' ? 'दिन के किस समय ज़्यादा बिल बनते हैं।' : language === 'te' ? 'రోజులో ఏ సమయంలో ఎక్కువ బిల్లులు వస్తాయో.' : 'See when more bills are made during the day.'}
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#EAF8FF] px-3 py-2 text-xs font-bold text-[#005A83]">
            <span className="h-2 w-2 rounded-full bg-[#00A8E0]" />
            {busiestPeriod
              ? `${language === 'hi' ? 'सबसे ज़्यादा बिल' : language === 'te' ? 'ఎక్కువ బిల్లులు' : 'Most bills'}: ${busiestPeriod.label}`
              : language === 'hi' ? 'अभी बिक्री की जानकारी नहीं है' : language === 'te' ? 'ప్రస్తుతం అమ్మకాల వివరాలు లేవు' : 'No sales data yet'}
          </div>
        </div>

        {busiestPeriod ? (
          <div className="grid gap-4" aria-label="Bills by time of day">
            {timePeriods.map((period) => (
              <div key={period.startHour}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#344054]">{period.label}</p>
                    <p className="text-xs text-[#667085]">{period.range}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold tabular-nums text-[#10243A]">
                    {period.transactions} {language === 'hi' ? 'बिल' : language === 'te' ? 'బిల్లులు' : 'bills'}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EDF3F7]" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-[#00A8E0]"
                    style={{ width: `${(period.transactions / maxPeriodTransactions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-[#F8FAFC] p-4 text-sm text-[#667085]">
            {language === 'hi' ? 'अभी इस हफ़्ते के बिल उपलब्ध नहीं हैं।' : language === 'te' ? 'ఈ వారం బిల్లులు ఇంకా అందుబాటులో లేవు.' : 'Bills from this week will appear here.'}
          </p>
        )}
      </section>

      <section className="rounded-[26px] border border-[#E4EAF1] bg-white p-5 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E7F8EF] text-[#027A48]">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-[#10243A]">
              {language === 'hi' ? 'इस हफ़्ते ज़्यादा बिकने वाला सामान' : language === 'te' ? 'ఈ వారం ఎక్కువగా అమ్ముడైన వస్తువులు' : 'Popular in your shop'}
            </h2>
            <p className="text-sm text-[#667085]">{language === 'hi' ? 'पिछले 7 दिनों के बिलों से' : language === 'te' ? 'గత 7 రోజుల బిల్లుల ఆధారంగా' : 'Based on bills from the last 7 days'}</p>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Loading popular items">
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-[#F2F8FB]" />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {products.slice(0, 6).map((product, index) => (
              <article key={product.product_name} className="group flex items-center gap-3 rounded-2xl border border-[#E4EAF1] bg-gradient-to-r from-white to-[#F8FCFE] p-4 transition-all hover:border-[#B9E6FE] hover:shadow-[0_12px_26px_-22px_rgba(0,41,112,0.55)]">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold ${index % 3 === 0 ? 'bg-[#EAF8FF] text-[#006B9B]' : index % 3 === 1 ? 'bg-[#E7F8EF] text-[#027A48]' : 'bg-[#FFF3DB] text-[#A15C00]'}`}>
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-[#10243A]">{product.product_name}</h3>
                  <p className="mt-0.5 text-xs text-[#667085]">{product.category} · {product.units_sold} {language === 'hi' ? 'बिके' : language === 'te' ? 'అమ్ముడయ్యాయి' : 'sold'}</p>
                </div>
                <span className="shrink-0 text-right text-sm font-extrabold text-[#002970] tabular-nums">{formatINR(product.revenue)}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-[#F8FAFC] p-4 text-sm text-[#667085]">{language === 'hi' ? 'अभी बिक्री की जानकारी उपलब्ध नहीं है।' : language === 'te' ? 'ప్రస్తుతం అమ్మకాల వివరాలు అందుబాటులో లేవు.' : 'Popular items will appear when sales are available.'}</p>
        )}
      </section>
    </div>
  );
};
