import { Client, EngagementPlan } from '@/types';
import { Card } from '@/components/ui/card';
import { ChannelBadge } from '@/components/ui/ChannelBadge';
import { Lightbulb, Calendar, Radio, MessageSquare, FileText } from 'lucide-react';
import { getModeRecommendedChannel } from '@/lib/intentEngine';

interface EngagementPlanCardProps {
  client: Client;
  plan: EngagementPlan;
}

const toneLabels = {
  conservative: 'Conservative',
  balanced: 'Balanced',
  aggressive: 'Aggressive',
};

const toneColors = {
  conservative: 'text-blue-600 bg-blue-50',
  balanced: 'text-accent bg-accent/10',
  aggressive: 'text-panic bg-panic/10',
};

export const EngagementPlanCard = ({ client, plan }: EngagementPlanCardProps) => {
  const mode = client.current_mode || 'learning';
  const modeChannel = getModeRecommendedChannel(mode, client.persona);

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-accent" />
        Client-Tailored Engagement Plan
      </h4>

      <div className="grid gap-3">
        {/* Why This Client Now */}
        <Card className="p-3 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-accent">1</span>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                Why This Client Now
              </h5>
              <p className="text-sm text-foreground leading-relaxed">
                {plan.why_now}
              </p>
            </div>
          </div>
        </Card>

        {/* Channel Strategy - NEW SUBSECTION */}
        <Card className="p-3 border-primary/20">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-muted-foreground">2</span>
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Channel Strategy & Tone
              </h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-accent/10 rounded">
                  <Radio className="w-4 h-4 text-accent" />
                  <div>
                    <span className="text-xs text-muted-foreground">Mode-Recommended: </span>
                    <span className="text-sm font-medium text-accent">{modeChannel.channel}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{modeChannel.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Client Preferred: </span>
                    <ChannelBadge channel={client.preferred_channel} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">Tone:</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${toneColors[plan.tone]}`}>
                    {toneLabels[plan.tone]}
                  </span>
                  {client.persona === 'hedge_fund' && (
                    <span className="text-xs text-muted-foreground italic">
                      (Hedge fund → always multi-channel)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* What to Send */}
        <Card className="p-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-muted-foreground">3</span>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                What to Send / Discuss
              </h5>
              <p className="text-sm text-foreground leading-relaxed">
                {plan.what_to_send}
              </p>
              {plan.content_asset && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-primary/5 rounded">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">{plan.content_asset}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Next Step */}
        <Card className="p-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-muted-foreground">4</span>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Next Funnel Step
              </h5>
              <p className="text-sm text-foreground leading-relaxed">
                {plan.next_step}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Communication Cadence */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h5 className="text-xs font-semibold text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          Communication Cadence
        </h5>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded w-14 text-center">
              Day 0
            </span>
            <p className="text-sm text-foreground">{plan.cadence.day0}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded w-14 text-center">
              Day 1
            </span>
            <p className="text-sm text-muted-foreground">{plan.cadence.day1}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded w-14 text-center">
              Day 3
            </span>
            <p className="text-sm text-muted-foreground">{plan.cadence.day3}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
