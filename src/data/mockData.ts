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
    client_name: 'BluePeak Asset Management',
    tier: 'new',
    persona: 'asset_manager',
    region: 'FR',
    sector_interest: 'Industrials',
    rm_name: 'Sophie Dubois',
    preferred_channel: 'email',
    relationship_score: 45,
    funnel_stage: 'new_signals',
    last_contact: '2026-01-05',
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
    sector_interest: 'Industrials',
    rm_name: 'Hans Mueller',
    preferred_channel: 'email',
    relationship_score: 68,
    funnel_stage: 'new_signals',
    last_contact: '2026-01-04',
  },
  {
    client_id: 'client_005',
    client_name: 'Aurum Macro Hedge',
    tier: 'existing',
    persona: 'hedge_fund',
    region: 'UK',
    sector_interest: 'Media',
    rm_name: 'Oliver Barnes',
    preferred_channel: 'bloomberg_chat',
    relationship_score: 91,
    funnel_stage: 'executed',
    last_contact: '2026-01-08',
  },
  {
    client_id: 'client_006',
    client_name: 'Nova Treasury Solutions',
    tier: 'new',
    persona: 'corporate_treasury',
    region: 'FR',
    sector_interest: 'Energy',
    rm_name: 'Pierre Laurent',
    preferred_channel: 'email',
    relationship_score: 35,
    funnel_stage: 'new_signals',
    last_contact: '2026-01-03',
  },
  {
    client_id: 'client_007',
    client_name: 'ODDO BHF Asset Management',
    tier: 'existing',
    persona: 'asset_manager',
    region: 'FR',
    sector_interest: 'Energy',
    rm_name: 'François Dupont',
    preferred_channel: 'bloomberg_chat',
    relationship_score: 95,
    funnel_stage: 'new_signals',
    last_contact: '2026-01-09',
    current_mode: 'critical_alert',
    confidence: 0.92,
  },
  {
    client_id: 'client_008',
    client_name: 'ODDO BHF Private Equity',
    tier: 'existing',
    persona: 'hedge_fund',
    region: 'DE',
    sector_interest: 'Industrials',
    rm_name: 'Klaus Schmidt',
    preferred_channel: 'bloomberg_chat',
    relationship_score: 88,
    funnel_stage: 'recommended_action',
    last_contact: '2026-01-09',
    current_mode: 'critical_alert',
    confidence: 0.89,
  },
];

export const initialEvents: NewsEvent[] = [
  {
    event_id: 'event_001',
    source: 'quick_take',
    timestamp: '2026-01-09T08:30:00Z',
    sector: 'Industrials',
    company: 'Alstom',
    title: 'Alstom – New contract worth €920m',
    summary: 'Alstom secures major European rail infrastructure contract valued at €920 million, reinforcing market leadership in sustainable mobility solutions. Order backlog now exceeds €90bn.',
    sentiment: 'positive',
    urgency: 'medium',
    event_type: 'contract_win',
  },
  {
    event_id: 'event_002',
    source: 'quick_take',
    timestamp: '2026-01-09T07:15:00Z',
    sector: 'Energy',
    company: 'BP',
    title: 'BP – Confirms sale of 65% of Castrol',
    summary: 'BP confirms strategic divestiture of 65% stake in Castrol lubricants division. Transaction valued at approximately $4.2bn, proceeds to fund energy transition investments.',
    sentiment: 'positive',
    urgency: 'low',
    event_type: 'divestiture',
  },
  {
    event_id: 'event_003',
    source: 'daily_digest',
    timestamp: '2026-01-09T06:00:00Z',
    sector: 'Media',
    company: 'RTL Group',
    title: 'RTL Group – Restructuring plan announced',
    summary: 'RTL Group announces comprehensive restructuring affecting 1,200 positions across European operations. Cost savings target of €150m annually by 2027. Streaming pivot remains strategic priority.',
    sentiment: 'neutral',
    urgency: 'low',
    event_type: 'restructuring',
  },
  {
    event_id: 'event_004',
    source: 'daily_digest',
    timestamp: '2026-01-09T06:00:00Z',
    sector: 'Media',
    company: 'Canal+',
    title: 'Canal+ / Multichoice – Distribution deal at risk',
    summary: 'Canal+ faces potential disruption in African distribution partnership with Multichoice. Regulatory concerns in South Africa may impact Q1 2026 subscriber guidance.',
    sentiment: 'negative',
    urgency: 'high',
    event_type: 'regulatory_risk',
  },
  {
    event_id: 'event_005',
    source: 'quick_take',
    timestamp: '2026-01-08T16:45:00Z',
    sector: 'Energy',
    company: 'TotalEnergies',
    title: 'TotalEnergies – LNG expansion in Mozambique',
    summary: 'TotalEnergies resumes Mozambique LNG project with enhanced security protocols. First gas expected H2 2027. Project represents €20bn investment in African energy infrastructure.',
    sentiment: 'positive',
    urgency: 'high',
    event_type: 'project_update',
  },
  {
    event_id: 'event_006',
    source: 'quick_take',
    timestamp: '2026-01-08T14:20:00Z',
    sector: 'Industrials',
    company: 'Siemens Energy',
    title: 'Siemens Energy – Grid division order surge',
    summary: 'Siemens Energy reports 40% YoY increase in grid technology orders. European and US infrastructure spending driving demand. Management raises FY26 guidance.',
    sentiment: 'positive',
    urgency: 'medium',
    event_type: 'earnings_update',
  },
];

export const initialSignals: Signal[] = [
  // Orion Capital Partners - showing panic signals
  {
    signal_id: 'sig_001',
    client_id: 'client_001',
    timestamp: '2026-01-09T08:35:00Z',
    signal_type: 'read_quick_take',
    signal_value: 1,
    related_event_id: 'event_005',
    related_sector: 'Energy',
    related_company: 'TotalEnergies',
  },
  {
    signal_id: 'sig_002',
    client_id: 'client_001',
    timestamp: '2026-01-09T08:40:00Z',
    signal_type: 'repeat_check',
    signal_value: 3,
    related_event_id: 'event_005',
    related_sector: 'Energy',
  },
  {
    signal_id: 'sig_003',
    client_id: 'client_001',
    timestamp: '2026-01-09T08:45:00Z',
    signal_type: 'stress_level',
    signal_value: 65,
  },
  // BluePeak - showing learning signals
  {
    signal_id: 'sig_004',
    client_id: 'client_002',
    timestamp: '2026-01-09T07:00:00Z',
    signal_type: 'read_daily_digest',
    signal_value: 12,
    related_sector: 'Industrials',
  },
  {
    signal_id: 'sig_005',
    client_id: 'client_002',
    timestamp: '2026-01-09T07:30:00Z',
    signal_type: 'read_quick_take',
    signal_value: 1,
    related_event_id: 'event_001',
    related_sector: 'Industrials',
    related_company: 'Alstom',
  },
  // Atlas Pension Fund - showing alpha signals
  {
    signal_id: 'sig_006',
    client_id: 'client_003',
    timestamp: '2026-01-09T09:00:00Z',
    signal_type: 'sector_spike',
    signal_value: 4,
    related_sector: 'Media',
  },
  {
    signal_id: 'sig_007',
    client_id: 'client_003',
    timestamp: '2026-01-09T09:15:00Z',
    signal_type: 'meeting_request',
    signal_value: 1,
    related_sector: 'Media',
  },
  // Aurum Macro Hedge - mixed signals showing alpha seeking
  {
    signal_id: 'sig_008',
    client_id: 'client_005',
    timestamp: '2026-01-09T08:00:00Z',
    signal_type: 'sector_spike',
    signal_value: 5,
    related_sector: 'Media',
  },
  {
    signal_id: 'sig_009',
    client_id: 'client_005',
    timestamp: '2026-01-09T08:10:00Z',
    signal_type: 'chat_spike',
    signal_value: 3,
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
