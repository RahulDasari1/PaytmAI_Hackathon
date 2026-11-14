import React, { useCallback, useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Sparkles, 
  Search,
  ArrowRight,
  Clock3,
  UserRound
} from 'lucide-react';
import { CustomerInsightsData, Language } from '../types';
import { getT } from '../i18n';
import { api } from '../services/api';
import { PageHeader } from '../components/PageHeader';

interface CustomerInsightsPageProps {
  language: Language;
  onNavigate: (tab: string, context?: any) => void;
}

export const CustomerInsightsPage: React.FC<CustomerInsightsPageProps> = ({ language, onNavigate }) => {
  const t = getT(language);
  const [data, setData] = useState<CustomerInsightsData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getCustomers('30d');
      setData(res);
    } catch (err) {
      console.error('Failed to load customer insights:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const filteredInactive = (data?.inactive_customers || []).filter(c => 
    c.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.favorite_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-3">
      <PageHeader
        eyebrow={language === 'hi' ? 'आपके ग्राहक' : language === 'te' ? 'మీ కస్టమర్లు' : 'People who shop with you'}
        icon={Users}
        title={t.navCustomers}
        description={language === 'hi'
          ? 'देखें कौन-कौन आते हैं और किसे एक अपनापन भरा संदेश भेजना अच्छा रहेगा।'
          : language === 'te'
            ? 'ఎవరు వస్తున్నారో, ఎవరికి స్నేహపూర్వక సందేశం పంపవచ్చో చూడండి.'
            : 'See who visits often and who may appreciate a friendly hello.'}
        action={
          <button
            type="button"
            onClick={() => onNavigate('campaigns', { objective: 'WIN_BACK_INACTIVE' })}
              className="inline-flex min-h-11 w-full max-w-full items-center justify-center gap-2 whitespace-normal rounded-full bg-[#002970] px-4 text-sm font-bold leading-tight text-white shadow-[0_8px_18px_-12px_rgba(0,41,112,0.65)] transition-all hover:-translate-y-0.5 hover:bg-[#0F3B8C] sm:w-auto"
          >
            <Sparkles className="h-4 w-4 text-[#80E5FF]" aria-hidden="true" />
            {language === 'hi' ? 'ऑफ़र का संदेश बनाएँ' : language === 'te' ? 'ఆఫర్ సందేశం తయారు చేయండి' : 'Prepare a friendly offer'}
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label={t.navCustomers}>
        {[
          {
            label: language === 'hi' ? 'पहचाने गए ग्राहक' : language === 'te' ? 'గుర్తించిన కస్టమర్లు' : 'Customers in this demo',
            value: data?.metrics.total_tracked_customers ?? 0,
            detail: language === 'hi' ? 'सिर्फ़ नमूना ग्राहक ID' : language === 'te' ? 'నమూనా కస్టమర్ IDలు మాత్రమే' : 'Sample customer IDs only',
            icon: Users,
            style: 'bg-[#EAF8FF] text-[#006B9B]'
          },
          {
            label: language === 'hi' ? 'हाल में आए' : language === 'te' ? 'ఇటీవల వచ్చినవారు' : 'Visited recently',
            value: data?.metrics.active_last_14d ?? 0,
            detail: language === 'hi' ? 'पिछले 14 दिनों में' : language === 'te' ? 'గత 14 రోజుల్లో' : 'In the last 14 days',
            icon: UserCheck,
            style: 'bg-[#E7F8EF] text-[#027A48]'
          },
          {
            label: language === 'hi' ? 'जिनसे फिर जुड़ सकते हैं' : language === 'te' ? 'మళ్లీ పలకరించవచ్చు' : 'Could reconnect with',
            value: data?.metrics.at_risk_inactive ?? 0,
            detail: language === 'hi' ? 'काफ़ी दिनों से नहीं आए' : language === 'te' ? 'కొంతకాలంగా రాలేదు' : 'Haven’t visited lately',
            icon: UserX,
            style: 'bg-[#FFF3DB] text-[#A15C00]'
          }
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="flex items-center gap-3 rounded-[22px] border border-[#E4EAF1] bg-white p-4 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] sm:p-5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${metric.style}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#667085]">{metric.label}</p>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#10243A] tabular-nums">{loading ? '—' : metric.value}</span>
                  <span className="truncate text-[11px] text-[#667085]">{metric.detail}</span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-[26px] border border-[#E4EAF1] bg-white p-5 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF8FF] text-[#006B9B]">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-[#10243A]">{language === 'hi' ? 'दुकान पर आने वाले लोग' : language === 'te' ? 'మీ దుకాణానికి వచ్చే వారు' : 'Your shop’s customer groups'}</h2>
            <p className="text-sm text-[#667085]">{language === 'hi' ? 'सरल समूह, ताकि अगला कदम चुनना आसान हो।' : language === 'te' ? 'తదుపరి అడుగు సులభంగా ఎంచుకోవడానికి చిన్న సమూహాలు.' : 'Simple groups to make your next step easier.'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data?.segments.map((segment) => {
            const isAtRisk = segment.segment.includes('At Risk');
            const isChampion = segment.segment.includes('Champions');
            const groupLabel = isAtRisk
              ? (language === 'hi' ? 'जिनसे फिर जुड़ सकते हैं' : language === 'te' ? 'మళ్లీ పలకరించవచ్చు' : 'May be away')
              : isChampion
                ? (language === 'hi' ? 'आपके नियमित ग्राहक' : language === 'te' ? 'మీ రెగ్యులర్ కస్టమర్లు' : 'Regular customers')
                : (language === 'hi' ? 'दूसरे ग्राहक' : language === 'te' ? 'ఇతర కస్టమర్లు' : 'Other shoppers');
            const groupStyle = isAtRisk ? 'from-[#FFF8F5] to-white border-[#F6D6C9]' : isChampion ? 'from-[#F2FCF6] to-white border-[#CBEBD6]' : 'from-[#F2FAFE] to-white border-[#D5EAF4]';
            const fillStyle = isAtRisk ? 'bg-[#F79009]' : isChampion ? 'bg-[#12B76A]' : 'bg-[#00A8E0]';
            const count = data.metrics.total_tracked_customers ? (segment.customer_count / data.metrics.total_tracked_customers) * 100 : 0;
            return (
              <article key={segment.segment} className={`rounded-2xl border bg-gradient-to-br p-4 ${groupStyle}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-[#344054]">{groupLabel}</h3>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#344054]">{segment.customer_count}</span>
                </div>
                <p className="mt-1 text-xs text-[#667085]">{segment.segment}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div className={`h-full rounded-full ${fillStyle}`} style={{ width: `${Math.min(100, count)}%` }} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[26px] border border-[#E4EAF1] bg-white p-5 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-[#A15C00]" aria-hidden="true" />
              <h2 className="text-base font-extrabold text-[#10243A]">
                {language === 'hi' ? 'किसे फिर से नमस्ते कहें?' : language === 'te' ? 'ఎవరిని మళ్లీ పలకరించాలి?' : 'Who could you say hello to?'}
              </h2>
            </div>
            <p className="mt-0.5 text-sm text-[#667085]">
              {language === 'hi' ? 'ये नमूना रिकॉर्ड हैं। पहचान के लिए असली ग्राहक जानकारी नहीं दिखाई जाती।' : language === 'te' ? 'ఇవి నమూనా వివరాలు. అసలు కస్టమర్ వివరాలు చూపించబడవు.' : 'Sample records only. Real customer details are not shown.'}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'नमूना ID खोजें' : language === 'te' ? 'నమూనా ID వెతకండి' : 'Search sample IDs'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={language === 'hi' ? 'नमूना ग्राहक ID खोजें' : language === 'te' ? 'నమూనా కస్టమర్ ID వెతకండి' : 'Search sample customers'}
                className="min-h-10 w-full rounded-xl border border-[#E4EAF1] bg-[#F8FCFE] py-2 pl-9 pr-3 text-sm focus:border-[#00BAF2] focus:outline-none focus:ring-2 focus:ring-[#B9E6FE] sm:w-48"
              />
            </div>

            <span className="w-fit rounded-full border border-[#F6D6C9] bg-[#FFF8F5] px-2.5 py-1.5 text-xs font-bold text-[#A15C00]">
              {filteredInactive.length} {language === 'hi' ? 'नमूने' : language === 'te' ? 'నమూనాలు' : 'samples'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2" aria-label="Loading customer groups">
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-[#F2F8FB]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredInactive.map((cust) => (
                <article key={cust.customer_id} className="rounded-2xl border border-[#E4EAF1] bg-gradient-to-br from-white to-[#F8FCFE] p-4 transition-all hover:border-[#D1E9FF] hover:shadow-[0_12px_26px_-22px_rgba(0,41,112,0.55)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EAF8FF] text-[#006B9B]">
                        <UserRound className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#10243A]">{language === 'hi' ? 'नमूना ग्राहक' : language === 'te' ? 'నమూనా కస్టమర్' : 'Sample customer'} · <span className="font-mono text-[#006B9B]">{cust.customer_id}</span></h3>
                        <p className="mt-0.5 text-xs text-[#667085]">{cust.days_inactive} {language === 'hi' ? 'दिन से नहीं आए' : language === 'te' ? 'రోజులుగా రాలేదు' : 'days since last visit'}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#FFF3DB] px-2.5 py-1 text-[11px] font-bold text-[#A15C00]">{cust.favorite_category}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#E4EAF1] pt-3">
                    <p className="min-w-0 text-xs leading-relaxed text-[#475467]">{cust.suggested_action.replace(/^Send /, 'Prepare ').replace(' on WhatsApp', ' message')}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate('campaigns', { 
                        objective: 'WIN_BACK_INACTIVE', 
                        customer: cust.customer_id 
                      })}
                      className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#002970] px-3 text-xs font-bold text-white transition-colors hover:bg-[#0F3B8C]"
                    >
                      {language === 'hi' ? 'ऑफ़र' : language === 'te' ? 'ఆఫర్' : 'Make offer'}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
              {filteredInactive.length === 0 && (
                <p className="col-span-full rounded-2xl bg-[#F8FAFC] p-5 text-center text-sm text-[#667085]">
                  {language === 'hi' ? 'इस खोज में कोई नमूना ग्राहक नहीं मिला।' : language === 'te' ? 'ఈ వెతుకులాటలో నమూనా కస్టమర్లు లేరు.' : 'No sample customers match your search.'}
                </p>
              )}
          </div>
        )}
      </section>
    </div>
  );
};
