import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { NewsEvent, Client } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeBadge } from '@/components/ui/ModeBadge';
import { PersonaBadge } from '@/components/ui/PersonaBadge';
import { useToast } from '@/hooks/use-toast';
import { calculateClientRelevance } from '@/lib/intentEngine';
import { Newspaper, Zap, Clock, TrendingUp, TrendingDown, Minus, Users, Target, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

const NewsFlow = () => {
  const { events, clients, addSignal, updateClientFunnelStage, addEngagementLog } = useApp();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<NewsEvent | null>(null);
  const [impactDrawerOpen, setImpactDrawerOpen] = useState(false);

  const quickTakes = events.filter(e => e.source === 'quick_take');
  const dailyDigests = events.filter(e => e.source === 'daily_digest');

  const getImpactedClients = (event: NewsEvent) => {
    return clients
      .map(client => {
        const relevance_score = calculateClientRelevance(client, event);
        
        // Predict mode impact based on event characteristics
        let predicted_mode_impact: 'early_alert' | 'critical_alert' | 'learning' | 'alpha';
        let impact_description: string;
        
        if (event.sentiment === 'negative' && event.urgency === 'high') {
          predicted_mode_impact = 'critical_alert';
          impact_description = 'May trigger Critical Alert – immediate senior outreach required';
        } else if (event.sentiment === 'negative') {
          predicted_mode_impact = 'early_alert';
          impact_description = 'Could elevate concern – monitor closely';
        } else if (event.sentiment === 'positive' && (event.urgency === 'high' || event.urgency === 'medium')) {
          predicted_mode_impact = 'alpha';
          impact_description = 'Supports Alpha outreach – opportunity signal';
        } else {
          predicted_mode_impact = 'learning';
          impact_description = 'Supports Learning engagement – educational angle';
        }
        
        // Confidence based on relevance and signal count
        const confidence = Math.min(0.50 + (relevance_score / 150), 0.88);
        
        // Recommended push action
        let recommended_action: string;
        if (predicted_mode_impact === 'critical_alert') {
          recommended_action = `Immediate call on ${event.company} crisis`;
        } else if (predicted_mode_impact === 'early_alert') {
          recommended_action = `Send immediate ${event.company} context via chat`;
        } else if (predicted_mode_impact === 'alpha') {
          recommended_action = `Share ${event.company} opportunity thesis`;
        } else {
          recommended_action = `Include in ${event.sector} digest email`;
        }

        return {
          client,
          relevance_score,
          predicted_mode_impact,
          impact_description,
          confidence,
          recommended_action,
        };
      })
      .filter(c => c.relevance_score > 25)
      .sort((a, b) => b.relevance_score - a.relevance_score);
  };

  const handleEventClick = (event: NewsEvent) => {
    setSelectedEvent(event);
    setImpactDrawerOpen(true);
  };

  const handlePushAction = (client: Client, event: NewsEvent, impact: ReturnType<typeof getImpactedClients>[0]) => {
    // Add signal based on event type
    addSignal({
      client_id: client.client_id,
      signal_type: event.urgency === 'high' && event.sentiment === 'negative' 
        ? 'breaking_news_event' 
        : event.sentiment === 'positive' 
        ? 'read_quick_take'
        : 'read_daily_digest',
      signal_value: event.urgency === 'high' ? 7 : event.urgency === 'medium' ? 4 : 2,
      related_event_id: event.event_id,
      related_sector: event.sector,
      related_company: event.company,
    });
    
    // Move to recommended action
    updateClientFunnelStage(client.client_id, 'recommended_action');
    
    // Log engagement
    addEngagementLog({
      client_id: client.client_id,
      action_type: 'availability_notified',
      details: `Action pushed: ${event.title} → ${impact.recommended_action}`,
    });
    
    toast({ 
      title: 'Action Pushed to Client', 
      description: `${client.client_name}: Signal created, funnel updated` 
    });
  };

  const EventCard = ({ event }: { event: NewsEvent }) => (
    <Card className="p-4 card-hover cursor-pointer" onClick={() => handleEventClick(event)}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
            event.sentiment === 'positive' ? 'bg-alpha/20 text-alpha' :
            event.sentiment === 'negative' ? 'bg-early-alert/20 text-early-alert' : 'bg-muted text-muted-foreground'
          }`}>
            {event.sentiment === 'positive' ? <TrendingUp className="w-3 h-3 inline mr-1" /> :
             event.sentiment === 'negative' ? <TrendingDown className="w-3 h-3 inline mr-1" /> :
             <Minus className="w-3 h-3 inline mr-1" />}
            {event.sentiment}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            event.urgency === 'high' ? 'bg-critical-alert/20 text-critical-alert' :
            event.urgency === 'medium' ? 'bg-learning/20 text-learning' : 'bg-muted text-muted-foreground'
          }`}>{event.urgency}</span>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{event.summary}</p>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <span className="bg-muted px-2 py-0.5 rounded">{event.sector}</span>
        <span>{event.company}</span>
        <span className="ml-auto text-accent flex items-center gap-1">
          <Users className="w-3 h-3" />
          Click to see impact
        </span>
      </div>
    </Card>
  );

  const impactedClients = selectedEvent ? getImpactedClients(selectedEvent) : [];

  // Generate heatmap data
  const getRelevanceColor = (score: number) => {
    if (score >= 70) return 'bg-critical-alert text-white';
    if (score >= 50) return 'bg-learning text-white';
    if (score >= 30) return 'bg-accent/60 text-white';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-white flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-accent" /> News Flow
        </h1>
        <p className="text-white/60 text-sm">Click any event to see impacted clients and push actions</p>
      </div>

      <Tabs defaultValue="quick_takes">
        <TabsList>
          <TabsTrigger value="quick_takes" className="gap-2"><Zap className="w-4 h-4" /> Quick Takes</TabsTrigger>
          <TabsTrigger value="daily_digests">Daily Digests</TabsTrigger>
        </TabsList>
        <TabsContent value="quick_takes" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {quickTakes.map(event => <EventCard key={event.event_id} event={event} />)}
          </div>
        </TabsContent>
        <TabsContent value="daily_digests" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {dailyDigests.map(event => <EventCard key={event.event_id} event={event} />)}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={impactDrawerOpen} onOpenChange={setImpactDrawerOpen}>
        <SheetContent className="w-full sm:max-w-xl p-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" /> Impacted Clients & Recommended Push
                </SheetTitle>
                {selectedEvent && (
                  <div className="text-left space-y-1">
                    <p className="font-medium text-foreground">{selectedEvent.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.company} • {selectedEvent.sector}</p>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        selectedEvent.sentiment === 'positive' ? 'bg-alpha/20 text-alpha' :
                        selectedEvent.sentiment === 'negative' ? 'bg-early-alert/20 text-early-alert' : 'bg-muted'
                      }`}>{selectedEvent.sentiment}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        selectedEvent.urgency === 'high' ? 'bg-critical-alert/20 text-critical-alert' : 'bg-muted'
                      }`}>{selectedEvent.urgency} urgency</span>
                    </div>
                  </div>
                )}
              </SheetHeader>

              {/* Compact Relevance Heatmap */}
              {impactedClients.length > 0 && (
                <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Relevance Heatmap
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {impactedClients.map(({ client, relevance_score }) => (
                      <div
                        key={client.client_id}
                        className={`text-xs px-2 py-1 rounded ${getRelevanceColor(relevance_score)}`}
                        title={`${client.client_name}: ${relevance_score}%`}
                      >
                        {client.client_name.split(' ')[0]} {relevance_score}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Impact Cards */}
              <div className="space-y-3">
                {impactedClients.map(({ client, relevance_score, predicted_mode_impact, impact_description, confidence, recommended_action }) => (
                  <Card key={client.client_id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-foreground">{client.client_name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <PersonaBadge persona={client.persona} size="sm" />
                        </div>
                      </div>
                      <ModeBadge mode={predicted_mode_impact} size="sm" />
                    </div>
                    
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Relevance:</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              relevance_score >= 70 ? 'bg-critical-alert' : 
                              relevance_score >= 50 ? 'bg-learning' : 'bg-accent'
                            }`}
                            style={{ width: `${relevance_score}%` }}
                          />
                        </div>
                        <span className="font-medium">{relevance_score}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-medium">{Math.round(confidence * 100)}%</span>
                      </div>
                    </div>

                    <div className="p-2 bg-muted/50 rounded mb-3">
                      <div className="flex items-start gap-2 text-sm">
                        {(predicted_mode_impact === 'early_alert' || predicted_mode_impact === 'critical_alert') ? (
                          <AlertTriangle className={`w-4 h-4 mt-0.5 ${predicted_mode_impact === 'critical_alert' ? 'text-critical-alert' : 'text-early-alert'}`} />
                        ) : predicted_mode_impact === 'alpha' ? (
                          <Sparkles className="w-4 h-4 text-alpha mt-0.5" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-learning mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{impact_description}</p>
                          <p className="text-muted-foreground mt-1">{recommended_action}</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
                      onClick={() => selectedEvent && handlePushAction(client, selectedEvent, { client, relevance_score, predicted_mode_impact, impact_description, confidence, recommended_action })}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Push Action
                    </Button>
                  </Card>
                ))}
                {impactedClients.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No significantly impacted clients for this event</p>
                )}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NewsFlow;
