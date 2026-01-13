import type { Client, NewsEvent, Signal, ClientMode } from '@/types';

const STORAGE_KEY = 'client_radar_llm_key';

export const getStoredLlmKey = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const saveLlmKey = (key: string) => {
  try {
    if (!key) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // ignore storage errors
  }
};

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export const callLLM = async (apiKey: string, messages: ChatMessage[], model = 'gpt-4o-mini') => {
  if (!apiKey) throw new Error('Missing API key');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty LLM response');
  return JSON.parse(content);
};

export const llmSummarizeEvent = async (apiKey: string, event: NewsEvent, client?: Client) => {
  const sys = 'You are an equity research assistant. Return JSON only.';
  const user = [
    'Summarize this event in 1-2 sentences for an analyst.',
    'If a client is provided, tailor the wording to that client persona and sector interest.',
    '',
    `Event: ${JSON.stringify(event)}`,
    `Client: ${client ? JSON.stringify(client) : 'null'}`,
    '',
    'Return JSON: {"summary":"...","key_points":["...","..."],"tone":"calm|neutral|urgent"}',
  ].join('\n');
  return callLLM(apiKey, [{ role: 'system', content: sys }, { role: 'user', content: user }]);
};

export const llmGenerateClientBrief = async (
  apiKey: string,
  client: Client,
  signals: Signal[],
  events: NewsEvent[],
  mode: ClientMode,
  confidence: number
) => {
  const sys = 'You are a senior equity research salesperson coach. Return JSON only.';
  const user = [
    'Create an analyst brief explaining client intent, top signals, and best next action.',
    'Be conservative for new clients.',
    '',
    `Client: ${JSON.stringify(client)}`,
    `Mode: ${mode} (confidence ${confidence})`,
    `Signals: ${JSON.stringify(signals.slice(0, 20))}`,
    `Events: ${JSON.stringify(events.slice(0, 10))}`,
    '',
    'Return JSON:',
    '{"one_liner":"...","why_now":"...","top_triggers":[{"signal":"...","reason":"..."}],',
    '"recommended_action":{"action_name":"...","channel":"email|bloomberg_chat|teams_chat|call","tone":"conservative|balanced|aggressive","next_step_funnel":"..."},',
    '"message_draft":"...","follow_up_plan":["...","..."]}',
  ].join('\n');
  return callLLM(apiKey, [{ role: 'system', content: sys }, { role: 'user', content: user }]);
};

export const llmGenerateSyntheticClient = async (
  apiKey: string,
  seed: { region: string; persona: string; sector_interest: string }
) => {
  const sys =
    'You generate realistic institutional client profiles for an equity research CRM prototype. Return JSON only.';
  const user = [
    `Generate one new client based on: ${JSON.stringify(seed)}.`,
    'Use publicly-known, non-confidential institutional names (asset managers, funds).',
    'Return JSON matching this shape:',
    '{"client_id":"client_XXX","client_name":"...","tier":"new|existing","persona":"hedge_fund|asset_manager|pension_fund|family_office|corporate_treasury","region":"...","sector_interest":"...","rm_name":"...","preferred_channel":"email|bloomberg_chat|teams_chat|call","relationship_score":0,"funnel_stage":"new_signals","last_contact":"YYYY-MM-DD"}',
  ].join('\n');
  return callLLM(apiKey, [{ role: 'system', content: sys }, { role: 'user', content: user }]);
};

export const llmGenerateSyntheticNews = async (apiKey: string, sector: string) => {
  const sys = 'You generate market news events suitable for an equity research feed. Return JSON only.';
  const user = [
    `Generate 3 concise news events for sector: ${sector}.`,
    'Mix quick_take and daily_digest sources. Use plausible public-company examples.',
    'Return JSON: {"events":[{"event_id":"EVT_x","source":"quick_take|daily_digest","timestamp":"YYYY-MM-DD HH:MM","sector":"...","company":"...","title":"...","summary":"...","sentiment":"positive|neutral|negative","urgency":"low|medium|high","event_type":"earnings|m&a|guidance|contract|macro"}]}',
  ].join('\n');
  return callLLM(apiKey, [{ role: 'system', content: sys }, { role: 'user', content: user }]);
};
