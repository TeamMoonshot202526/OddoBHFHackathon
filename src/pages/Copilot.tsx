import { useMemo, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { llmGenerateSyntheticClient, llmGenerateSyntheticNews, llmGenerateClientBrief } from '@/lib/llm';
import type { Persona } from '@/types';

const regions = ['FR', 'UK', 'DE', 'CH', 'IT', 'ES', 'NL', 'US'];
const personas: Persona[] = ['asset_manager', 'hedge_fund', 'pension_fund', 'family_office', 'corporate_treasury'];
const sectors = ['Energy', 'Media', 'Industrials', 'Financials', 'Technology', 'Healthcare', 'Consumer', 'Utilities'];

export default function Copilot() {
  const {
    llmApiKey,
    setLlmApiKey,
    clients,
    events,
    signals,
    addClient,
    addEvent,
    patchClient,
    getClientSignals,
    getClientClassification,
  } = useApp();
  const { toast } = useToast();

  const [keyInput, setKeyInput] = useState(llmApiKey || '');
  const [genRegion, setGenRegion] = useState('FR');
  const [genPersona, setGenPersona] = useState<Persona>('asset_manager');
  const [genSector, setGenSector] = useState('Energy');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.client_id || '');
  const [busy, setBusy] = useState(false);

  const selectedClient = useMemo(
    () => clients.find(c => c.client_id === selectedClientId),
    [clients, selectedClientId]
  );

  const saveKey = () => {
    setLlmApiKey(keyInput.trim());
    toast({ title: 'Saved API key locally', description: 'Stored in your browser localStorage for this prototype.' });
  };

  const handleGenerateClient = async () => {
    if (!keyInput.trim()) return toast({ title: 'Missing API key', variant: 'destructive' });
    setBusy(true);
    try {
      const data = await llmGenerateSyntheticClient(keyInput.trim(), {
        region: genRegion,
        persona: genPersona,
        sector_interest: genSector,
      });
      const c = data;
      // Ensure minimal required fields and uniqueness
      c.client_id = c.client_id || `client_${Math.floor(Math.random() * 100000)}`;
      c.relationship_score = Number(c.relationship_score ?? 50);
      c.funnel_stage = c.funnel_stage || 'new_signals';
      c.last_contact = c.last_contact || new Date().toISOString().slice(0, 10);
      addClient(c);
      toast({ title: 'Client generated', description: c.client_name });
    } catch (e: any) {
      toast({ title: 'LLM error', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const handleGenerateNews = async () => {
    if (!keyInput.trim()) return toast({ title: 'Missing API key', variant: 'destructive' });
    setBusy(true);
    try {
      const data = await llmGenerateSyntheticNews(keyInput.trim(), genSector);
      const evs = Array.isArray(data.events) ? data.events : [];
      evs.forEach((ev: any) => {
        ev.event_id = ev.event_id || `EVT_${Math.floor(Math.random() * 100000)}`;
        addEvent(ev);
      });
      toast({ title: 'News generated', description: `Added ${evs.length} events to News Flow` });
    } catch (e: any) {
      toast({ title: 'LLM error', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const handleGenerateBrief = async () => {
    if (!keyInput.trim()) return toast({ title: 'Missing API key', variant: 'destructive' });
    if (!selectedClient) return;
    setBusy(true);
    try {
      const clientSignals = getClientSignals(selectedClient.client_id);
      const relatedEvents = events.filter(e => clientSignals.some(s => s.related_event_id === e.event_id));
      const cls = getClientClassification(selectedClient);
      const brief = await llmGenerateClientBrief(
        keyInput.trim(),
        selectedClient,
        clientSignals,
        relatedEvents,
        cls.mode,
        cls.confidence
      );
      patchClient(selectedClient.client_id, { ai_brief: {
        one_liner: brief.one_liner,
        why_now: brief.why_now,
        message_draft: brief.message_draft,
        follow_up_plan: brief.follow_up_plan,
      }});
      toast({ title: 'AI brief generated', description: 'Added to client profile.' });
    } catch (e: any) {
      toast({ title: 'LLM error', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Copilot</h1>
        <p className="text-muted-foreground">
          Use your OpenAI API key to generate realistic clients, news, and client-ready drafts directly in the prototype.
        </p>
      </div>

      <Card className="p-4 space-y-3">
        <div className="font-medium">API Key (stored locally)</div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            type="password"
            placeholder="sk-..."
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            className="md:flex-1"
          />
          <Button onClick={saveKey}>Save Key</Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Prototype note: keys stored in browser localStorage. For production, use a backend proxy.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 space-y-4">
          <div className="font-medium">Generate Clients (ODDO-style mock)</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={genRegion} onValueChange={setGenRegion}>
              <SelectTrigger><SelectValue placeholder="Region" /></SelectTrigger>
              <SelectContent>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={genPersona} onValueChange={(v) => setGenPersona(v as Persona)}>
              <SelectTrigger><SelectValue placeholder="Persona" /></SelectTrigger>
              <SelectContent>{personas.map(p => <SelectItem key={p} value={p}>{p.replace('_',' ')}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={genSector} onValueChange={setGenSector}>
              <SelectTrigger><SelectValue placeholder="Sector" /></SelectTrigger>
              <SelectContent>{sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button disabled={busy} onClick={handleGenerateClient} className="w-full">
            {busy ? 'Working…' : 'Generate 1 Client'}
          </Button>
          <p className="text-xs text-muted-foreground">Creates a new client and adds it to the dashboard + funnel.</p>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="font-medium">Generate News (Quick Takes + Digests)</div>
          <div className="flex items-center gap-3">
            <Select value={genSector} onValueChange={setGenSector}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Sector" /></SelectTrigger>
              <SelectContent>{sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Button disabled={busy} onClick={handleGenerateNews}>
              {busy ? 'Working…' : 'Generate 3 Events'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Adds new events to News Flow and makes the radar feel live.</p>
        </Card>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="font-medium">Generate AI Brief for a Client</div>
            <div className="text-xs text-muted-foreground">Creates one-liner, why-now, triggers, and a message draft.</div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-[260px]"><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.client_id} value={c.client_id}>
                    {c.client_name} • {c.sector_interest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button disabled={busy || !selectedClient} onClick={handleGenerateBrief}>
              {busy ? 'Working…' : 'Generate Brief'}
            </Button>
          </div>
        </div>

        {selectedClient?.ai_brief ? (
          <div className="rounded-lg border p-4 space-y-2">
            <div className="text-sm font-medium">Latest AI Brief</div>
            <div className="text-sm">{selectedClient.ai_brief.one_liner}</div>
            <div className="text-xs text-muted-foreground">{selectedClient.ai_brief.why_now}</div>
            <div className="text-sm font-medium mt-3">Draft</div>
            <pre className="text-xs whitespace-pre-wrap">{selectedClient.ai_brief.message_draft}</pre>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No AI brief yet. Generate one above.</div>
        )}
      </Card>

      <Card className="p-4">
        <div className="text-sm text-muted-foreground">
          Tip: After generating clients/news, go to <b>News Flow</b> and <b>Engagement Funnel</b> to see the system react.
        </div>
      </Card>
    </div>
  );
}
