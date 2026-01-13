import { Client, NewsEvent, Signal } from '@/types';

export const initialClients: Client[] = [
  {
    client_id: 'client_001',
    client_name: 'Orion Capital Partners',
    tier: 'existing',
    persona: 'hedge_fund',
    region: 'DE',
    sector_interest: 'Energy',
    rm_name: 'Marcus Weber',
    preferred_channel: 'bloomberg_chat',
    relationship_score: 85,
    funnel_stage: 'new_signals',
    last_contact: '2026-01-07',
  },
  {
    client_id: 'client_002',
    client_name: 'Helios Asset Management',
    tier: 'new',
    persona: 'asset_manager',
    region: 'FR',
    sector_interest: 'Industrials',
    rm_name: 'Sophie Laurent',
    preferred_channel: 'email',
    relationship_score: 58,
    funnel_stage: 'new_signals',
    last_contact: '2026-01-06',
  },
  {
    client_id: 'client_003',
    client_name: 'Atlas Pension Fund',
    tier: 'existing',
    persona: 'pension_fund',
    region: 'UK',
    sector_interest: 'Media',
    rm_name: 'James Fletcher',
    preferred_channel: 'email',
    relationship_score: 72,
    funnel_stage: 'recommended_action',
    last_contact: '2026-01-06',
  },
  {
    client_id: 'client_004',
    client_name: 'Rhein Family Office',
    tier: 'existing',
    persona: 'family_office',
    region: 'DE',
    sector_interest: 'Consumer',
    rm_name: 'Anna Keller',
    preferred_channel: 'call',
    relationship_score: 90,
    funnel_stage: 'recommended_action',
    last_contact: '2026-01-05',
  },
  {
    client_id: 'client_005',
    client_name: 'NorthStar Treasury Group',
    tier: 'new',
    persona: 'corporate_treasury',
    region: 'NL',
    sector_interest: 'Financials',
    rm_name: 'Lars de Vries',
    preferred_channel: 'teams_chat',
    relationship_score: 46,
    funnel_stage: 'executed',
    last_contact: '2026-01-05',
  },
  {
    client_id: 'client_006',
    client_name: 'SilverLine Wealth Partners',
    tier: 'existing',
    persona: 'asset_manager',
    region: 'CH',
    sector_interest: 'Healthcare',
    rm_name: 'Elena Rossi',
    preferred_channel: 'email',
    relationship_score: 77,
    funnel_stage: 'executed',
    last_contact: '2026-01-04',
  },
  {
    client_id: 'client_007',
    client_name: 'Borealis Macro Fund',
    tier: 'existing',
    persona: 'hedge_fund',
    region: 'US',
    sector_interest: 'Rates',
    rm_name: 'Tom Harris',
    preferred_channel: 'bloomberg_chat',
    relationship_score: 66,
    funnel_stage: 'awaiting_response',
    last_contact: '2026-01-04',
  },
  {
    client_id: 'client_008',
    client_name: 'Evergreen Retirement Trust',
    tier: 'new',
    persona: 'pension_fund',
    region: 'SE',
    sector_interest: 'Utilities',
    rm_name: 'Maja Lind',
    preferred_channel: 'email',
    relationship_score: 52,
    funnel_stage: 'awaiting_response',
    last_contact: '2026-01-03',
  },
  {
    client_id: 'client_009',
    client_name: 'Summit Global Advisors',
    tier: 'existing',
    persona: 'asset_manager',
    region: 'ES',
    sector_interest: 'Technology',
    rm_name: 'Carlos Moreno',
    preferred_channel: 'call',
    relationship_score: 81,
    funnel_stage: 'converted',
    last_contact: '2026-01-03',
  },
  {
    client_id: 'client_010',
    client_name: 'Cedar Ridge Family Office',
    tier: 'existing',
    persona: 'family_office',
    region: 'IT',
    sector_interest: 'Media',
    rm_name: 'Giulia Bianchi',
    preferred_channel: 'email',
    relationship_score: 88,
    funnel_stage: 'converted',
    last_contact: '2026-01-02',
  },
];


export const initialEvents: NewsEvent[] = [
  {
    event_id: 'EVT_001',
    source: 'quick_take',
    timestamp: '2026-01-07T09:10:00Z',
    sector: 'Industrials',
    company: 'Alstom',
    title: 'New contract worth €920m (Mexico)',
    summary: 'Alstom signed a €920m contract including 5-year maintenance; supports strong order intake and medium-term cash flow visibility.',
    sentiment: 'positive',
    urgency: 'medium',
    event_type: 'contract',
  },
  {
    event_id: 'EVT_002',
    source: 'quick_take',
    timestamp: '2026-01-07T08:35:00Z',
    sector: 'Energy',
    company: 'BP',
    title: 'Confirms sale of 65% of Castrol',
    summary: 'BP agreed to sell 65% of Castrol; proceeds strengthen balance sheet and help fund strategic priorities.',
    sentiment: 'positive',
    urgency: 'low',
    event_type: 'divestment',
  },
  {
    event_id: 'EVT_003',
    source: 'daily_digest',
    timestamp: '2026-01-03T07:30:00Z',
    sector: 'Media',
    company: 'RTL Group',
    title: 'Restructuring plan / job cuts',
    summary: 'RTL Deutschland announced ~600 job cuts to accelerate shift to streaming and strengthen RTL+; watch near-term margin pressure.',
    sentiment: 'neutral',
    urgency: 'low',
    event_type: 'restructuring',
  },
  {
    event_id: 'EVT_004',
    source: 'daily_digest',
    timestamp: '2026-01-03T07:30:00Z',
    sector: 'Media',
    company: 'Canal+ / MultiChoice',
    title: 'Distribution deal risk (WBD)',
    summary: 'MultiChoice considers ending Warner Bros Discovery distribution due to financial disagreement; impact expected limited, but headline risk elevated.',
    sentiment: 'neutral',
    urgency: 'medium',
    event_type: 'distribution_deal',
  },
  {
    event_id: 'EVT_005',
    source: 'quick_take',
    timestamp: '2026-01-06T12:05:00Z',
    sector: 'Financials',
    company: 'European Banks',
    title: 'Risk-off move after macro surprise',
    summary: 'A downside macro print sparked a brief risk-off move; monitor spreads and bank beta; client questions likely around positioning and downside protection.',
    sentiment: 'negative',
    urgency: 'high',
    event_type: 'macro_shock',
  },
  {
    event_id: 'EVT_006',
    source: 'daily_digest',
    timestamp: '2026-01-06T06:45:00Z',
    sector: 'Technology',
    company: 'Semiconductors',
    title: 'Supply chain update: lead times easing',
    summary: 'Lead times continue to normalize; watch pricing dynamics and demand visibility into next quarter; opportunities in quality names.',
    sentiment: 'positive',
    urgency: 'low',
    event_type: 'sector_update',
  },
  {
    event_id: 'EVT_007',
    source: 'quick_take',
    timestamp: '2026-01-06T09:20:00Z',
    sector: 'Utilities',
    company: 'EU Utilities',
    title: 'Regulatory headline increases uncertainty',
    summary: 'A regulatory proposal introduces uncertainty on allowed returns; near-term volatility risk; clients may seek rapid clarification.',
    sentiment: 'negative',
    urgency: 'medium',
    event_type: 'regulation',
  },
  {
    event_id: 'EVT_008',
    source: 'daily_digest',
    timestamp: '2026-01-05T07:10:00Z',
    sector: 'Healthcare',
    company: 'Pharma',
    title: 'Pipeline catalysts this month',
    summary: 'Upcoming clinical readouts may drive dispersion; consider scenario framing and risk management for portfolios.',
    sentiment: 'neutral',
    urgency: 'medium',
    event_type: 'catalyst_calendar',
  },
  {
    event_id: 'EVT_009',
    source: 'quick_take',
    timestamp: '2026-01-05T15:40:00Z',
    sector: 'Rates',
    company: 'Rates',
    title: 'Sudden curve steepening intraday',
    summary: 'The curve steepened sharply on positioning unwind; watch stop-outs and client de-risking; likely to trigger urgent conversations.',
    sentiment: 'negative',
    urgency: 'high',
    event_type: 'market_move',
  },
  {
    event_id: 'EVT_010',
    source: 'daily_digest',
    timestamp: '2026-01-04T07:20:00Z',
    sector: 'Consumer',
    company: 'European Retail',
    title: 'Holiday trading update mixed',
    summary: 'Holiday season performance was mixed across retailers; margin pressure remains the key debate; clients may request a quick positioning note.',
    sentiment: 'neutral',
    urgency: 'low',
    event_type: 'trading_update',
  },
  {
    event_id: 'EVT_011',
    source: 'daily_digest',
    timestamp: '2026-01-02T07:20:00Z',
    sector: 'Media',
    company: 'Spotify',
    title: 'Artist remuneration model discussion',
    summary: 'Industry debate continues on remuneration models; strategic implications and margin sensitivity remain in focus for long-term investors.',
    sentiment: 'neutral',
    urgency: 'low',
    event_type: 'business_model',
  },
  {
    event_id: 'EVT_012',
    source: 'quick_take',
    timestamp: '2026-01-02T10:05:00Z',
    sector: 'Technology',
    company: 'Big Tech',
    title: 'AI capex expectations revised upward',
    summary: 'Capex expectations ticked up; upside for infra suppliers but watch valuation sensitivity; alpha-oriented clients may probe opportunity set.',
    sentiment: 'positive',
    urgency: 'medium',
    event_type: 'capex',
  },
];


export const initialSignals: Signal[] = [
  // client_001 (Alpha-leaning): energy quick take + sector spike
  {
    signal_id: 'SIG_001',
    client_id: 'client_001',
    timestamp: '2026-01-07T09:20:00Z',
    signal_type: 'read_quick_take',
    signal_value: 1,
    related_event_id: 'EVT_002',
    related_sector: 'Energy',
    related_company: 'BP',
    source: 'research_portal',
  },
  {
    signal_id: 'SIG_002',
    client_id: 'client_001',
    timestamp: '2026-01-07T09:35:00Z',
    signal_type: 'sector_spike',
    signal_value: 6,
    related_event_id: 'EVT_002',
    related_sector: 'Energy',
    related_company: 'BP',
    source: 'research_portal',
  },

  // client_002 (Early alert): new client, mild stress + repeat checks
  {
    signal_id: 'SIG_003',
    client_id: 'client_002',
    timestamp: '2026-01-07T09:25:00Z',
    signal_type: 'breaking_news_event',
    signal_value: 5,
    related_event_id: 'EVT_001',
    related_sector: 'Industrials',
    related_company: 'Alstom',
    source: 'web_reader',
  },
  {
    signal_id: 'SIG_004',
    client_id: 'client_002',
    timestamp: '2026-01-07T09:40:00Z',
    signal_type: 'repeat_check',
    signal_value: 2,
    related_event_id: 'EVT_001',
    related_sector: 'Industrials',
    related_company: 'Alstom',
    source: 'web_reader',
  },

  // client_003 (Learning): steady digest + report reading
  {
    signal_id: 'SIG_005',
    client_id: 'client_003',
    timestamp: '2026-01-03T08:10:00Z',
    signal_type: 'read_daily_digest',
    signal_value: 18,
    related_event_id: 'EVT_003',
    related_sector: 'Media',
    related_company: 'RTL Group',
    source: 'research_portal',
  },
  {
    signal_id: 'SIG_006',
    client_id: 'client_003',
    timestamp: '2026-01-03T08:35:00Z',
    signal_type: 'read_report',
    signal_value: 14,
    related_event_id: 'EVT_004',
    related_sector: 'Media',
    related_company: 'Canal+ / MultiChoice',
    source: 'research_portal',
  },
  {
    signal_id: 'SIG_007',
    client_id: 'client_003',
    timestamp: '2026-01-02T09:10:00Z',
    signal_type: 'read_daily_digest',
    signal_value: 12,
    related_event_id: 'EVT_011',
    related_sector: 'Media',
    related_company: 'Spotify',
    source: 'research_portal',
  },

  // client_004 (Learning -> action-ready): consumer report reads + meeting request
  {
    signal_id: 'SIG_008',
    client_id: 'client_004',
    timestamp: '2026-01-04T09:05:00Z',
    signal_type: 'read_report',
    signal_value: 20,
    related_event_id: 'EVT_010',
    related_sector: 'Consumer',
    related_company: 'European Retail',
    source: 'research_portal',
  },
  {
    signal_id: 'SIG_009',
    client_id: 'client_004',
    timestamp: '2026-01-05T10:15:00Z',
    signal_type: 'meeting_request',
    signal_value: 1,
    related_sector: 'Consumer',
    source: 'email',
  },

  // client_005 (Critical): macro shock triggers urgent intervention
  {
    signal_id: 'SIG_010',
    client_id: 'client_005',
    timestamp: '2026-01-06T12:10:00Z',
    signal_type: 'breaking_news_event',
    signal_value: 8,
    related_event_id: 'EVT_005',
    related_sector: 'Financials',
    related_company: 'European Banks',
    source: 'news_feed',
  },
  {
    signal_id: 'SIG_011',
    client_id: 'client_005',
    timestamp: '2026-01-06T12:20:00Z',
    signal_type: 'repeat_check',
    signal_value: 4,
    related_event_id: 'EVT_005',
    related_sector: 'Financials',
    related_company: 'European Banks',
    source: 'web_reader',
  },
  {
    signal_id: 'SIG_012',
    client_id: 'client_005',
    timestamp: '2026-01-06T12:22:00Z',
    signal_type: 'chat_spike',
    signal_value: 3,
    related_event_id: 'EVT_005',
    related_sector: 'Financials',
    related_company: 'European Banks',
    source: 'teams_chat',
  },

  // client_006 (Learning): healthcare catalyst calendar reading
  {
    signal_id: 'SIG_013',
    client_id: 'client_006',
    timestamp: '2026-01-05T08:00:00Z',
    signal_type: 'read_daily_digest',
    signal_value: 16,
    related_event_id: 'EVT_008',
    related_sector: 'Healthcare',
    related_company: 'Pharma',
    source: 'research_portal',
  },
  {
    signal_id: 'SIG_014',
    client_id: 'client_006',
    timestamp: '2026-01-05T08:30:00Z',
    signal_type: 'read_report',
    signal_value: 22,
    related_event_id: 'EVT_008',
    related_sector: 'Healthcare',
    related_company: 'Pharma',
    source: 'research_portal',
  },

  // client_007 (Critical): rates move triggers urgent chat activity
  {
    signal_id: 'SIG_015',
    client_id: 'client_007',
    timestamp: '2026-01-05T15:45:00Z',
    signal_type: 'breaking_news_event',
    signal_value: 9,
    related_event_id: 'EVT_009',
    related_sector: 'Rates',
    related_company: 'Rates',
    source: 'news_feed',
  },
  {
    signal_id: 'SIG_016',
    client_id: 'client_007',
    timestamp: '2026-01-05T15:48:00Z',
    signal_type: 'chat_spike',
    signal_value: 4,
    related_event_id: 'EVT_009',
    related_sector: 'Rates',
    related_company: 'Rates',
    source: 'bloomberg_chat',
  },

  // client_008 (Early alert): regulatory headline + moderate repeat checks
  {
    signal_id: 'SIG_017',
    client_id: 'client_008',
    timestamp: '2026-01-06T09:25:00Z',
    signal_type: 'breaking_news_event',
    signal_value: 6,
    related_event_id: 'EVT_007',
    related_sector: 'Utilities',
    related_company: 'EU Utilities',
    source: 'news_feed',
  },
  {
    signal_id: 'SIG_018',
    client_id: 'client_008',
    timestamp: '2026-01-06T09:40:00Z',
    signal_type: 'repeat_check',
    signal_value: 2,
    related_event_id: 'EVT_007',
    related_sector: 'Utilities',
    related_company: 'EU Utilities',
    source: 'web_reader',
  },

  // client_009 (Alpha): capex theme + sector spike
  {
    signal_id: 'SIG_019',
    client_id: 'client_009',
    timestamp: '2026-01-02T10:10:00Z',
    signal_type: 'read_quick_take',
    signal_value: 1,
    related_event_id: 'EVT_012',
    related_sector: 'Technology',
    related_company: 'Big Tech',
    source: 'research_portal',
  },
  {
    signal_id: 'SIG_020',
    client_id: 'client_009',
    timestamp: '2026-01-02T10:25:00Z',
    signal_type: 'sector_spike',
    signal_value: 7,
    related_event_id: 'EVT_012',
    related_sector: 'Technology',
    related_company: 'Big Tech',
    source: 'research_portal',
  },

  // client_010 (Learning): media debate reading
  {
    signal_id: 'SIG_021',
    client_id: 'client_010',
    timestamp: '2026-01-02T09:00:00Z',
    signal_type: 'read_daily_digest',
    signal_value: 14,
    related_event_id: 'EVT_011',
    related_sector: 'Media',
    related_company: 'Spotify',
    source: 'research_portal',
  },
  {
    signal_id: 'SIG_022',
    client_id: 'client_010',
    timestamp: '2026-01-03T09:20:00Z',
    signal_type: 'read_report',
    signal_value: 10,
    related_event_id: 'EVT_004',
    related_sector: 'Media',
    related_company: 'Canal+ / MultiChoice',
    source: 'research_portal',
  },
];


export const getStoredClients = (): Client[] => {
  const stored = localStorage.getItem('oddo_clients');
  if (stored) {
    const clients = JSON.parse(stored) as Client[];
    // Migrate old 'panic' mode to 'early_alert'
    return clients.map(c => ({
      ...c,
      current_mode: c.current_mode === ('panic' as any) ? 'early_alert' : c.current_mode,
    }));
  }
  return initialClients;
};

export const getStoredEvents = (): NewsEvent[] => {
  const stored = localStorage.getItem('oddo_events');
  return stored ? JSON.parse(stored) : initialEvents;
};

export const getStoredSignals = (): Signal[] => {
  const stored = localStorage.getItem('oddo_signals');
  return stored ? JSON.parse(stored) : initialSignals;
};

export const getStoredEngagementLogs = () => {
  const stored = localStorage.getItem('oddo_engagement_logs');
  return stored ? JSON.parse(stored) : [];
};

export const saveClients = (clients: Client[]) => {
  localStorage.setItem('oddo_clients', JSON.stringify(clients));
};

export const saveEvents = (events: NewsEvent[]) => {
  localStorage.setItem('oddo_events', JSON.stringify(events));
};

export const saveSignals = (signals: Signal[]) => {
  localStorage.setItem('oddo_signals', JSON.stringify(signals));
};

export const saveEngagementLogs = (logs: any[]) => {
  localStorage.setItem('oddo_engagement_logs', JSON.stringify(logs));
};
