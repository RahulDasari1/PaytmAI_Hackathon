import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  CreditCard, 
  BarChart2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Cell
} from 'recharts';
import { Language, ProductPerformanceItem, CategoryPerformanceItem } from '../types';
import { getT } from '../i18n';
import { api, API_BASE } from '../services/api';

interface SalesAnalyticsPageProps {
  language: Language;
  onNavigate: (tab: string) => void;
}

export const SalesAnalyticsPage: React.FC<SalesAnalyticsPageProps> = ({ language, onNavigate }) => {
  const t = getT(language);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [categories, setCategories] = useState<CategoryPerformanceItem[]>([]);
  const [products, setProducts] = useState<ProductPerformanceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts('7d', 10),
        api.getCategories('7d')
      ]);

      const hourlyRes = await fetch(`${API_BASE}/sales/hourly?range_key=7d`).then(r => r.json());
      const compareRes = await fetch(`${API_BASE}/sales/compare`).then(r => r.json());

      setHourlyData(hourlyRes.hourly_data || []);
      setComparison(compareRes);
      setCategories(catRes);
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4EAF1] shadow-fintech-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#10243A] tracking-tight">
            {t.navSales}
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Transaction velocity, period-over-period variance diagnosis, and hourly footfall windows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#EBF7FF] text-[#002970] border border-[#B9E6FE] text-xs font-bold">
            Recent 7 Days vs Prior 7 Days
          </span>
        </div>
      </div>

      {/* Period Comparison Engine (The Seeded Dip Analysis) */}
      {comparison && (
        <div className="bg-gradient-to-br from-[#002970] via-[#0A1E42] to-[#10243A] rounded-2xl p-6 text-white shadow-fintech-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00BAF2]" />
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Period Comparison Engine: Why Sales Changed
              </h2>
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${
              comparison.sales_growth_pct < 0 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' 
                : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {comparison.sales_growth_pct > 0 ? `+${comparison.sales_growth_pct}%` : `${comparison.sales_growth_pct}% Weekly Variance`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-sky-200 font-semibold uppercase">Recent 7 Days Revenue</div>
              <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">{formatINR(comparison.period1.sales)}</div>
              <div className="text-xs text-sky-200 mt-0.5">{comparison.period1.transactions} orders recorded</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-sky-200 font-semibold uppercase">Prior 7 Days Revenue</div>
              <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">{formatINR(comparison.period2.sales)}</div>
              <div className="text-xs text-sky-200 mt-0.5">{comparison.period2.transactions} orders recorded</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-rose-300 font-semibold uppercase">Net Variance (Drop)</div>
              <div className="text-2xl font-extrabold text-rose-300 mt-1 tabular-nums">
                -₹{Math.abs(comparison.sales_difference).toLocaleString()}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">Primary Dip: Evening Footfall</div>
            </div>
          </div>

          {/* Department Variance Breakdown */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-sky-200 uppercase tracking-wider">
              Department Variance Breakdown
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {comparison.category_changes?.slice(0, 4).map((c: any) => (
                <div key={c.category} className="p-3 rounded-xl bg-black/25 border border-white/5">
                  <div className="text-xs font-bold text-white truncate">{c.category}</div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-slate-300">Diff:</span>
                    <span className={`font-bold tabular-nums ${c.diff_amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {c.diff_amount < 0 ? `-₹${Math.abs(c.diff_amount)}` : `+₹${c.diff_amount}`} ({c.change_pct}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hourly Footfall Chart */}
      <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#10243A]">
              {t.peakHours}
            </h2>
            <p className="text-xs text-[#667085]">
              Order volume across store hours (07:00 to 22:00)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
            <span className="text-[#002970] bg-[#EBF7FF] px-2.5 py-1 rounded-lg border border-[#B9E6FE]">
              Morning Rush: 09:00 - 11:00 AM
            </span>
            <span className="text-[#027A48] bg-[#ECFDF3] px-2.5 py-1 rounded-lg border border-[#A6F4C5]">
              Evening Prime: 17:30 - 20:30 PM
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
              <XAxis dataKey="hour_label" tick={{ fontSize: 11, fill: '#667085' }} />
              <YAxis tick={{ fontSize: 11, fill: '#667085' }} />
              <Tooltip 
                formatter={(val: any, name?: any) => [
                  name === 'transactions' ? `${val} orders` : `₹${val}`,
                  name === 'transactions' ? 'Transactions' : 'Sales'
                ]}
                contentStyle={{ backgroundColor: '#10243A', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '12px' }}
              />
              <Bar dataKey="transactions" radius={[6, 6, 0, 0]}>
                {hourlyData.map((entry, index) => {
                  const h = entry.hour;
                  const isPeak = (h >= 8 && h <= 10) || (h >= 17 && h <= 20);
                  return <Cell key={`cell-${index}`} fill={isPeak ? '#00BAF2' : '#CBD5E1'} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 Best Performing Products Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
        <h2 className="text-sm font-bold text-[#10243A] mb-0.5">
          Top Performing Items (Last 7 Days)
        </h2>
        <p className="text-xs text-[#667085] mb-4">
          Ranked by net collection revenue from digital ledger
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E4EAF1] text-[#667085] font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Units Sold</th>
                <th className="pb-3 text-right">Total Revenue</th>
                <th className="pb-3 text-right">Avg Order Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {products.map((prod) => (
                <tr key={prod.product_name} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 font-bold text-[#10243A]">{prod.product_name}</td>
                  <td className="py-3 text-[#667085]">{prod.category}</td>
                  <td className="py-3 text-right font-semibold text-[#344054] tabular-nums">{prod.units_sold}</td>
                  <td className="py-3 text-right font-bold text-[#002970] tabular-nums">{formatINR(prod.revenue)}</td>
                  <td className="py-3 text-right font-medium text-[#475467] tabular-nums">₹{prod.avg_order_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
