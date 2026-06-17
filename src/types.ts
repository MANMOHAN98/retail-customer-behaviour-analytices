export interface RawShopper {
  customerID: string;
  Age: number;
  Gender: string;
  Category: string;
  "Purchase Amount": string | number; // Messy (NaN/string or empty)
  Frequency: string;
  LoyaltyCard: string; // Messy (Yes/No or random)
  PaymentMethod: string;
  Season: string;
}

export interface CleanShopper {
  customer_id: string;
  age: number;
  age_segment: string;
  gender: string;
  category: string;
  purchase_amount: number;
  frequency: string;
  frequency_days: number;
  loyalty_card: boolean;
  payment_method: string;
  season: string;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, string | number | boolean>[];
  executionTimeMs: number;
  rowCount: number;
}

export interface PresetQuery {
  id: string;
  title: string;
  description: string;
  sql: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface PresentationSlide {
  id: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  visualType: 'stats' | 'chart' | 'pipeline' | 'conclusion';
  data?: Record<string, string | number>[];
}
