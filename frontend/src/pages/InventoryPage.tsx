import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  X,
  Search,
  ArrowRight
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
  const [searchQuery, setSearchQuery] = useState<string>('');
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
      }, 2000);
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  const criticalCount = inventory.filter(i => i.priority === 'CRITICAL').length;
  const lowCount = inventory.filter(i => i.priority === 'LOW_STOCK').length;
  const healthyCount = inventory.filter(i => i.priority === 'HEALTHY').length;

  const filteredItems = inventory.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4EAF1] shadow-fintech-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#10243A] tracking-tight">
            {t.navInventory}
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Velocity-based stockout predictions, supplier turnaround tracking, and automated purchase ordering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#FFF9EB] text-[#B54708] border border-[#FEF0C7] text-xs font-bold flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#F79009]" />
            <span>FMCG Lead Time: 24 - 48 Hours</span>
          </span>
        </div>
      </div>

      {/* 3 Status Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilterUrgency(filterUrgency === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterUrgency === 'CRITICAL'
              ? 'bg-[#FEF3F2] border-[#F04438] ring-2 ring-[#FECDCA]'
              : 'bg-white border-[#E4EAF1] hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-[#B42318] uppercase tracking-wider">
            <span>Critical Stockout Risk</span>
            <AlertTriangle className="w-4 h-4 text-[#F04438]" />
          </div>
          <div className="text-2xl font-extrabold text-[#B42318] mt-2 tabular-nums">
            {criticalCount} <span className="text-xs font-normal text-[#667085]">items</span>
          </div>
          <div className="text-[11px] text-[#B42318] font-semibold mt-1">
            Depleting in &lt; 3.0 days
          </div>
        </button>

        <button
          onClick={() => setFilterUrgency(filterUrgency === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterUrgency === 'LOW_STOCK'
              ? 'bg-[#FFF9EB] border-[#F79009] ring-2 ring-[#FEF0C7]'
              : 'bg-white border-[#E4EAF1] hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-[#B54708] uppercase tracking-wider">
            <span>Low Stock Warning</span>
            <Clock className="w-4 h-4 text-[#F79009]" />
          </div>
          <div className="text-2xl font-extrabold text-[#B54708] mt-2 tabular-nums">
            {lowCount} <span className="text-xs font-normal text-[#667085]">items</span>
          </div>
          <div className="text-[11px] text-[#B54708] font-semibold mt-1">
            Depleting in 3.0 - 7.0 days
          </div>
        </button>

        <button
          onClick={() => setFilterUrgency(filterUrgency === 'HEALTHY' ? 'ALL' : 'HEALTHY')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterUrgency === 'HEALTHY'
              ? 'bg-[#ECFDF3] border-[#12B76A] ring-2 ring-[#A6F4C5]'
              : 'bg-white border-[#E4EAF1] hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-[#027A48] uppercase tracking-wider">
            <span>Healthy Inventory</span>
            <CheckCircle2 className="w-4 h-4 text-[#12B76A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#027A48] mt-2 tabular-nums">
            {healthyCount} <span className="text-xs font-normal text-[#667085]">items</span>
          </div>
          <div className="text-[11px] text-[#027A48] font-semibold mt-1">
            &gt; 7.0 days of supply available
          </div>
        </button>
      </div>

      {/* Product Catalog Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#10243A]">
              Catalogue Velocity & Automated Reorder Planner
            </h2>
            <p className="text-xs text-[#667085]">
              Derived from 90-day transactions and minimum safety buffers
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Product / SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E4EAF1] text-xs focus:outline-none focus:border-[#00BAF2] bg-[#F8FAFC]"
              />
            </div>

            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E4EAF1] text-xs font-semibold bg-[#F8FAFC] text-[#344054]"
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
              <tr className="border-b border-[#E4EAF1] text-[#667085] font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Product Name & Category</th>
                <th className="pb-3 text-center">Stock Buffer</th>
                <th className="pb-3 text-center">Daily Velocity</th>
                <th className="pb-3 text-center">Est. Supply</th>
                <th className="pb-3 text-center">Reorder Qty</th>
                <th className="pb-3">Why This Recommendation?</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {filteredItems.map((item) => {
                const isCrit = item.priority === 'CRITICAL';
                const isLow = item.priority === 'LOW_STOCK';
                const stockPct = Math.min(100, Math.round((item.current_stock / item.min_threshold) * 100));

                return (
                  <tr key={item.sku} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-[#10243A]">{item.name}</div>
                      <div className="text-[10px] text-[#667085] font-mono mt-0.5">{item.sku} • {item.category}</div>
                    </td>

                    <td className="py-3.5 text-center">
                      <div className="font-extrabold text-[#10243A] tabular-nums">{item.current_stock}</div>
                      <div className="w-16 h-1.5 bg-[#F2F4F7] rounded-full mx-auto mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            isCrit ? 'bg-[#F04438]' : isLow ? 'bg-[#F79009]' : 'bg-[#12B76A]'
                          }`}
                          style={{ width: `${stockPct}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-[#667085] mt-0.5">Min: {item.min_threshold}</div>
                    </td>

                    <td className="py-3.5 text-center font-semibold text-[#344054] tabular-nums">
                      ~{item.daily_sales_velocity} /day
                    </td>

                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${
                        isCrit
                          ? 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] animate-pulse'
                          : isLow
                          ? 'bg-[#FFF9EB] text-[#B54708] border border-[#FEF0C7]'
                          : 'bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]'
                      }`}>
                        {item.estimated_days_remaining} days
                      </span>
                    </td>

                    <td className="py-3.5 text-center font-bold text-[#002970] tabular-nums">
                      {item.suggested_reorder_qty} units
                      <div className="text-[10px] text-[#667085] font-normal">₹{item.estimated_reorder_cost}</div>
                    </td>

                    <td className="py-3.5 text-[#475467] max-w-xs text-[11px] leading-relaxed">
                      {item.why_recommendation}
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleOpenReorder(item)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                          isCrit
                            ? 'bg-[#F04438] hover:bg-[#D92D20] text-white shadow-xs'
                            : isLow
                            ? 'bg-[#F79009] hover:bg-[#DC6803] text-white shadow-xs'
                            : 'bg-[#EBF7FF] hover:bg-[#D1E9FF] text-[#002970]'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-[#002970] to-[#00BAF2] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">Simulate Supplier Purchase Order</h3>
                <p className="text-xs text-sky-100">Instant Demo Inventory Update</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-1.5 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Product</div>
                <div className="text-sm font-bold text-[#10243A] mt-0.5">{selectedProduct.name}</div>
                <div className="text-xs text-[#667085]">Supplier: {selectedProduct.supplier_name}</div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block mb-1">
                  Reorder Quantity (Units)
                </label>
                <input
                  type="number"
                  value={reorderQty}
                  onChange={(e) => setReorderQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4EAF1] text-sm font-bold text-[#10243A] focus:outline-none focus:border-[#00BAF2]"
                />
                <div className="text-xs text-[#667085] mt-1">
                  Estimated PO Cost: ₹{(reorderQty * selectedProduct.unit_cost).toLocaleString()}
                </div>
              </div>

              {reorderSuccessMsg ? (
                <div className="p-3 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12B76A] shrink-0" />
                  <span>{reorderSuccessMsg}</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#F8FAFC] text-[11px] text-[#475467] border border-[#E4EAF1]">
                  ℹ️ This is a simulated demo transaction that updates the persistent SQLite database immediately.
                </div>
              )}

              <button
                onClick={handleConfirmReorder}
                disabled={Boolean(reorderSuccessMsg)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#002970] to-[#00BAF2] text-white font-bold text-xs shadow-fintech-sm hover:opacity-95 transition-all disabled:opacity-50"
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
