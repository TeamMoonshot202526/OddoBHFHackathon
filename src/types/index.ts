export type ClientMode = 'early_alert' | 'critical_alert' | 'learning' | 'alpha';
export type Persona = 'hedge_fund' | 'asset_manager' | 'pension_fund' | 'family_office' | 'corporate_treasury';
export type Tier = 'new' | 'existing';
export type PreferredChannel = 'email' | 'bloomberg_chat' | 'teams_chat' | 'call';
export type Sentiment = 'positive' | 'negative' | 'neutral';
export type Urgency = 'low' | 'medium' | 'high';
export type EventSource = 'quick_take' | 'daily_digest';
export type FunnelStage = 'new_signals' | 'recommended_action' | 'executed' | 'awaiting_response' | 'converted';

export interface Client {
  client_id: string;
  client_name: string;
  tier: Tier;
  persona: Persona;
  region: string;
  sector_interest: string;
  rm_name: string;
  preferred_channel: PreferredChannel;
  relationship_score: number;
  current_mode?: ClientMode;
  confidence?: number;
  funnel_stage: FunnelStage;
  last_contact?: string;
}

export interface NewsEvent {
  event_id: string;
  source: EventSource;
  timestamp: string;
  sector: string;
  company: string;
  title: string;
  summary: string;
  sentiment: Sentiment;
  urgency: Urgency;
  event_type: string;
}

export interface Signal {
  signal_id: string;
  client_id: string;
  timestamp: string;
  signal_type: string;
  signal_value: number;
  related_event_id?: string;
  related_sector?: string;
  related_company?: string;
}

export interface EngagementLog {
  log_id: string;
  client_id: string;
  timestamp: string;
  action_type: 'email_sent' | 'chat_message' | 'meeting_booked' | 'call_made' | 'availability_notified';
  details: string;
  outcome?: 'meeting_booked' | 'client_responded' | 'no_response' | 'alert_resolved' | 'escalated';
}

export interface ModeScores {
  early_alert_score: number;
  critical_alert_score: number;
  learning_score: number;
  alpha_score: number;
}

export interface IntentClassification {
  mode: ClientMode;
  confidence: number;
  scores: ModeScores;
  top_signals: { signal: string; contribution: number; reason: string }[];
}

export interface EngagementPlan {
  why_now: string;
  preferred_channel: PreferredChannel;
  tone: 'conservative' | 'balanced' | 'aggressive';
  what_to_send: string;
  next_step: string;
  cadence: {
    day0: string;
    day1: string;
    day3: string;
  };
  content_asset?: string;
}

export interface ClientImpact {
  client: Client;
  relevance_score: number;
  predicted_mode_impact: ClientMode;
  confidence: number;
  recommended_action: string;
}
