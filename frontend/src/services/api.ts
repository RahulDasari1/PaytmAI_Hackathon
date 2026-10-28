import {
  DashboardSummary,
  SalesTrendItem,
  PaymentBreakdownItem,
  CategoryPerformanceItem,
  ProductPerformanceItem,
  RecommendationItem,
  TransactionItem,
  CustomerInsightsData,
  InventoryItem,
  CampaignItem,
  ChatMessage,
  SystemStatus,
  Language
} from '../types';

const API_BASE = 'http://localhost:8000/api';

export const api = {
  // Dashboard
  getSummary: async (rangeKey: string = '7d', start?: string, end?: string): Promise<DashboardSummary> => {
    const params = new URLSearchParams({ range_key: rangeKey });
    if (start && end) {
      params.append('start', start);
      params.append('end', end);
    }
    const res = await fetch(`${API_BASE}/dashboard/summary?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch summary');
    return res.json();
  },

  getTrends: async (rangeKey: string = '7d', start?: string, end?: string): Promise<SalesTrendItem[]> => {
    const params = new URLSearchParams({ range_key: rangeKey });
    if (start && end) {
      params.append('start', start);
      params.append('end', end);
    }
    const res = await fetch(`${API_BASE}/dashboard/trends?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch trends');
    return res.json();
  },

  getPayments: async (rangeKey: string = '7d'): Promise<PaymentBreakdownItem[]> => {
    const res = await fetch(`${API_BASE}/dashboard/payments?range_key=${rangeKey}`);
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  },

  getCategories: async (rangeKey: string = '7d'): Promise<CategoryPerformanceItem[]> => {
    const res = await fetch(`${API_BASE}/dashboard/categories?range_key=${rangeKey}`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  getProducts: async (rangeKey: string = '7d', limit: number = 8): Promise<ProductPerformanceItem[]> => {
    const res = await fetch(`${API_BASE}/dashboard/products?range_key=${rangeKey}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  getRecommendations: async (): Promise<RecommendationItem[]> => {
    const res = await fetch(`${API_BASE}/dashboard/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  getRecentTransactions: async (limit: number = 8): Promise<TransactionItem[]> => {
    const res = await fetch(`${API_BASE}/dashboard/recent-transactions?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch recent transactions');
    return res.json();
  },

  // Copilot
  askCopilot: async (query: string, language: Language = 'en'): Promise<any> => {
    const res = await fetch(`${API_BASE}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language }),
    });
    if (!res.ok) throw new Error('Failed to execute copilot query');
    return res.json();
  },

  getSuggestions: async (language: Language = 'en'): Promise<string[]> => {
    const res = await fetch(`${API_BASE}/copilot/suggestions?language=${language}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Customer Insights
  getCustomers: async (rangeKey: string = '30d'): Promise<CustomerInsightsData> => {
    const res = await fetch(`${API_BASE}/customers/insights?range_key=${rangeKey}`);
    if (!res.ok) throw new Error('Failed to fetch customer insights');
    return res.json();
  },

  // Inventory
  getInventory: async (urgency: string = 'ALL', category: string = 'ALL'): Promise<InventoryItem[]> => {
    const params = new URLSearchParams({ urgency, category });
    const res = await fetch(`${API_BASE}/inventory?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
  },

  reorderProduct: async (sku: string, quantity?: number): Promise<any> => {
    const res = await fetch(`${API_BASE}/inventory/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, quantity }),
    });
    if (!res.ok) throw new Error('Failed to reorder product');
    return res.json();
  },

  // Campaigns
  getCampaigns: async (): Promise<CampaignItem[]> => {
    const res = await fetch(`${API_BASE}/campaigns`);
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    return res.json();
  },

  generateCampaignDraft: async (payload: {
    objective?: string;
    audience_segment?: string;
    offer_type?: string;
    language?: Language;
    channel?: string;
  }): Promise<CampaignItem> => {
    const res = await fetch(`${API_BASE}/campaigns/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate draft');
    return res.json();
  },

  saveCampaign: async (campaign: Partial<CampaignItem>): Promise<any> => {
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign),
    });
    if (!res.ok) throw new Error('Failed to save campaign');
    return res.json();
  },

  deleteCampaign: async (id: string): Promise<any> => {
    const res = await fetch(`${API_BASE}/campaigns/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete campaign');
    return res.json();
  },

  // Demo state & system
  getSystemStatus: async (): Promise<SystemStatus> => {
    const res = await fetch(`${API_BASE}/demo/status`);
    if (!res.ok) throw new Error('Failed to fetch system status');
    return res.json();
  },

  getJudgeDemoScenario: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/demo/scenario`);
    if (!res.ok) throw new Error('Failed to fetch demo scenario');
    return res.json();
  },

  resetDemoData: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  }
};
