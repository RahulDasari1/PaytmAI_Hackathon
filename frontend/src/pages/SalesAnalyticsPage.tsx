import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CreditCard, 
  Calendar, 
  ArrowRight,
  Filter,
  BarChart2
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
      const [analyticsRes, prodRes] = await Promise.all([
        api.getPayments('7d'), // or sales analytics
        api.getProducts('7d', 10)
      ]);

      // fetch hourly and comparison
      const hourlyRes = await fetch(`${API_BASE}/sales/hourly?range_key=7d`).then(r => r.json());
      const compareRes = await fetch(`${API_BASE}/sales/compare`).then(r => r.json());
      const catRes = await api.getCategories('7d');

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
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.navSales}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep-dive transaction velocity, peak footfall windows, and period comparisons
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-sky-50 text-[#0F2D6B] border border-sky-200 text-xs font-bold">
            Last 7 Days vs Prior 7 Days
          </span>
        </div>
      </div>

      {/* Period Comparison Card (The Seeded Dip Analysis) */}
      {comparison && (
        <div className="bg-gradient-to-br from-slate-900 to-[#0F2D6B] rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-300" />
              <h2 className="text-base font-bold text-white">
                Period Comparison Engine: Why Sales Changed
              </h2>
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              comparison.sales_growth_pct < 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {comparison.sales_growth_pct > 0 ? `+${comparison.sales_growth_pct}%` : `${comparison.sales_growth_pct}% Weekly Change`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs text-sky-200 font-medium">Recent 7 Days Revenue</div>
              <div className="text-2xl font-bold text-white mt-1">{formatINR(comparison.period1.sales)}</div>
              <div className="text-xs text-sky-300 mt-0.5">{comparison.period1.transactions} orders recorded</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs text-sky-200 font-medium">Prior 7 Days Revenue</div>
              <div className="text-2xl font-bold text-white mt-1">{formatINR(comparison.period2.sales)}</div>
              <div className="text-xs text-sky-300 mt-0.5">{comparison.period2.transactions} orders recorded</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs text-sky-200 font-medium">Net Sales Variance</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">
                -₹{Math.abs(comparison.sales_difference).toLocaleString()}
              </div>
              <div className="text-xs text-sky-200 mt-0.5">Primary Dip: Evening Footfall</div>
            </div>
          </div>

          {/* Category-by-category changes */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-sky-200 uppercase tracking-wider">
              Department Variance Breakdown
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {comparison.category_changes?.slice(0, 4).map((c: any) => (
                <div key={c.category} className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <div className="text-xs font-bold text-white truncate">{c.category}</div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-slate-300">Diff:</span>
                    <span className={`font-bold ${c.diff_amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
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
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t.peakHours}
            </h2>
            <p className="text-xs text-slate-500">
              Transaction frequency across store operating hours (07:00 to 22:00)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              Morning Peak: 09:00 - 11:00 AM
            </span>
            <span className="text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              Evening Prime: 17:30 - 20:30 PM
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="hour_label" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip 
                formatter={(val: any, name?: any) => [
                  name === 'transactions' ? `${val} orders` : `₹${val}`,
                  name === 'transactions' ? 'Transactions' : 'Sales'
                ]}
                contentStyle={{ backgroundColor: '#0F2D6B', borderRadius: '12px', color: '#fff', border: 'none' }}
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
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Top Performing Items (Last 7 Days)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Highest revenue generating stock items
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Units Sold</th>
                <th className="pb-3 text-right">Total Revenue</th>
                <th className="pb-3 text-right">Avg Order Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((prod) => (
                <tr key={prod.product_name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-bold text-slate-900">{prod.product_name}</td>
                  <td className="py-3 text-slate-500">{prod.category}</td>
                  <td className="py-3 text-right font-semibold text-slate-700">{prod.units_sold}</td>
                  <td className="py-3 text-right font-bold text-[#0F2D6B]">{formatINR(prod.revenue)}</td>
                  <td className="py-3 text-right font-medium text-slate-600">₹{prod.avg_order_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
