import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Boxes, 
  ArrowRight,
  Truck,
  HelpCircle,
  X
} from 'lucide-react';
import { InventoryItem, Language } from '../types';
import { getT } from '../i18n';
import { api } from '../services/api';

interface InventoryPageProps {
  language: Language;
  onRefreshCriticalCount?: (count: number) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ language, onRefreshCriticalCount }) => {
  const t = getT(language);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Reorder Modal State
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [reorderQty, setReorderQty] = useState<number>(30);
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, [filterUrgency, filterCat]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory(filterUrgency, filterCat);
      setInventory(data);
      const critCount = data.filter(i => i.priority === 'CRITICAL').length;
      if (onRefreshCriticalCount) onRefreshCriticalCount(critCount);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReorder = (item: InventoryItem) => {
    setSelectedProduct(item);
    setReorderQty(item.suggested_reorder_qty);
    setReorderSuccessMsg(null);
  };

  const handleConfirmReorder = async () => {
    if (!selectedProduct) return;
    try {
      const res = await api.reorderProduct(selectedProduct.sku, reorderQty);
      setReorderSuccessMsg(res.message);
      loadInventory();
      setTimeout(() => {
        setSelectedProduct(null);
        setReorderSuccessMsg(null);
      }, 2200);
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  const criticalCount = inventory.filter(i => i.priority === 'CRITICAL').length;
  const lowCount = inventory.filter(i => i.priority === 'LOW_STOCK').length;
  const healthyCount = inventory.filter(i => i.priority === 'HEALTHY').length;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.navInventory}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Velocity-based stockout predictions and automated supplier reorder planner
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>Supplier Lead Time: 24 - 48 Hours</span>
          </span>
        </div>
      </div>

      {/* 3 Status Filter Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilterUrgency(filterUrgency === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterUrgency === 'CRITICAL'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase">
            <span>Critical Stockout Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 mt-2">
            {criticalCount} <span className="text-xs font-semibold text-slate-500">items</span>
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            Depleting in &lt; 3.0 days
          </div>
        </button>

        <button
          onClick={() => setFilterUrgency(filterUrgency === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterUrgency === 'LOW_STOCK'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-700 uppercase">
            <span>Low Stock Warning</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-2">
            {lowCount} <span className="text-xs font-semibold text-slate-500">items</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            Depleting in 3 - 7 days
          </div>
        </button>

        <button
          onClick={() => setFilterUrgency(filterUrgency === 'HEALTHY' ? 'ALL' : 'HEALTHY')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterUrgency === 'HEALTHY'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase">
            <span>Healthy Inventory</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">
            {healthyCount} <span className="text-xs font-semibold text-slate-500">items</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            &gt; 7 days of supply available
          </div>
        </button>
      </div>

      {/* Product Catalog Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Inventory Velocity & Reorder Recommendations
            </h2>
            <p className="text-xs text-slate-500">
              Coverage based on actual 30-day product velocity and safety thresholds
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="Groceries & Staples">Groceries & Staples</option>
              <option value="Dairy & Bakery">Dairy & Bakery</option>
              <option value="Snacks & Beverages">Snacks & Beverages</option>
              <option value="Personal & Home Care">Personal & Home Care</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Product Name & Category</th>
                <th className="pb-3 text-center">Current Stock</th>
                <th className="pb-3 text-center">Daily Velocity</th>
                <th className="pb-3 text-center">Est. Supply</th>
                <th className="pb-3 text-center">Reorder Qty</th>
                <th className="pb-3">Why This Recommendation?</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => {
                const isCrit = item.priority === 'CRITICAL';
                const isLow = item.priority === 'LOW_STOCK';

                return (
                  <tr key={item.sku} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.sku} • {item.category}</div>
                    </td>

                    <td className="py-3.5 text-center">
                      <div className="font-extrabold text-slate-900">{item.current_stock}</div>
                      <div className="text-[10px] text-slate-400">Min: {item.min_threshold}</div>
                    </td>

                    <td className="py-3.5 text-center font-semibold text-slate-700">
                      ~{item.daily_sales_velocity} /day
                    </td>

                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        isCrit
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : isLow
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.estimated_days_remaining} days
                      </span>
                    </td>

                    <td className="py-3.5 text-center font-bold text-[#0F2D6B]">
                      {item.suggested_reorder_qty} units
                      <div className="text-[10px] text-slate-400 font-normal">₹{item.estimated_reorder_cost}</div>
                    </td>

                    <td className="py-3.5 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                      {item.why_recommendation}
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleOpenReorder(item)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          isCrit
                            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                            : isLow
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                            : 'bg-sky-50 hover:bg-sky-100 text-[#0F2D6B]'
                        }`}
                      >
                        {isCrit ? 'Urgent Reorder' : 'Reorder'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Reorder Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-[#0F2D6B] to-[#00BAF2] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Simulate Supplier Purchase Order</h3>
                <p className="text-xs text-sky-200">Instant Demo Inventory Update</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-1.5 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Product</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedProduct.name}</div>
                <div className="text-xs text-slate-500">Supplier: {selectedProduct.supplier_name}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Reorder Quantity (Units)
                </label>
                <input
                  type="number"
                  value={reorderQty}
                  onChange={(e) => setReorderQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-400"
                />
                <div className="text-xs text-slate-500 mt-1">
                  Est. Cost: ₹{(reorderQty * selectedProduct.unit_cost).toLocaleString()}
                </div>
              </div>

              {reorderSuccessMsg ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reorderSuccessMsg}</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-200">
                  ℹ️ This is a simulated demo transaction that updates the persistent SQLite database immediately.
                </div>
              )}

              <button
                onClick={handleConfirmReorder}
                disabled={Boolean(reorderSuccessMsg)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0F2D6B] to-[#00BAF2] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50"
              >
                Confirm Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
