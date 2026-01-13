import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Client } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModeBadge } from '@/components/ui/ModeBadge';
import { ConfidenceBar } from '@/components/ui/ConfidenceBar';
import { Brain, TrendingUp, Activity, Plus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { llmGenerateClientBrief } from '@/lib/llm';

interface AISonarDecisionProps {
  client: Client;
}

// Signal type to display name mapping
const signalDisplayNames: Record<string, string> = {
  breaking_news_event: 'breaking_news_event',
  repeat_check: 'repeat_check',
  chat_spike: 'chat_spike',
  stress_level: 'stress_level',
  read_daily_digest: 'read_daily_digest',
  read_report: 'read_report',
  read_quick_take: 'read_quick_take',
  sector_spike: 'sector_spike',
  meeting_request: 'meeting_request',
  high_urgency_negative: 'high_urgency_negative',
};

export const AISonarDecision = ({ client }: AISonarDecisionProps) => {
  const { getClientClassification, getClientSignals, addSignal, events, llmApiKey, patchClient } = useApp();
  const { toast } = useToast();
  const [showAddSignal, setShowAddSignal] = useState(false);
  const [newSignalType, setNewSignalType] = useState('');
  const [newSignalValue, setNewSignalValue] = useState('');
  const [aiBusy, setAiBusy] = useState(false);

  const classification = useMemo(() => 
    getClientClassification(client), 
    [client, getClientClassification]
  );

  const signals = useMemo(() => 
    getClientSignals(client.client_id).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 5),
    [client.client_id, getClientSignals]
  );

  const signalTypes = [
    { value: 'read_quick_take', label: 'read_quick_take' },
    { value: 'read_daily_digest', label: 'read_daily_digest (minutes)' },
    { value: 'repeat_check', label: 'repeat_check (count)' },
    { value: 'sector_spike', label: 'sector_spike (multiplier)' },
    { value: 'chat_spike', label: 'chat_spike (count)' },
    { value: 'meeting_request', label: 'meeting_request' },
    { value: 'stress_level', label: 'stress_level (0-100)' },
    { value: 'breaking_news_event', label: 'breaking_news_event (severity 1-10)' },
  ];

  const handleAddSignal = () => {
    if (!newSignalType || !newSignalValue) return;

    addSignal({
      client_id: client.client_id,
      signal_type: newSignalType,
      signal_value: parseFloat(newSignalValue),
      related_sector: client.sector_interest,
    });

    toast({
      title: 'Signal Added',
      description: `${newSignalType} added to ${client.client_name}`,
    });

    setNewSignalType('');
    setNewSignalValue('');
    setShowAddSignal(false);
  };

  const formatSignalTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get confidence guidance text
  const getConfidenceGuidance = (confidence: number) => {
    if (confidence < 0.65) {
      return '⚠️ Low certainty: soft-touch recommended';
    } else if (confidence < 0.80) {
      return '→ Medium certainty: balanced outreach recommended';
    } else {
      return '✓ High certainty: proactive outreach recommended';
    }
  };

  
  const generateAiBrief = async () => {
    if (!llmApiKey) {
      toast({ title: 'Add API key', description: 'Go to AI Copilot to set your OpenAI key.', variant: 'destructive' });
      return;
    }
    setAiBusy(true);
    try {
      const clientSignals = getClientSignals(client.client_id);
      const relatedEvents = events.filter(e => clientSignals.some(s => s.related_event_id === e.event_id));
      const out = await llmGenerateClientBrief(llmApiKey, client, clientSignals, relatedEvents, classification.mode, classification.confidence);
      patchClient(client.client_id, { ai_brief: {
        one_liner: out.one_liner,
        why_now: out.why_now,
        message_draft: out.message_draft,
        follow_up_plan: out.follow_up_plan,
      }});
      toast({ title: 'AI brief generated', description: 'Added to client profile.' });
    } catch (e: any) {
      toast({ title: 'LLM error', description: e.message, variant: 'destructive' });
    } finally {
      setAiBusy(false);
    }
  };

return (
    <div className="space-y-4">
      {/* AI Sonar Decision Header */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center justify-between mb-4">
        <Button variant="secondary" size="sm" onClick={generateAiBrief} disabled={aiBusy} className="ml-auto">
          <Brain className="w-4 h-4 mr-2" />{aiBusy ? 'Generating…' : 'Generate AI Brief'}
        </Button>
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent" />
            AI Sonar Decision
          </h4>
          <ModeBadge mode={classification.mode} size="lg" />
        </div>

        <ConfidenceBar 
          confidence={classification.confidence} 
          mode={classification.mode} 
        />

        {/* Confidence Guidance */}
        <p className="text-xs text-muted-foreground mt-3">
          {getConfidenceGuidance(classification.confidence)}
        </p>
      </Card>

      {/* Score Breakdown */}
      <Card className="p-4">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Score Breakdown
        </h5>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 rounded bg-early-alert/10">
            <div className="text-lg font-bold text-early-alert">
              {classification.scores.early_alert_score.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Early Alert</div>
          </div>
          <div className="text-center p-2 rounded bg-critical-alert/10">
            <div className="text-lg font-bold text-critical-alert">
              {classification.scores.critical_alert_score.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center p-2 rounded bg-learning/10">
            <div className="text-lg font-bold text-learning">
              {classification.scores.learning_score.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Learning</div>
          </div>
          <div className="text-center p-2 rounded bg-alpha/10">
            <div className="text-lg font-bold text-alpha">
              {classification.scores.alpha_score.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Alpha</div>
          </div>
        </div>
      </Card>

      {/* Top Contributing Signals */}
      <Card className="p-4">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Why This Classification
        </h5>
        <div className="space-y-2">
          {client.ai_brief ? (
        <div className="mt-4 rounded-lg border p-4 space-y-2">
          <div className="text-sm font-medium">AI Brief</div>
          <div className="text-sm">{client.ai_brief.one_liner}</div>
          <div className="text-xs text-muted-foreground">{client.ai_brief.why_now}</div>
          <div className="text-sm font-medium mt-3">Draft message</div>
          <pre className="text-xs whitespace-pre-wrap">{client.ai_brief.message_draft}</pre>
        </div>
      ) : null}

      {classification.top_signals.map((signal, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{signal.signal}</span>
                <span className="text-muted-foreground ml-2">(+{signal.contribution.toFixed(1)})</span>
                <p className="text-xs text-muted-foreground mt-0.5">{signal.reason}</p>
              </div>
            </div>
          ))}
          {classification.top_signals.length === 0 && (
            <p className="text-sm text-muted-foreground">No significant signals detected</p>
          )}
        </div>
      </Card>

      {/* Recent Signals Timeline */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Recent Signals
          </h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddSignal(!showAddSignal)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showAddSignal && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg space-y-2">
            <Select value={newSignalType} onValueChange={setNewSignalType}>
              <SelectTrigger>
                <SelectValue placeholder="Select signal type" />
              </SelectTrigger>
              <SelectContent>
                {signalTypes.map(st => (
                  <SelectItem key={st.value} value={st.value}>
                    {st.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Value"
                value={newSignalValue}
                onChange={(e) => setNewSignalValue(e.target.value)}
              />
              <Button size="sm" onClick={handleAddSignal}>
                Add
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {signals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No signals recorded
            </p>
          ) : (
            signals.map((signal) => (
              <div 
                key={signal.signal_id} 
                className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-mono text-xs">{signal.signal_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{signal.signal_value}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatSignalTime(signal.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
