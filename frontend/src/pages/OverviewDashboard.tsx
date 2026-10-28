import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  ShoppingBag, 
  Repeat, 
  Sparkles, 
  ChevronRight,
  CreditCard,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Bot,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { 
  DashboardSummary, 
  SalesTrendItem, 
  PaymentBreakdownItem, 
  CategoryPerformanceItem, 
  RecommendationItem, 
  TransactionItem,
  Language 
} from '../types';
import { getT } from '../i18n';
import { KPICard } from '../components/KPICard';
import { api } from '../services/api';

interface OverviewDashboardProps {
  language: Language;
  onNavigate: (tab: string, context?: any) => void;
}

const PAYMENT_COLORS = ['#002970', '#00BAF2', '#12B76A', '#F79009', '#667085'];

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ language, onNavigate }) => {
  const t = getT(language);
  const [rangeKey, setRangeKey] = useState<string>('7d');
  const [chartMetric, setChartMetric] = useState<'sales' | 'transactions'>('sales');
  const [loading, setLoading] = useState<boolean>(true);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<SalesTrendItem[]>([]);
  const [payments, setPayments] = useState<PaymentBreakdownItem[]>([]);
  const [categories, setCategories] = useState<CategoryPerformanceItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  useEffect(() => {
    loadDashboardData(rangeKey);
  }, [rangeKey]);

  const loadDashboardData = async (range: string) => {
    setLoading(true);
    try {
      const [sumRes, trendRes, payRes, catRes, recRes, txnRes] = await Promise.all([
        api.getSummary(range),
        api.getTrends(range),
        api.getPayments(range),
        api.getCategories(range),
        api.getRecommendations(),
        api.getRecentTransactions(8)
      ]);

      setSummary(sumRes);
      setTrends(trendRes);
      setPayments(payRes);
      setCategories(catRes);
      setRecommendations(recRes);
      setTransactions(txnRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
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

  const salesDelta = summary ? summary.total_sales - summary.previous_period.total_sales : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Contextual Welcome & Quick Action Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#10243A] tracking-tight">
              {language === 'hi' ? 'नमस्ते शर्मा जी 👋' : language === 'te' ? 'నమస్కారం శర్మ గారూ 👋' : 'Welcome back, Sharma ji 👋'}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]">
              Ledger Synced
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1 flex items-center gap-2 flex-wrap">
            <span>{t.storeName} ({systemStatusProfileCity()})</span>
            <span className="text-[#D0D5DD]">•</span>
            <span className="font-medium text-[#344054]">
              Period: {summary?.date_range.start || '2026-10-21'} to {summary?.date_range.end || '2026-10-28'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Filter Pills */}
          <div className="flex items-center bg-[#F2F4F7] p-1 rounded-xl border border-[#E4EAF1]">
            {[
              { id: 'today', label: t.today },
              { id: '7d', label: t.last7Days },
              { id: '30d', label: t.last30Days }
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setRangeKey(pill.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  rangeKey === pill.id
                    ? 'bg-[#002970] text-white shadow-xs'
                    : 'text-[#475467] hover:text-[#10243A]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Quick Primary Copilot CTA */}
          <button
            onClick={() => onNavigate('copilot', { query: 'Why did my sales decrease this week?' })}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#002970] to-[#00BAF2] text-white text-xs font-bold shadow-fintech-sm hover:opacity-95 transition-all"
          >
            <Bot className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Ask Copilot Why</span>
            <ChevronRight className="w-3.5 h-3.5 text-sky-200" />
          </button>
        </div>
      </div>

      {/* 2. Primary Financial KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.totalSales}
          value={summary ? formatINR(summary.total_sales) : '₹0'}
          growthPct={summary?.growth.sales_pct}
          deltaAmount={summary ? (salesDelta >= 0 ? `+${formatINR(salesDelta)}` : `-${formatINR(Math.abs(salesDelta))}`) : undefined}
          subtitle={t.vsPreviousPeriod}
          icon={IndianRupee}
          iconBgColor="bg-[#EBF7FF]"
          iconColor="text-[#002970]"
        />
        <KPICard
          title={t.totalOrders}
          value={summary ? `${summary.transaction_count}` : '0'}
          growthPct={summary?.growth.txns_pct}
          subtitle={t.vsPreviousPeriod}
          icon={ShoppingBag}
          iconBgColor="bg-[#ECFDF3]"
          iconColor="text-[#12B76A]"
        />
        <KPICard
          title={t.averageOrderValue}
          value={summary ? `₹${summary.average_order_value}` : '₹0'}
          growthPct={summary?.growth.aov_pct}
          subtitle={t.vsPreviousPeriod}
          icon={CreditCard}
          iconBgColor="bg-[#FFF9EB]"
          iconColor="text-[#F79009]"
        />
        <KPICard
          title={t.repeatCustomerRate}
          value={summary ? `${summary.repeat_customer_rate}%` : '0%'}
          subtitle="Benchmark: >50% (Healthy)"
          icon={Repeat}
          iconBgColor="bg-[#F9F5FF]"
          iconColor="text-[#7F56D9]"
        />
      </div>

      {/* 3. AI Business Insights Panel (Restrained & Enterprise Quality) */}
      <div className="bg-gradient-to-br from-[#002970] via-[#0A1E42] to-[#10243A] rounded-2xl p-6 text-white shadow-fintech-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#00BAF2] border border-white/15">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  {t.aiRecommendations}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#00BAF2] text-[#002970] uppercase">
                  Explainable AI
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Observed facts connected to data-backed actions and estimated business benefits.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('copilot')}
            className="text-xs font-bold text-sky-300 hover:text-white flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>Open AI Business Copilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Featured Actionable Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((rec) => (
            <div 
              key={rec.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-400/20">
                    {rec.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Evidence: {rec.evidence_level}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-white mb-1.5 leading-snug">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {rec.insight}
                </p>

                <div className="p-2.5 rounded-lg bg-black/30 text-[11px] space-y-1 mb-4 border border-white/5">
                  <div className="text-slate-300"><strong>Action:</strong> {rec.recommended_action}</div>
                  <div className="text-emerald-300"><strong>Est. Benefit:</strong> {rec.expected_benefit}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (rec.cta_action.includes('campaign')) onNavigate('campaigns');
                  else if (rec.cta_action.includes('inventory')) onNavigate('inventory');
                  else onNavigate('copilot');
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#00BAF2] hover:bg-sky-300 text-[#002970] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{rec.cta_label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sales Performance Chart & Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Performance Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#10243A]">
                {t.salesTrends}
              </h2>
              <p className="text-xs text-[#667085]">
                Daily transaction velocity and collection trajectory
              </p>
            </div>

            {/* Metric Toggle */}
            <div className="flex items-center bg-[#F2F4F7] p-0.5 rounded-lg border border-[#E4EAF1] text-xs font-semibold">
              <button
                onClick={() => setChartMetric('sales')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  chartMetric === 'sales' ? 'bg-white text-[#002970] shadow-fintech-xs font-bold' : 'text-[#667085]'
                }`}
              >
                Revenue (₹)
              </button>
              <button
                onClick={() => setChartMetric('transactions')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  chartMetric === 'transactions' ? 'bg-white text-[#002970] shadow-fintech-xs font-bold' : 'text-[#667085]'
                }`}
              >
                Orders
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradFintech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#002970" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#002970" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#667085' }} />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#667085' }}
                  tickFormatter={(val) => chartMetric === 'sales' ? `₹${(val / 1000).toFixed(0)}k` : val}
                />
                <Tooltip 
                  formatter={(val: any) => [
                    chartMetric === 'sales' ? `₹${Number(val).toLocaleString()}` : `${val} txns`,
                    chartMetric === 'sales' ? 'Total Sales' : 'Transactions'
                  ]}
                  contentStyle={{ backgroundColor: '#10243A', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartMetric === 'sales' ? 'sales' : 'transactions'} 
                  stroke="#002970" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#salesGradFintech)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Channels Breakdown (1 Col) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-[#10243A]">
                {t.paymentBreakdown}
              </h2>
              <span className="text-[10px] font-bold text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded border border-[#A6F4C5]">
                76%+ Soundbox & QR
              </span>
            </div>
            <p className="text-xs text-[#667085] mb-2">
              Share of collections across digital and cash modes
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={payments}
                    dataKey="amount"
                    nameKey="payment_method"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {payments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#10243A', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 mt-2 pt-2 border-t border-[#F2F4F7]">
            {payments.slice(0, 4).map((p, i) => (
              <div key={p.payment_method} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PAYMENT_COLORS[i] }}></span>
                  <span className="text-[#344054] font-medium truncate max-w-[130px]">{p.payment_method}</span>
                </div>
                <span className="font-bold text-[#10243A] tabular-nums">{p.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Category Performance & Recent Transactions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Performance */}
        <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#10243A]">
                {t.categoryPerformance}
              </h2>
              <p className="text-xs text-[#667085]">
                Department revenue and growth trends
              </p>
            </div>
            <button 
              onClick={() => onNavigate('sales')}
              className="text-xs font-bold text-[#002970] hover:underline"
            >
              {t.viewDetails} →
            </button>
          </div>

          <div className="divide-y divide-[#F2F4F7]">
            {categories.map((cat) => (
              <div key={cat.category} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#10243A]">{cat.category}</div>
                  <div className="text-[11px] text-[#667085]">
                    Top seller: <span className="font-medium text-[#344054]">{cat.top_product}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[#10243A] tabular-nums">{formatINR(cat.revenue)}</div>
                  <div className={`text-[11px] font-bold tabular-nums ${
                    cat.growth_pct < 0 ? 'text-[#B42318]' : 'text-[#027A48]'
                  }`}>
                    {cat.growth_pct > 0 ? `+${cat.growth_pct}%` : `${cat.growth_pct}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#10243A]">
                {t.recentTransactions}
              </h2>
              <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-pulse"></span>
            </div>
            <span className="text-xs text-[#667085]">Live Soundbox & QR</span>
          </div>

          <div className="divide-y divide-[#F2F4F7] max-h-[290px] overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div key={tx.transaction_id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#EBF7FF] flex items-center justify-center text-[#002970] font-bold text-xs shrink-0">
                    ₹
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#10243A] truncate max-w-[180px] sm:max-w-[240px]">
                      {tx.product_name}
                    </div>
                    <div className="text-[10px] text-[#667085]">
                      {tx.timestamp.replace('T', ' ').substring(0, 16)} • {tx.payment_method}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[#10243A] tabular-nums">
                    ₹{tx.amount.toFixed(2)}
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

function systemStatusProfileCity() {
  return "Noida, UP";
}
