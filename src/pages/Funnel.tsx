import { useApp } from '@/contexts/AppContext';
import { FunnelStage, Client } from '@/types';
import { Card } from '@/components/ui/card';
import { ModeBadge } from '@/components/ui/ModeBadge';
import { PersonaBadge } from '@/components/ui/PersonaBadge';
import { GitBranch } from 'lucide-react';

const stages: { key: FunnelStage; label: string; color: string }[] = [
  { key: 'new_signals', label: 'New Signals', color: 'border-t-muted-foreground' },
  { key: 'recommended_action', label: 'Recommended Action', color: 'border-t-learning' },
  { key: 'executed', label: 'Executed', color: 'border-t-accent' },
  { key: 'awaiting_response', label: 'Awaiting Response', color: 'border-t-learning' },
  { key: 'converted', label: 'Converted', color: 'border-t-alpha' },
];

const Funnel = () => {
  const { clients, updateClientFunnelStage } = useApp();

  const getClientsByStage = (stage: FunnelStage) => clients.filter(c => c.funnel_stage === stage);

  const handleDragStart = (e: React.DragEvent, client: Client) => {
    e.dataTransfer.setData('clientId', client.client_id);
  };

  const handleDrop = (e: React.DragEvent, stage: FunnelStage) => {
    e.preventDefault();
    const clientId = e.dataTransfer.getData('clientId');
    if (clientId) updateClientFunnelStage(clientId, stage);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-white flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-accent" /> Engagement Funnel
        </h1>
        <p className="text-white/60 text-sm">Drag clients between stages to track engagement progress</p>
      </div>

      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-180px)]">
        {stages.map(stage => (
          <div
            key={stage.key}
            className={`bg-muted/30 rounded-lg p-3 border-t-4 ${stage.color}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, stage.key)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{stage.label}</h3>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                {getClientsByStage(stage.key).length}
              </span>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
              {getClientsByStage(stage.key).map(client => (
                <Card
                  key={client.client_id}
                  className="p-3 cursor-grab active:cursor-grabbing engagement-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, client)}
                >
                  <div className="font-medium text-sm mb-1">{client.client_name}</div>
                  <div className="flex flex-wrap gap-1">
                    <PersonaBadge persona={client.persona} size="sm" />
                    {client.current_mode && <ModeBadge mode={client.current_mode} size="sm" showIcon={false} />}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Funnel;
