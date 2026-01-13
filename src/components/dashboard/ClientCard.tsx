import { Client } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ModeBadge } from '@/components/ui/ModeBadge';
import { PersonaBadge } from '@/components/ui/PersonaBadge';
import { TierBadge } from '@/components/ui/TierBadge';
import { ChannelBadge } from '@/components/ui/ChannelBadge';
import { ConfidenceBar } from '@/components/ui/ConfidenceBar';
import { Eye, Zap, MapPin, Briefcase, MessageSquare, Radio } from 'lucide-react';
import { getModeRecommendedChannel } from '@/lib/intentEngine';

interface ClientCardProps {
  client: Client;
  onView: (client: Client) => void;
  onQuickAction: (client: Client) => void;
}

export const ClientCard = ({ client, onView, onQuickAction }: ClientCardProps) => {
  const mode = client.current_mode || 'learning';
  const confidence = client.confidence || 0.5;
  const modeChannel = getModeRecommendedChannel(mode, client.persona);

  return (
    <Card className="card-hover p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate">
            {client.client_name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <PersonaBadge persona={client.persona} size="sm" />
            <TierBadge tier={client.tier} />
          </div>
        </div>
        <ModeBadge mode={mode} size="md" />
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="w-4 h-4" />
          <span>{client.sector_interest}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{client.region}</span>
        </div>
      </div>

      {/* Channel Strategy */}
      <div className="space-y-2 p-2 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 text-xs">
          <Radio className="w-3.5 h-3.5 text-accent" />
          <span className="text-muted-foreground">Mode-Recommended:</span>
          <span className="font-medium text-accent">{modeChannel.channel}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Client Preferred:</span>
          <ChannelBadge channel={client.preferred_channel} size="sm" />
        </div>
      </div>

      {/* Confidence */}
      <ConfidenceBar confidence={confidence} mode={mode} />

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(client)}
        >
          <Eye className="w-4 h-4 mr-1.5" />
          View
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => onQuickAction(client)}
        >
          <Zap className="w-4 h-4 mr-1.5" />
          Quick Action
        </Button>
      </div>
    </Card>
  );
};
