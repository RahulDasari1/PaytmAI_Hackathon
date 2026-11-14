import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Package, Search, X } from 'lucide-react';
import { InventoryItem, Language } from '../types';
import { api } from '../services/api';
import { PageHeader } from '../components/PageHeader';

interface InventoryPageProps {
  language: Language;
  onRefreshCriticalCount?: (count: number) => void;
}

const pageCopy: Record<Language, {
  intro: string;
  explain: string;
  critical: string;
  low: string;
  okay: string;
  search: string;
  category: string;
  allCategories: string;
  stock: string;
  runsOut: string;
  suggested: string;
  updateStock: string;
  empty: string;
  loadError: string;
  retry: string;
  demoAction: string;
  addStock: string;
  product: string;
  quantity: string;
  estimatedCost: string;
  demoExplanation: string;
  confirm: string;
  updated: string;
  actionError: string;
  close: string;
  days: string;
  units: string;
}> = {
  en: {
    intro: 'Stock',
    explain: 'See what may run out soon and update your demo stock.',
    critical: 'May run out soon',
    low: 'Getting low',
    okay: 'Enough for now',
    search: 'Find an item',
    category: 'Choose a category',
    allCategories: 'All items',
    stock: 'In stock',
    runsOut: 'May run out in',
    suggested: 'Suggested to add',
    updateStock: 'Update demo stock',
    empty: 'No items match this choice.',
    loadError: 'We could not load your stock. Please try again.',
    retry: 'Try again',
    demoAction: 'Demo stock updated.',
    addStock: 'Add to demo stock',
    product: 'Item',
    quantity: 'How many to add?',
    estimatedCost: 'Estimated value',
    demoExplanation: 'Demo only. This changes sample stock; no supplier is contacted and no order is placed.',
    confirm: 'Update sample stock',
    updated: 'Sample stock updated',
    actionError: 'We could not update the demo stock. Please try again.',
    close: 'Close',
    days: 'days',
    units: 'items'
  },
  hi: {
    intro: 'स्टॉक',
    explain: 'देखें कौन-सा सामान जल्दी खत्म हो सकता है। यह सिर्फ़ डेमो स्टॉक है।',
    critical: 'जल्दी खत्म हो सकता है',
    low: 'कम हो रहा है',
    okay: 'अभी पर्याप्त है',
    search: 'सामान खोजें',
    category: 'श्रेणी चुनें',
    allCategories: 'सारा सामान',
    stock: 'मौजूद',
    runsOut: 'इतने दिन में खत्म हो सकता है',
    suggested: 'इतना और जोड़ें',
    updateStock: 'डेमो स्टॉक बदलें',
    empty: 'इस चुनाव में कोई सामान नहीं मिला।',
    loadError: 'स्टॉक की जानकारी नहीं आ पाई। कृपया फिर कोशिश करें।',
    retry: 'फिर कोशिश करें',
    demoAction: 'डेमो स्टॉक बदल गया।',
    addStock: 'डेमो स्टॉक में जोड़ें',
    product: 'सामान',
    quantity: 'कितना जोड़ना है?',
    estimatedCost: 'अनुमानित कीमत',
    demoExplanation: 'यह सिर्फ़ डेमो है। इससे नमूना स्टॉक बदलेगा; सप्लायर से संपर्क या ऑर्डर नहीं होगा।',
    confirm: 'नमूना स्टॉक बदलें',
    updated: 'नमूना स्टॉक बदल गया',
    actionError: 'डेमो स्टॉक नहीं बदल पाया। कृपया फिर कोशिश करें।',
    close: 'बंद करें',
    days: 'दिन',
    units: 'आइटम'
  },
  te: {
    intro: 'స్టాక్',
    explain: 'ఏ వస్తువులు త్వరలో అయిపోవచ్చో చూడండి. ఇది డెమో స్టాక్ మాత్రమే.',
    critical: 'త్వరలో అయిపోవచ్చు',
    low: 'తగ్గుతోంది',
    okay: 'ప్రస్తుతానికి సరిపోతుంది',
    search: 'వస్తువును వెతకండి',
    category: 'వర్గాన్ని ఎంచుకోండి',
    allCategories: 'అన్ని వస్తువులు',
    stock: 'ఉన్న స్టాక్',
    runsOut: 'రోజుల్లో అయిపోవచ్చు',
    suggested: 'ఇంకా జోడించండి',
    updateStock: 'డెమో స్టాక్ మార్చండి',
    empty: 'ఈ ఎంపికలో వస్తువులు లేవు.',
    loadError: 'స్టాక్ వివరాలు లోడ్ కాలేదు. మళ్లీ ప్రయత్నించండి.',
    retry: 'మళ్లీ ప్రయత్నించండి',
    demoAction: 'డెమో స్టాక్ మార్చబడింది.',
    addStock: 'డెమో స్టాక్‌కు జోడించండి',
    product: 'వస్తువు',
    quantity: 'ఎన్ని జోడించాలి?',
    estimatedCost: 'అంచనా విలువ',
    demoExplanation: 'డెమో మాత్రమే. నమూనా స్టాక్ మారుతుంది; సరఫరాదారుని సంప్రదించదు, ఆర్డర్ చేయదు.',
    confirm: 'నమూనా స్టాక్ మార్చండి',
    updated: 'నమూనా స్టాక్ మార్చబడింది',
    actionError: 'డెమో స్టాక్ మార్చలేకపోయాం. మళ్లీ ప్రయత్నించండి.',
    close: 'మూసివేయండి',
    days: 'రోజులు',
    units: 'వస్తువులు'
  }
};

const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(amount);

export const InventoryPage: React.FC<InventoryPageProps> = ({ language, onRefreshCriticalCount }) => {
  const copy = pageCopy[language];
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [reorderQty, setReorderQty] = useState(30);
  const [reorderSuccess, setReorderSuccess] = useState(false);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await api.getInventory('ALL', 'ALL');
      setInventory(data);
      onRefreshCriticalCount?.(data.filter((item) => item.priority === 'CRITICAL').length);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [onRefreshCriticalCount]);

  useEffect(() => {
    let active = true;
    api.getInventory('ALL', 'ALL')
      .then((data) => {
        if (!active) return;
        setInventory(data);
        onRefreshCriticalCount?.(data.filter((item) => item.priority === 'CRITICAL').length);
      })
      .catch((error: unknown) => {
        console.error('Failed to load inventory:', error);
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [onRefreshCriticalCount]);

  const categories = useMemo(
    () => Array.from(new Set(inventory.map((item) => item.category))).sort(),
    [inventory]
  );
  const counts = {
    critical: inventory.filter((item) => item.priority === 'CRITICAL').length,
    low: inventory.filter((item) => item.priority === 'LOW_STOCK').length,
    okay: inventory.filter((item) => item.priority === 'HEALTHY').length
  };
  const filteredItems = inventory.filter((item) => {
    const matchesUrgency = filterUrgency === 'ALL' || item.priority === filterUrgency;
    const matchesCategory = filterCat === 'ALL' || item.category === filterCat;
    const query = searchQuery.trim().toLocaleLowerCase();
    const matchesSearch = !query || item.name.toLocaleLowerCase().includes(query);
    return matchesUrgency && matchesCategory && matchesSearch;
  });

  const handleOpenReorder = (item: InventoryItem) => {
    setSelectedProduct(item);
    setReorderQty(item.suggested_reorder_qty);
    setActionError(false);
    setReorderSuccess(false);
  };

  const handleConfirmReorder = async () => {
    if (!selectedProduct || reorderQty < 1 || saving) return;
    setSaving(true);
    setActionError(false);
    try {
      await api.reorderProduct(selectedProduct.sku, reorderQty);
      setReorderSuccess(true);
      await loadInventory();
    } catch (error) {
      console.error('Demo stock update failed:', error);
      setActionError(true);
    } finally {
      setSaving(false);
    }
  };

  const closeDialog = () => {
    setSelectedProduct(null);
    setReorderSuccess(false);
    setActionError(false);
  };

  const filters = [
    { id: 'CRITICAL', label: copy.critical, count: counts.critical, icon: AlertTriangle, activeClass: 'border-[#F04438] bg-[#FEF3F2] text-[#B42318]', iconClass: 'text-[#F04438]' },
    { id: 'LOW_STOCK', label: copy.low, count: counts.low, icon: Package, activeClass: 'border-[#F79009] bg-[#FFF9EB] text-[#B54708]', iconClass: 'text-[#F79009]' },
    { id: 'HEALTHY', label: copy.okay, count: counts.okay, icon: CheckCircle2, activeClass: 'border-[#12B76A] bg-[#ECFDF3] text-[#027A48]', iconClass: 'text-[#12B76A]' }
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-3">
      <PageHeader
        eyebrow={language === 'hi' ? 'दुकान का स्टॉक' : language === 'te' ? 'దుకాణం స్టాక్' : 'Shop stock'}
        icon={Package}
        title={copy.intro}
        description={copy.explain}
      />

      <section className="grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label={copy.intro}>
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = filterUrgency === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setFilterUrgency(isActive ? 'ALL' : filter.id)}
              aria-pressed={isActive}
              className={`flex min-h-[76px] items-center gap-3 rounded-[22px] border bg-white px-4 py-3 text-left shadow-[0_8px_24px_-22px_rgba(16,36,58,0.65)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2] ${
                isActive ? `${filter.activeClass} ring-2 ring-white shadow-[0_8px_22px_-16px_rgba(0,41,112,0.45)]` : 'border-[#E4EAF1] text-[#344054] hover:-translate-y-0.5 hover:border-[#B9E6FE] hover:bg-[#F8FCFF]'
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${filter.activeClass}`}>
                <Icon className={`h-5 w-5 ${filter.iconClass}`} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold">{filter.label}</span>
              <span className="text-lg font-extrabold tabular-nums">{filter.count}</span>
            </button>
          );
        })}
      </section>

      <section aria-label={copy.intro}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{copy.search}</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={copy.search}
              className="min-h-11 w-full rounded-xl border border-[#D0D5DD] bg-white pl-10 pr-3 text-sm text-[#10243A] placeholder:text-[#667085] focus:border-[#00BAF2] focus:outline-none focus:ring-2 focus:ring-[#B9E6FE]"
            />
          </label>
          <label>
            <span className="sr-only">{copy.category}</span>
            <select
              value={filterCat}
              onChange={(event) => setFilterCat(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-[#D0D5DD] bg-white px-3 text-sm font-semibold text-[#344054] focus:border-[#00BAF2] focus:outline-none focus:ring-2 focus:ring-[#B9E6FE] sm:w-56"
            >
              <option value="ALL">{copy.allCategories}</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
        </div>

        {loadError ? (
          <div className="rounded-2xl border border-[#FECDCA] bg-white p-5 text-sm text-[#B42318]" role="alert">
            <p>{copy.loadError}</p>
            <button type="button" onClick={() => void loadInventory()} className="mt-3 min-h-10 rounded-xl bg-[#FEF3F2] px-4 font-bold">
              {copy.retry}
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3" aria-label={copy.intro}>
            <div className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-[#E4EAF1]" />
            <div className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-[#E4EAF1]" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-[#E4EAF1] bg-white p-6 text-center text-sm text-[#475467]">
            {copy.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {filteredItems.map((item) => {
              const isCritical = item.priority === 'CRITICAL';
              const isLow = item.priority === 'LOW_STOCK';
              const statusClass = isCritical
                ? 'bg-[#FEF3F2] text-[#B42318]'
                : isLow
                  ? 'bg-[#FFF9EB] text-[#B54708]'
                  : 'bg-[#ECFDF3] text-[#027A48]';
              const statusLabel = isCritical ? copy.critical : isLow ? copy.low : copy.okay;
              const stockLevel = Math.max(10, Math.min(100, (item.estimated_days_remaining / 14) * 100));
              const stockBar = isCritical ? 'bg-[#F04438]' : isLow ? 'bg-[#F79009]' : 'bg-[#12B76A]';

              return (
                <article key={item.sku} className="relative overflow-hidden rounded-[24px] border border-[#E2EAF1] bg-white p-4 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.65)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-24px_rgba(0,41,112,0.4)] sm:p-5">
                  <div className={`absolute inset-y-0 left-0 w-1 ${stockBar}`} aria-hidden="true" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${statusClass}`}>
                          <Package className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-base font-bold text-[#10243A]">{item.name}</h2>
                          <p className="mt-0.5 text-xs text-[#667085]">{item.category}</p>
                        </div>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusClass}`}>{statusLabel}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#E4EAF1] pt-3">
                    <div>
                      <p className="text-xs text-[#667085]">{copy.stock}</p>
                      <p className="mt-0.5 text-lg font-extrabold tabular-nums text-[#10243A]">{item.current_stock} <span className="text-xs font-medium text-[#667085]">{copy.units}</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-[#667085]">{copy.runsOut}</p>
                      <p className="mt-0.5 text-lg font-extrabold tabular-nums text-[#10243A]">{item.estimated_days_remaining} <span className="text-xs font-medium text-[#667085]">{copy.days}</span></p>
                    </div>
                  </div>
                  <div className="mt-3" role="img" aria-label={`${item.estimated_days_remaining} ${copy.days} of stock remaining`}>
                    <div className="h-2 overflow-hidden rounded-full bg-[#EEF2F6]">
                      <div className={`h-full rounded-full ${stockBar}`} style={{ width: `${stockLevel}%` }} />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 border-t border-[#E4EAF1] pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-[#475467]">
                      {copy.suggested}: <span className="font-bold text-[#10243A]">{item.suggested_reorder_qty} {copy.units}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenReorder(item)}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#002970] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0F3B8C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAF2] sm:w-auto"
                    >
                      {copy.updateStock}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) closeDialog();
          }}
        >
          <section
            className="w-full max-w-md rounded-t-3xl border border-[#E4EAF1] bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stock-update-title"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="stock-update-title" className="text-lg font-extrabold text-[#10243A]">{copy.addStock}</h2>
                <p className="mt-1 text-sm text-[#667085]">{selectedProduct.name}</p>
              </div>
              <button type="button" onClick={closeDialog} disabled={saving} aria-label={copy.close} className="rounded-lg p-2 text-[#667085] hover:bg-[#F2F4F7] disabled:opacity-50">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-[#344054]">
                {copy.quantity}
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={reorderQty}
                  onChange={(event) => setReorderQty(Math.max(0, Number(event.target.value)))}
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-[#D0D5DD] px-3 text-base text-[#10243A] focus:border-[#00BAF2] focus:outline-none focus:ring-2 focus:ring-[#B9E6FE]"
                />
              </label>
              <p className="text-sm text-[#475467]">
                {copy.estimatedCost}: <span className="font-bold text-[#10243A]">{formatINR(reorderQty * selectedProduct.unit_cost)}</span>
              </p>
              <p className="rounded-xl border border-[#FEF0C7] bg-[#FFFCF5] p-3 text-sm leading-relaxed text-[#7A2E0E]">{copy.demoExplanation}</p>

              {reorderSuccess && (
                <p className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-3 text-sm font-semibold text-[#027A48]" role="status">{copy.demoAction}</p>
              )}
              {actionError && (
                <p className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] p-3 text-sm text-[#B42318]" role="alert">{copy.actionError}</p>
              )}

              <div className="flex gap-2">
                <button type="button" onClick={closeDialog} disabled={saving} className="min-h-11 flex-1 rounded-xl border border-[#D0D5DD] px-4 text-sm font-bold text-[#344054]">
                  {copy.close}
                </button>
                <button
                  type="button"
                  onClick={() => void handleConfirmReorder()}
                  disabled={saving || reorderQty < 1 || reorderSuccess}
                  className="min-h-11 flex-1 rounded-xl bg-[#002970] px-4 text-sm font-bold text-white hover:bg-[#0F3B8C] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reorderSuccess ? copy.updated : copy.confirm}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
