import { Client, NewsEvent, Signal, IntentClassification, EngagementPlan, ClientMode, ModeScores } from '@/types';

export const classifyIntent = (
  client: Client,
  signals: Signal[],
  relatedEvents: NewsEvent[]
): IntentClassification => {
  let early_alert_score = 0;
  let critical_alert_score = 0;
  let learning_score = 0;
  let alpha_score = 0;

  const contributions: { signal: string; contribution: number; reason: string; mode: ClientMode; signalType: string }[] = [];

  // Process each signal
  signals.forEach(signal => {
    const relatedEvent = relatedEvents.find(e => e.event_id === signal.related_event_id);

    switch (signal.signal_type) {
      case 'breaking_news_event':
        const severity = signal.signal_value;
        const contribution = severity * 3;
        // High severity goes to critical, lower to early alert
        if (severity >= 7) {
          critical_alert_score += contribution;
          contributions.push({
            signal: 'breaking_news_event',
            signalType: 'breaking_news_event',
            contribution,
            reason: `Breaking news severity ${severity} triggered critical alert`,
            mode: 'critical_alert',
          });
        } else {
          early_alert_score += contribution;
          contributions.push({
            signal: 'breaking_news_event',
            signalType: 'breaking_news_event',
            contribution,
            reason: `Breaking news severity ${severity} triggered early alert`,
            mode: 'early_alert',
          });
        }
        break;

      case 'repeat_check':
        const repeatContrib = signal.signal_value * 2;
        // High repeat checks indicate more critical situation
        if (signal.signal_value >= 5) {
          critical_alert_score += repeatContrib;
          contributions.push({
            signal: 'repeat_check',
            signalType: 'repeat_check',
            contribution: repeatContrib,
            reason: `Client checked same content ${signal.signal_value}x – indicates high anxiety`,
            mode: 'critical_alert',
          });
        } else {
          early_alert_score += repeatContrib;
          contributions.push({
            signal: 'repeat_check',
            signalType: 'repeat_check',
            contribution: repeatContrib,
            reason: `Client checked same content ${signal.signal_value}x – indicates concern`,
            mode: 'early_alert',
          });
        }
        break;

      case 'chat_spike':
        const chatContrib = signal.signal_value * 2;
        early_alert_score += chatContrib;
        contributions.push({
          signal: 'chat_spike',
          signalType: 'chat_spike',
          contribution: chatContrib,
          reason: `${signal.signal_value}x increase in messaging activity`,
          mode: 'early_alert',
        });
        break;

      case 'stress_level':
        const stressContrib = signal.signal_value / 10;
        if (signal.signal_value >= 80) {
          critical_alert_score += stressContrib * 2;
          if (signal.signal_value > 50) {
            contributions.push({
              signal: 'stress_level',
              signalType: 'stress_level',
              contribution: stressContrib * 2,
              reason: `Critical stress level at ${signal.signal_value}% based on behavioral patterns`,
              mode: 'critical_alert',
            });
          }
        } else {
          early_alert_score += stressContrib;
          if (signal.signal_value > 50) {
            contributions.push({
              signal: 'stress_level',
              signalType: 'stress_level',
              contribution: stressContrib,
              reason: `Stress level at ${signal.signal_value}% based on behavioral patterns`,
              mode: 'early_alert',
            });
          }
        }
        break;

      case 'read_daily_digest':
        const digestContrib = signal.signal_value / 2;
        learning_score += digestContrib;
        contributions.push({
          signal: 'read_daily_digest',
          signalType: 'read_daily_digest',
          contribution: digestContrib,
          reason: `Spent ${signal.signal_value} minutes reading sector digest`,
          mode: 'learning',
        });
        break;

      case 'read_report':
        const reportContrib = signal.signal_value / 2;
        learning_score += reportContrib;
        contributions.push({
          signal: 'read_report',
          signalType: 'read_report',
          contribution: reportContrib,
          reason: `Engaged with research report for ${signal.signal_value} minutes`,
          mode: 'learning',
        });
        break;

      case 'read_quick_take':
        if (relatedEvent?.sentiment === 'positive') {
          const qtContrib = 2;
          alpha_score += qtContrib;
          contributions.push({
            signal: 'read_quick_take',
            signalType: 'read_quick_take',
            contribution: qtContrib,
            reason: `Read positive quick take on ${relatedEvent.company}`,
            mode: 'alpha',
          });
        } else {
          const qtContrib = 1;
          learning_score += qtContrib;
          contributions.push({
            signal: 'read_quick_take',
            signalType: 'read_quick_take',
            contribution: qtContrib,
            reason: `Read quick take${relatedEvent ? ` on ${relatedEvent.company}` : ''}`,
            mode: 'learning',
          });
        }
        break;

      case 'sector_spike':
        const sectorContrib = signal.signal_value * 3;
        alpha_score += sectorContrib;
        contributions.push({
          signal: 'sector_spike',
          signalType: 'sector_spike',
          contribution: sectorContrib,
          reason: `${signal.signal_value}x increase in ${signal.related_sector || 'sector'} content consumption`,
          mode: 'alpha',
        });
        break;

      case 'meeting_request':
        const meetingContrib = signal.signal_value * 2;
        alpha_score += meetingContrib;
        contributions.push({
          signal: 'meeting_request',
          signalType: 'meeting_request',
          contribution: meetingContrib,
          reason: 'Client proactively requested engagement',
          mode: 'alpha',
        });
        break;
    }
  });

  // Urgency + sentiment bonus for alerts
  relatedEvents.forEach(event => {
    if (event.urgency === 'high' && event.sentiment === 'negative') {
      critical_alert_score += 5;
      contributions.push({
        signal: 'high_urgency_negative',
        signalType: 'high_urgency_negative',
        contribution: 5,
        reason: `${event.company}: ${event.title} – requires immediate attention`,
        mode: 'critical_alert',
      });
    }
  });

  // Persona adjustments
  if (client.persona === 'hedge_fund') {
    alpha_score *= 1.3;
  }

  // Tier adjustments for new clients
  if (client.tier === 'new') {
    // Higher threshold for alert escalation
    early_alert_score *= 0.8;
    critical_alert_score *= 0.8;
  }

  // Determine mode
  const scores: ModeScores = { 
    early_alert_score, 
    critical_alert_score,
    learning_score, 
    alpha_score 
  };
  const maxScore = Math.max(early_alert_score, critical_alert_score, learning_score, alpha_score);
  
  let mode: ClientMode;
  if (maxScore === 0) {
    mode = 'learning'; // Default
  } else if (critical_alert_score >= early_alert_score && critical_alert_score >= learning_score && critical_alert_score >= alpha_score) {
    mode = 'critical_alert';
  } else if (early_alert_score >= learning_score && early_alert_score >= alpha_score) {
    mode = 'early_alert';
  } else if (alpha_score >= learning_score) {
    mode = 'alpha';
  } else {
    mode = 'learning';
  }

  // IMPROVED CONFIDENCE CALCULATION
  // Based on: number of signals, score separation, and signal consistency
  const signalCount = signals.length;
  
  // Calculate score separation (how dominant is the winning mode)
  const sortedScores = [early_alert_score, critical_alert_score, learning_score, alpha_score].sort((a, b) => b - a);
  const scoreSeparation = sortedScores[0] > 0 ? (sortedScores[0] - sortedScores[1]) / sortedScores[0] : 0;
  
  // Mode-specific signal consistency (what % of signals support the detected mode)
  const modeSignals = contributions.filter(c => c.mode === mode).length;
  const signalConsistency = contributions.length > 0 ? modeSignals / contributions.length : 0;
  
  // Base confidence from signal count (diminishing returns)
  let baseConfidence: number;
  if (signalCount === 0) {
    baseConfidence = 0.50;
  } else if (signalCount <= 2) {
    baseConfidence = 0.55 + (signalCount * 0.05); // 55-65%
  } else if (signalCount <= 5) {
    baseConfidence = 0.65 + ((signalCount - 2) * 0.05); // 65-80%
  } else {
    baseConfidence = 0.80 + Math.min((signalCount - 5) * 0.02, 0.12); // 80-92%
  }
  
  // Adjust for score separation (clear winner = higher confidence)
  const separationBonus = scoreSeparation * 0.08;
  
  // Adjust for signal consistency
  const consistencyBonus = signalConsistency * 0.06;
  
  // Calculate final confidence with realistic caps
  let confidence = baseConfidence + separationBonus + consistencyBonus;
  confidence = Math.max(0.50, Math.min(0.92, confidence)); // Cap at 50-92%
  
  // Reduce confidence for new clients (less data history)
  if (client.tier === 'new') {
    confidence = Math.max(0.50, confidence - 0.05);
  }

  // Get top 3 contributing signals for the detected mode
  const modeContributions = contributions
    .filter(c => c.mode === mode)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3);

  // If not enough mode-specific contributions, add from others
  if (modeContributions.length < 3) {
    const otherContributions = contributions
      .filter(c => !modeContributions.includes(c))
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3 - modeContributions.length);
    modeContributions.push(...otherContributions);
  }

  return {
    mode,
    confidence: Math.round(confidence * 100) / 100,
    scores,
    top_signals: modeContributions.map(c => ({
      signal: c.signalType,
      contribution: c.contribution,
      reason: c.reason,
    })),
  };
};

export const getModeRecommendedChannel = (
  mode: ClientMode,
  persona: Client['persona']
): { channel: string; description: string } => {
  const isHedgeFund = persona === 'hedge_fund';
  
  if (isHedgeFund) {
    return {
      channel: 'Multi-channel cadence',
      description: 'Chat + Email + Call – Hedge fund protocol',
    };
  }
  
  switch (mode) {
    case 'critical_alert':
      return {
        channel: 'Immediate Call + Bloomberg',
        description: 'Direct call required for critical situations',
      };
    case 'early_alert':
      return {
        channel: 'Bloomberg/Teams Chat',
        description: 'Immediate response channel for urgent situations',
      };
    case 'alpha':
      return {
        channel: 'Sector meeting + idea pack',
        description: 'Email + chat for idea presentation',
      };
    case 'learning':
    default:
      return {
        channel: 'Focused email',
        description: 'Single-company deep dive preferred',
      };
  }
};

export const generateEngagementPlan = (
  client: Client,
  classification: IntentClassification,
  signals: Signal[],
  events: NewsEvent[]
): EngagementPlan => {
  const { mode, confidence } = classification;
  const isHedgeFund = client.persona === 'hedge_fund';
  
  // Determine tone
  let tone: 'conservative' | 'balanced' | 'aggressive';
  if (client.persona === 'pension_fund' || client.persona === 'family_office') {
    tone = 'conservative';
  } else if (isHedgeFund) {
    tone = 'aggressive';
  } else {
    tone = 'balanced';
  }

  // Adjust for new clients
  if (client.tier === 'new') {
    tone = 'conservative';
  }

  // Get most relevant event
  const recentSignal = signals.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
  const relevantEvent = events.find(e => e.event_id === recentSignal?.related_event_id);

  // Generate why_now - MORE EVENT SPECIFIC
  let why_now = '';
  switch (mode) {
    case 'critical_alert':
      why_now = relevantEvent 
        ? `CRITICAL: Major market disruption from "${relevantEvent.title}" (${relevantEvent.company}). Client exhibiting extreme stress signals requiring immediate senior analyst intervention.`
        : `CRITICAL: Client showing critical stress indicators – multiple distress signals detected. Immediate outreach required.`;
      break;
    case 'early_alert':
      why_now = relevantEvent 
        ? `Elevated stress signals following "${relevantEvent.title}" (${relevantEvent.company}). Behavioral patterns indicate need for immediate analyst support.`
        : `Client exhibiting early alert indicators – repeat content checking and elevated engagement patterns suggest urgent need for market perspective.`;
      break;
    case 'learning':
      why_now = relevantEvent
        ? `Active research on "${relevantEvent.title}" (${relevantEvent.company}). Sector: ${client.sector_interest}. Ideal moment for educational engagement.`
        : `Client in research mode – consistent engagement with sector digests indicates readiness for deep-dive content.`;
      break;
    case 'alpha':
      why_now = relevantEvent
        ? `Alpha-seeking behavior following "${relevantEvent.title}" (${relevantEvent.company}). ${client.sector_interest} sector spike suggests opportunity appetite.`
        : `Client actively seeking investment ideas – sector engagement patterns indicate openness to actionable research.`;
      break;
  }

  // Determine preferred channel based on mode and persona
  let preferredChannel = client.preferred_channel;
  if ((mode === 'early_alert' || mode === 'critical_alert') && (client.preferred_channel === 'email')) {
    preferredChannel = 'bloomberg_chat'; // Upgrade to faster channel for alerts
  }

  // Generate what to send - MORE EVENT SPECIFIC WITH CONTENT ANGLE
  let what_to_send = '';
  let content_asset = '';
  
  switch (mode) {
    case 'critical_alert':
      if (relevantEvent) {
        what_to_send = `URGENT: Direct call to discuss ${relevantEvent.company} situation. Provide immediate risk assessment, hedging options, and portfolio protection strategies.`;
        content_asset = `Emergency Brief: ${relevantEvent.title}`;
      } else {
        what_to_send = `URGENT: Immediate call required. Assess portfolio exposure and provide real-time guidance. Escalate to senior coverage if needed.`;
        content_asset = 'Critical Market Alert';
      }
      break;
    case 'early_alert':
      if (relevantEvent) {
        what_to_send = `Calm context on ${relevantEvent.company}: Explain market impact, provide risk scenarios, and offer positioning guidance. Ask: "How are you positioned on this?"`;
        content_asset = `Quick Take: ${relevantEvent.title}`;
      } else {
        what_to_send = `Provide immediate market context and offer rapid call to address concerns. Keep messaging concise and action-oriented.`;
        content_asset = 'Flash Note: Market Update';
      }
      break;
    case 'learning':
      if (relevantEvent) {
        what_to_send = `Single-company focus: ${relevantEvent.company} analysis with sector context. Link to daily digest. Educational angle: "Here's what this means for ${client.sector_interest}..."`;
        content_asset = `Daily Digest: ${relevantEvent.sector} Overview`;
      } else {
        what_to_send = `Curated sector overview with 2-3 key takeaways. Position as educational value-add, not hard sell.`;
        content_asset = `Sector Digest: ${client.sector_interest}`;
      }
      break;
    case 'alpha':
      if (relevantEvent) {
        what_to_send = `Pitch angle: ${relevantEvent.company} opportunity thesis + next catalyst. Include 2-3 related ideas in ${client.sector_interest}. Meeting agenda with actionable trade themes.`;
        content_asset = `First Take: ${relevantEvent.company} Investment Case`;
      } else {
        what_to_send = `Best ideas pack with sector highlights. Propose strategic meeting to discuss portfolio positioning.`;
        content_asset = `Sector Ideas Pack: ${client.sector_interest}`;
      }
      break;
  }

  // Generate next step with confidence guidance
  let next_step = '';
  if (confidence < 0.65) {
    next_step = 'Low certainty: soft-touch recommended. Monitor for additional signals before escalating outreach.';
  } else if (confidence >= 0.80) {
    next_step = mode === 'critical_alert'
      ? 'CRITICAL: Immediate senior analyst call. Portfolio review within 2 hours. Escalate to desk head if needed.'
      : mode === 'early_alert' 
      ? 'High certainty: Immediate proactive outreach. Book call within 24h and follow up with portfolio review.'
      : mode === 'alpha'
      ? 'High certainty: Proactive idea presentation. Schedule sector meeting and prepare pitch materials.'
      : 'High certainty: Schedule educational session. Convert interest to formal research subscription discussion.';
  } else {
    next_step = 'Medium certainty: balanced outreach recommended. Proceed with engagement and gauge response.';
  }

  // Generate cadence based on persona
  let cadence = {
    day0: '',
    day1: '',
    day3: '',
  };

  if (mode === 'critical_alert') {
    cadence = {
      day0: 'Immediate: Direct call + Bloomberg alert + Senior analyst loop-in',
      day1: 'Follow-up call: Portfolio review and risk assessment update',
      day3: 'Email: Comprehensive situation analysis and positioning recommendations',
    };
  } else if (isHedgeFund) {
    cadence = {
      day0: 'Bloomberg Chat: Quick insight + ask about positioning',
      day1: 'Follow-up call: Deeper market view + idea discussion',
      day3: 'Email: Idea pack with sector themes',
    };
  } else if (client.persona === 'pension_fund') {
    cadence = {
      day0: 'Email: Thoughtful market perspective with risk context',
      day1: 'Email follow-up: Additional research materials',
      day3: 'Propose webinar or group call on sector outlook',
    };
  } else if (client.persona === 'family_office') {
    cadence = {
      day0: 'Email: Personalized note with relevant insights',
      day1: 'Follow-up email: Offer private call with analyst',
      day3: 'Meeting invitation: Quarterly portfolio review',
    };
  } else {
    // Asset Manager / Corporate Treasury
    cadence = {
      day0: (mode === 'early_alert' as ClientMode || mode === 'critical_alert' as ClientMode) ? 'Email + Call: Immediate outreach' : 'Email: Key insights summary',
      day1: 'Call: Follow-up discussion on implications',
      day3: 'Email: Sector update with forward-looking view',
    };
  }

  return {
    why_now,
    preferred_channel: preferredChannel,
    tone,
    what_to_send,
    next_step,
    cadence,
    content_asset,
  };
};

export const calculateClientRelevance = (
  client: Client,
  event: NewsEvent
): number => {
  let score = 0;

  // Sector match
  if (client.sector_interest.toLowerCase() === event.sector.toLowerCase()) {
    score += 40;
  }

  // Persona weighting
  if (client.persona === 'hedge_fund') {
    score += 15; // More likely to act on any news
  } else if (client.persona === 'asset_manager') {
    score += 10;
  }

  // Urgency weighting
  if (event.urgency === 'high') score += 20;
  else if (event.urgency === 'medium') score += 10;

  // Sentiment impact by persona
  if (event.sentiment === 'negative') {
    if (client.persona === 'pension_fund') score += 15; // Risk-sensitive
    else if (client.persona === 'hedge_fund') score += 10; // Opportunity for shorts
  } else if (event.sentiment === 'positive') {
    score += 10;
  }

  // Relationship score influence
  score += client.relationship_score / 10;

  // Existing client bonus
  if (client.tier === 'existing') score += 5;

  return Math.min(Math.round(score), 100);
};
