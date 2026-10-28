import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Repeat, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight,
  Clock,
  CreditCard,
  Layers,
  ArrowRight
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

const PAYMENT_COLORS = ['#0F2D6B', '#00BAF2', '#10B981', '#F59E0B', '#64748B'];

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ language, onNavigate }) => {
  const t = getT(language);
  const [rangeKey, setRangeKey] = useState<string>('7d');
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

  return (
    <div className="space-y-6">
      
      {/* Top Controls: Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.storeName} — {t.navOverview}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {summary?.date_range ? (
              <span>Period: {summary.date_range.start} to {summary.date_range.end} (Demo Sandbox Data)</span>
            ) : "Loading store analytics..."}
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
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
                  ? 'bg-[#0F2D6B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.totalSales}
          value={summary ? formatINR(summary.total_sales) : '₹0'}
          growthPct={summary?.growth.sales_pct}
          subtitle={t.vsPreviousPeriod}
          icon={IndianRupee}
          iconBgColor="bg-sky-50"
          iconColor="text-[#0F2D6B]"
        />
        <KPICard
          title={t.totalOrders}
          value={summary ? `${summary.transaction_count} txns` : '0'}
          growthPct={summary?.growth.txns_pct}
          subtitle={t.vsPreviousPeriod}
          icon={ShoppingBag}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KPICard
          title={t.averageOrderValue}
          value={summary ? `₹${summary.average_order_value}` : '₹0'}
          growthPct={summary?.growth.aov_pct}
          subtitle={t.vsPreviousPeriod}
          icon={CreditCard}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
        <KPICard
          title={t.repeatCustomerRate}
          value={summary ? `${summary.repeat_customer_rate}%` : '0%'}
          subtitle="Benchmark: >50% (Healthy)"
          icon={Repeat}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      {/* AI Business Recommendations Banner */}
      <div className="bg-gradient-to-br from-[#0F2D6B] via-[#0A1E42] to-[#002970] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sky-400/10 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00BAF2] to-sky-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {t.aiRecommendations}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00BAF2] text-slate-900 uppercase">
                  Explainable AI
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Every suggestion connects an observed fact to a concrete next step and estimated outcome.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('copilot')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 backdrop-blur-md self-start md:self-auto"
          >
            <span>Ask Copilot for Details</span>
            <ChevronRight className="w-4 h-4 text-sky-300" />
          </button>
        </div>

        {/* 2 Featured Actionable Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((rec) => (
            <div 
              key={rec.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-400/20">
                    {rec.type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Evidence: {rec.evidence_level}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">
                  {rec.title}
                </h3>
                <p className="text-xs text-sky-100/90 leading-relaxed mb-3">
                  {rec.insight}
                </p>

                <div className="p-2.5 rounded-xl bg-black/25 text-[11px] text-sky-200/90 space-y-1 mb-4 border border-white/5">
                  <div><strong>Action:</strong> {rec.recommended_action}</div>
                  <div className="text-emerald-300"><strong>Est. Benefit:</strong> {rec.expected_benefit}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (rec.cta_action.includes('campaign')) onNavigate('campaigns');
                  else if (rec.cta_action.includes('inventory')) onNavigate('inventory');
                  else onNavigate('copilot');
                }}
                className="w-full py-2.5 rounded-xl bg-[#00BAF2] hover:bg-sky-400 text-slate-900 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>{rec.cta_label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Sales Trend Chart & Payment Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.salesTrends}
              </h2>
              <p className="text-xs text-slate-500">
                Daily revenue curve with order volume comparison
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-[#0F2D6B]">
                <span className="w-3 h-3 rounded-full bg-[#0F2D6B]"></span> Revenue (₹)
              </span>
              <span className="flex items-center gap-1 text-[#00BAF2]">
                <span className="w-3 h-3 rounded-full bg-[#00BAF2]"></span> Orders
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F2D6B" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0F2D6B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  formatter={(val: any, name?: any) => [
                    name === 'sales' ? `₹${val.toLocaleString()}` : val,
                    name === 'sales' ? 'Revenue' : 'Orders'
                  ]}
                  contentStyle={{ backgroundColor: '#0F2D6B', borderRadius: '12px', color: '#fff', border: 'none' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0F2D6B" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Breakdown (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {t.paymentBreakdown}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Paytm Soundbox + QR account for 76%+ of collections
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
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {payments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#0F2D6B', borderRadius: '8px', color: '#fff', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 mt-2">
            {payments.slice(0, 4).map((p, i) => (
              <div key={p.payment_method} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PAYMENT_COLORS[i] }}></span>
                  <span className="text-slate-700 font-medium truncate max-w-[140px]">{p.payment_method}</span>
                </div>
                <span className="font-bold text-slate-900">{p.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Category Performance & Live Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Performance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.categoryPerformance}
              </h2>
              <p className="text-xs text-slate-500">
                Revenue contribution and weekly growth by department
              </p>
            </div>
            <button 
              onClick={() => onNavigate('sales')}
              className="text-xs font-bold text-[#0F2D6B] hover:underline"
            >
              {t.viewDetails}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <div key={cat.category} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{cat.category}</div>
                  <div className="text-[11px] text-slate-500">
                    Top item: <span className="font-medium text-slate-700">{cat.top_product}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">{formatINR(cat.revenue)}</div>
                  <div className={`text-[11px] font-bold ${
                    cat.growth_pct < 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {cat.growth_pct > 0 ? `+${cat.growth_pct}%` : `${cat.growth_pct}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.recentTransactions}
              </h2>
              <p className="text-xs text-slate-500">
                Verified digital ledger transactions (Paytm Soundbox & QR)
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div key={tx.transaction_id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#0F2D6B] shrink-0 font-bold text-xs">
                    ₹
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                      {tx.product_name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {tx.timestamp.replace('T', ' ').substring(0, 16)} • {tx.payment_method}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    ₹{tx.amount.toFixed(2)}
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
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
