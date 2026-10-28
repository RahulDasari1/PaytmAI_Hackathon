export type Language = 'en' | 'hi' | 'te';

export interface DateRangeInfo {
  start: string;
  end: string;
  prev_start: string;
  prev_end: string;
}

export interface GrowthMetrics {
  sales_pct: number;
  txns_pct: number;
  aov_pct: number;
}

export interface DashboardSummary {
  period: string;
  date_range: DateRangeInfo;
  total_sales: number;
  transaction_count: number;
  average_order_value: number;
  repeat_customer_rate: number;
  previous_period: {
    total_sales: number;
    transaction_count: number;
    average_order_value: number;
  };
  growth: GrowthMetrics;
}

export interface SalesTrendItem {
  date?: string;
  day_name?: string;
  label: string;
  sales: number;
  transactions: number;
}

export interface PaymentBreakdownItem {
  payment_method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface CategoryPerformanceItem {
  category: string;
  revenue: number;
  orders: number;
  units: number;
  share_pct: number;
  growth_pct: number;
  top_product: string;
}

export interface ProductPerformanceItem {
  product_name: string;
  category: string;
  revenue: number;
  units_sold: number;
  order_count: number;
  avg_order_value: number;
}

export interface RecommendationItem {
  id: string;
  type: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  insight: string;
  supporting_metric: string;
  recommended_action: string;
  expected_benefit: string;
  evidence_level: string;
  cta_label: string;
  cta_action: string;
}

export interface TransactionItem {
  transaction_id: string;
  timestamp: string;
  amount: number;
  category: string;
  product_name: string;
  quantity: number;
  payment_method: string;
  customer_id: string;
  status: string;
}

export interface CustomerSegmentItem {
  segment: string;
  customer_count: number;
  total_revenue: number;
  avg_frequency: number;
  avg_recency: number;
}

export interface InactiveCustomerItem {
  customer_id: string;
  days_inactive: number;
  prior_visits: number;
  lifetime_spend: number;
  favorite_category: string;
  suggested_action: string;
}

export interface CustomerInsightsData {
  metrics: {
    total_tracked_customers: number;
    active_last_14d: number;
    at_risk_inactive: number;
    retention_rate_pct: number;
  };
  segments: CustomerSegmentItem[];
  inactive_customers: InactiveCustomerItem[];
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  current_stock: number;
  min_threshold: number;
  daily_sales_velocity: number;
  estimated_days_remaining: number;
  suggested_reorder_qty: number;
  priority: 'CRITICAL' | 'LOW_STOCK' | 'HEALTHY';
  unit_cost: number;
  unit_price: number;
  estimated_reorder_cost: number;
  supplier_name: string;
  last_reordered_at: string;
  why_recommendation: string;
}

export interface CampaignItem {
  id: string;
  name: string;
  objective: string;
  audience_segment: string;
  offer_type: string;
  channel: string;
  language: Language;
  message_copy: string;
  offer_details: string;
  suggested_timing: string;
  rationale: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  target_customer_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  tool_called?: string;
  tool_data?: any;
  recommended_action?: string;
  cta_label?: string;
  timestamp: string;
}

export interface SystemStatus {
  store_profile: {
    name: string;
    category: string;
    city: string;
    upi_id: string;
    soundbox_id: string;
  };
  ai_engine: {
    mode: string;
    active: boolean;
    label: string;
    model: string;
  };
  database_metrics: {
    transactions_count: number;
    inventory_products_count: number;
    saved_campaigns_count: number;
  };
  mode: string;
}
