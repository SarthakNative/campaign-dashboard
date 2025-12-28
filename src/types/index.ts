export interface Campaign {
  id: string;
  name: string;
  brand_id: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  daily_budget: number;
  platforms: string[];
  created_at: string;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  total: number;
}

export interface SingleCampaignResponse {
  campaign: Campaign;
}

export interface OverallInsights {
  timestamp: string;
  total_campaigns: number;
  active_campaigns: number;
  paused_campaigns: number;
  completed_campaigns: number;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_spend: number;
  avg_ctr: number;
  avg_cpc: number;
  avg_conversion_rate: number;
}

// Add this interface if not already present
export interface EventSourceError {
  type: string;
  message?: string;
}

// Update CampaignInsights interface to include optional properties for real-time updates
export interface CampaignInsights {
  campaign_id: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
  // Optional fields for real-time updates
  updated_at?: string;
  delta_impressions?: number;
  delta_clicks?: number;
}

export interface InsightsResponse {
  insights: OverallInsights | CampaignInsights;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  path?: string;
}

export interface RateLimitError extends ApiError {
  retry_after: number;
}

export interface CampaignState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  total: number;
  loading: boolean;
  error: ApiError | RateLimitError | null;
}

export interface InsightsState {
  overallInsights: OverallInsights | null;
  campaignInsights: Record<string, CampaignInsights>;
  loading: boolean;
  error: ApiError | RateLimitError | null;
}

export interface UIState {
  errorDialog: {
    open: boolean;
    error: ApiError | RateLimitError | null;
  };
}

