import { useMemo } from 'react';
import { Client } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ModeBadge } from '@/components/ui/ModeBadge';
import { PersonaBadge } from '@/components/ui/PersonaBadge';
import { TierBadge } from '@/components/ui/TierBadge';
import { ChannelBadge } from '@/components/ui/ChannelBadge';
import { AISonarDecision } from './AISonarDecision';
import { EngagementPlanCard } from '@/components/engagement/EngagementPlanCard';
import { EngagementActions } from '@/components/engagement/EngagementActions';
import { MapPin, Briefcase, User, Calendar, FileText } from 'lucide-react';

interface ClientDrawerProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
}

export const ClientDrawer = ({ client, open, onClose }: ClientDrawerProps) => {
  const { getClientEngagementPlan, getClientLogs } = useApp();

  const engagementPlan = useMemo(() => {
    if (!client) return null;
    return getClientEngagementPlan(client);
  }, [client, getClientEngagementPlan]);

  const logs = useMemo(() => {
    if (!client) return [];
    return getClientLogs(client.client_id).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [client, getClientLogs]);

  if (!client) return null;

  const mode = client.current_mode || 'learning';

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Header */}
            <SheetHeader className="text-left mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <SheetTitle className="text-2xl font-bold text-foreground mb-2">
                    {client.client_name}
                  </SheetTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <PersonaBadge persona={client.persona} />
                    <TierBadge tier={client.tier} />
                    <ModeBadge mode={mode} />
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Overview Section */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Sector:</span>
                  <span className="font-medium">{client.sector_interest}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-medium">{client.region}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">RM:</span>
                  <span className="font-medium">{client.rm_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Channel:</span>
                  <ChannelBadge channel={client.preferred_channel} size="sm" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Relationship Score</span>
                  <span className="font-medium">{client.relationship_score}/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${client.relationship_score}%` }}
                  />
                </div>
              </div>
            </section>

            <Separator className="my-6" />

            {/* AI Sonar Decision */}
            <section className="mb-6">
              <AISonarDecision client={client} />
            </section>

            <Separator className="my-6" />

            {/* Engagement Plan */}
            {engagementPlan && (
              <section className="mb-6">
                <EngagementPlanCard client={client} plan={engagementPlan} />
              </section>
            )}

            <Separator className="my-6" />

            {/* Engagement Actions */}
            <section className="mb-6">
              <EngagementActions client={client} />
            </section>

            <Separator className="my-6" />

            {/* Engagement History */}
            <section>
              <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Engagement History
              </h4>
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No engagement history yet
                </p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div 
                      key={log.log_id}
                      className="p-3 bg-muted/50 rounded-lg text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium capitalize">
                          {log.action_type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{log.details}</p>
                      {log.outcome && (
                        <div className="mt-1 text-xs text-accent font-medium">
                          Outcome: {log.outcome.replace(/_/g, ' ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
