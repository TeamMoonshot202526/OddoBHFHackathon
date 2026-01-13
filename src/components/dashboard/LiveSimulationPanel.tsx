import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Client, ClientMode, Persona } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Zap, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react';

export const LiveSimulationPanel = () => {
  const { clients, addSignal } = useApp();
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.client_id || '');
  const [stressLevel, setStressLevel] = useState(50);

  const selectedClient = clients.find(c => c.client_id === selectedClientId);

  const triggerPanicScenario = () => {
    if (!selectedClient) return;
    
    addSignal({
      client_id: selectedClientId,
      signal_type: 'breaking_news_event',
      signal_value: 8,
      related_sector: selectedClient.sector_interest,
    });
    addSignal({
      client_id: selectedClientId,
      signal_type: 'repeat_check',
      signal_value: 5,
    });
    addSignal({
      client_id: selectedClientId,
      signal_type: 'stress_level',
      signal_value: stressLevel,
    });

    toast({
      title: 'Panic Scenario Triggered',
      description: `${selectedClient.client_name} now showing elevated panic signals`,
    });
  };

  const triggerLearningScenario = () => {
    if (!selectedClient) return;
    
    addSignal({
      client_id: selectedClientId,
      signal_type: 'read_daily_digest',
      signal_value: 25,
      related_sector: selectedClient.sector_interest,
    });
    addSignal({
      client_id: selectedClientId,
      signal_type: 'read_report',
      signal_value: 15,
      related_sector: selectedClient.sector_interest,
    });

    toast({
      title: 'Learning Scenario Triggered',
      description: `${selectedClient.client_name} now showing research engagement patterns`,
    });
  };

  const triggerAlphaScenario = () => {
    if (!selectedClient) return;
    
    addSignal({
      client_id: selectedClientId,
      signal_type: 'sector_spike',
      signal_value: 6,
      related_sector: selectedClient.sector_interest,
    });
    addSignal({
      client_id: selectedClientId,
      signal_type: 'meeting_request',
      signal_value: 1,
    });

    toast({
      title: 'Alpha Scenario Triggered',
      description: `${selectedClient.client_name} now showing alpha-seeking behavior`,
    });
  };

  return (
    <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm flex items-center gap-2 text-white">
          <Zap className="w-4 h-4 text-accent" />
          Simulation Tools
        </h3>
</div>

      <div className="space-y-4">
        {/* Client Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-white/70">Select Client</label>
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.client_id} value={client.client_id}>
                  {client.client_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stress Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-medium text-white/70">Stress Level</label>
            <span className="text-xs font-medium text-white">{stressLevel}%</span>
          </div>
          <Slider
            value={[stressLevel]}
            onValueChange={([val]) => setStressLevel(val)}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Trigger Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-early-alert/50 text-early-alert hover:bg-early-alert/10 px-2 text-xs"
            onClick={triggerPanicScenario}
          >
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span className="truncate">Alert</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-learning/50 text-learning hover:bg-learning/10 px-2 text-xs"
            onClick={triggerLearningScenario}
          >
            <BookOpen className="w-3 h-3 shrink-0" />
            <span className="truncate">Learn</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-alpha/50 text-alpha hover:bg-alpha/10 px-2 text-xs"
            onClick={triggerAlphaScenario}
          >
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span className="truncate">Alpha</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
