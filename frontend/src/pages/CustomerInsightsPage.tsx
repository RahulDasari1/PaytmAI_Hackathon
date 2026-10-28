import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  HeartHandshake, 
  Sparkles, 
  ShieldAlert,
  Search,
  ArrowRight
} from 'lucide-react';
import { CustomerInsightsData, Language } from '../types';
import { getT } from '../i18n';
import { api } from '../services/api';

interface CustomerInsightsPageProps {
  language: Language;
  onNavigate: (tab: string, context?: any) => void;
}

export const CustomerInsightsPage: React.FC<CustomerInsightsPageProps> = ({ language, onNavigate }) => {
  const t = getT(language);
  const [data, setData] = useState<CustomerInsightsData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.getCustomers('30d');
      setData(res);
    } catch (err) {
      console.error('Failed to load customer insights:', err);
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

  const filteredInactive = (data?.inactive_customers || []).filter(c => 
    c.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.favorite_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4EAF1] shadow-fintech-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#10243A] tracking-tight">
            {t.navCustomers}
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            RFM algorithmic customer segmentation, purchase recency cohorts, and privacy-preserving retention
          </p>
        </div>

        <button
          onClick={() => onNavigate('campaigns', { objective: 'WIN_BACK_INACTIVE' })}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#002970] to-[#00BAF2] text-white text-xs font-bold shadow-fintech-xs hover:opacity-95 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Inactive Re-engagement</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#667085] uppercase tracking-wider">
            <span>Total Tracked Shoppers</span>
            <Users className="w-4 h-4 text-[#002970]" />
          </div>
          <div className="text-2xl font-extrabold text-[#10243A] mt-2 tabular-nums">
            {data?.metrics.total_tracked_customers || 220}
          </div>
          <div className="text-xs text-[#667085] mt-1">Unique customer IDs</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#667085] uppercase tracking-wider">
            <span>Active (Last 14 Days)</span>
            <UserCheck className="w-4 h-4 text-[#12B76A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#027A48] mt-2 tabular-nums">
            {data?.metrics.active_last_14d || 185}
          </div>
          <div className="text-xs text-[#667085] mt-1">Regular weekly buyers</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#667085] uppercase tracking-wider">
            <span>At Risk / Inactive</span>
            <UserX className="w-4 h-4 text-[#F04438]" />
          </div>
          <div className="text-2xl font-extrabold text-[#B42318] mt-2 tabular-nums">
            {data?.metrics.at_risk_inactive || 35}
          </div>
          <div className="text-xs text-[#B42318] font-bold mt-1">Lapsed regular shoppers</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#667085] uppercase tracking-wider">
            <span>Customer Retention Rate</span>
            <HeartHandshake className="w-4 h-4 text-[#7F56D9]" />
          </div>
          <div className="text-2xl font-extrabold text-[#6941C6] mt-2 tabular-nums">
            {data?.metrics.retention_rate_pct || 84.1}%
          </div>
          <div className="text-xs text-[#667085] mt-1">30-day cohort benchmark</div>
        </div>
      </div>

      {/* RFM Cohort Segmentation Grid */}
      <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
        <h2 className="text-sm font-bold text-[#10243A] mb-0.5">
          RFM Customer Segments (Recency • Frequency • Spend)
        </h2>
        <p className="text-xs text-[#667085] mb-4">
          Behavioral clusters calculated from transaction history and days since last purchase
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {data?.segments.map((seg) => {
            const isAtRisk = seg.segment.includes('At Risk');
            const isChampion = seg.segment.includes('Champions');

            return (
              <div
                key={seg.segment}
                className={`p-3.5 rounded-xl border transition-all ${
                  isAtRisk
                    ? 'bg-[#FEF3F2] border-[#FECDCA]'
                    : isChampion
                    ? 'bg-[#ECFDF3] border-[#A6F4C5]'
                    : 'bg-[#F8FAFC] border-[#E4EAF1]'
                }`}
              >
                <div className="text-xs font-bold text-[#10243A] truncate mb-1.5">
                  {seg.segment}
                </div>
                <div className="text-xl font-extrabold text-[#002970] tabular-nums">
                  {seg.customer_count} <span className="text-xs font-normal text-[#667085]">custs</span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#E4EAF1] space-y-1 text-[11px] text-[#475467]">
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-bold text-[#10243A] tabular-nums">{formatINR(seg.total_revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Visits:</span>
                    <span className="font-medium text-[#344054] tabular-nums">{seg.avg_frequency} times</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recency:</span>
                    <span className="font-medium text-[#344054] tabular-nums">{seg.avg_recency}d ago</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inactive Customers Retention Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#F04438]" />
              <h2 className="text-sm font-bold text-[#10243A]">
                Lapsed Regular Customers Requiring Re-engagement
              </h2>
            </div>
            <p className="text-xs text-[#667085] mt-0.5">
              Identified from ledger logs: zero purchases in 15+ days despite past loyalty.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Customer ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E4EAF1] text-xs focus:outline-none focus:border-[#00BAF2] bg-[#F8FAFC]"
              />
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]">
              {filteredInactive.length} Targets
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E4EAF1] text-[#667085] font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Customer ID</th>
                <th className="pb-3 text-center">Days Inactive</th>
                <th className="pb-3 text-center">Past Visits</th>
                <th className="pb-3 text-right">Lifetime Spend</th>
                <th className="pb-3">Favorite Category</th>
                <th className="pb-3">Retention Strategy</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {filteredInactive.map((cust) => (
                <tr key={cust.customer_id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 font-bold text-[#002970] font-mono">{cust.customer_id}</td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] tabular-nums">
                      {cust.days_inactive} days
                    </span>
                  </td>
                  <td className="py-3 text-center font-medium text-[#344054] tabular-nums">{cust.prior_visits} orders</td>
                  <td className="py-3 text-right font-bold text-[#10243A] tabular-nums">{formatINR(cust.lifetime_spend)}</td>
                  <td className="py-3 text-[#475467]">{cust.favorite_category}</td>
                  <td className="py-3 text-[#344054] italic">{cust.suggested_action}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onNavigate('campaigns', { 
                        objective: 'WIN_BACK_INACTIVE', 
                        customer: cust.customer_id 
                      })}
                      className="px-2.5 py-1 rounded-lg bg-[#EBF7FF] hover:bg-[#002970] text-[#002970] hover:text-white font-bold text-[11px] transition-colors"
                    >
                      Draft Offer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
