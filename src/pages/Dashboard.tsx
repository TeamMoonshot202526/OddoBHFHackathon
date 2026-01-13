import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Client, ClientMode, Persona } from '@/types';
import { ClientCard } from '@/components/dashboard/ClientCard';
import { ClientDrawer } from '@/components/dashboard/ClientDrawer';
import { QuickActionDialog } from '@/components/dashboard/QuickActionDialog';
import { LiveSimulationPanel } from '@/components/dashboard/LiveSimulationPanel';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Users, Filter, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { clients, addSignal } = useApp();
  const { toast } = useToast();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  
  // Filters
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [personaFilter, setPersonaFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  const sectors = useMemo(() => 
    [...new Set(clients.map(c => c.sector_interest))],
    [clients]
  );

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      if (modeFilter !== 'all' && client.current_mode !== modeFilter) return false;
      if (personaFilter !== 'all' && client.persona !== personaFilter) return false;
      if (tierFilter !== 'all' && client.tier !== tierFilter) return false;
      if (sectorFilter !== 'all' && client.sector_interest !== sectorFilter) return false;
      return true;
    });
  }, [clients, modeFilter, personaFilter, tierFilter, sectorFilter]);

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setDrawerOpen(true);
  };

  const handleQuickAction = (client: Client) => {
    setSelectedClient(client);
    setQuickActionOpen(true);
  };

  const handleDemoScenario = (scenario: 'early_alert' | 'critical_alert' | 'learning' | 'alpha') => {
    // Pick a client for demo
    const demoClient = clients[Math.floor(Math.random() * clients.length)];
    
    switch (scenario) {
      case 'early_alert':
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'breaking_news_event',
          signal_value: 5,
          related_sector: demoClient.sector_interest,
        });
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'repeat_check',
          signal_value: 3,
        });
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'stress_level',
          signal_value: 65,
        });
        break;
      case 'critical_alert':
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'breaking_news_event',
          signal_value: 9,
          related_sector: demoClient.sector_interest,
        });
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'repeat_check',
          signal_value: 8,
        });
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'stress_level',
          signal_value: 95,
        });
        break;
      case 'learning':
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'read_daily_digest',
          signal_value: 30,
          related_sector: demoClient.sector_interest,
        });
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'read_report',
          signal_value: 20,
        });
        break;
      case 'alpha':
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'sector_spike',
          signal_value: 8,
          related_sector: demoClient.sector_interest,
        });
        addSignal({
          client_id: demoClient.client_id,
          signal_type: 'meeting_request',
          signal_value: 1,
        });
        break;
    }

    const scenarioLabels = {
      early_alert: 'Early Alert',
      critical_alert: 'Critical Alert',
      learning: 'Learning',
      alpha: 'Alpha',
    };

    toast({
      title: `${scenarioLabels[scenario]} Scenario Triggered`,
      description: `Applied to ${demoClient.client_name}`,
    });
  };

  // Stats
  const earlyAlertCount = clients.filter(c => c.current_mode === 'early_alert').length;
  const criticalAlertCount = clients.filter(c => c.current_mode === 'critical_alert').length;
  const learningCount = clients.filter(c => c.current_mode === 'learning').length;
  const alphaCount = clients.filter(c => c.current_mode === 'alpha').length;

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-white">Client Dashboard</h1>
          <p className="text-white/60 text-sm">Real-time client intent detection and engagement</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="stat-card bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-2 text-white/70 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">Total Clients</span>
          </div>
          <div className="text-2xl font-bold text-white">{clients.length}</div>
        </div>
        <div className="stat-card bg-white/10 backdrop-blur-sm border-early-alert/40">
          <div className="flex items-center gap-2 text-early-alert mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold">Early Alert</span>
          </div>
          <div className="text-2xl font-bold text-early-alert">{earlyAlertCount}</div>
        </div>
        <div className="stat-card bg-white/10 backdrop-blur-sm border-critical-alert/40">
          <div className="flex items-center gap-2 text-critical-alert mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold">Critical Alert</span>
          </div>
          <div className="text-2xl font-bold text-critical-alert">{criticalAlertCount}</div>
        </div>
        <div className="stat-card bg-white/10 backdrop-blur-sm border-learning/40">
          <div className="flex items-center gap-2 text-learning mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-bold">Learning Mode</span>
          </div>
          <div className="text-2xl font-bold text-learning">{learningCount}</div>
        </div>
        <div className="stat-card bg-white/10 backdrop-blur-sm border-alpha/40">
          <div className="flex items-center gap-2 text-alpha mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-bold">Alpha Seeking</span>
          </div>
          <div className="text-2xl font-bold text-alpha">{alphaCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-9 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="early_alert">Early Alert</SelectItem>
                <SelectItem value="critical_alert">Critical Alert</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="alpha">Alpha</SelectItem>
              </SelectContent>
            </Select>
            <Select value={personaFilter} onValueChange={setPersonaFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Persona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Personas</SelectItem>
                <SelectItem value="hedge_fund">Hedge Fund</SelectItem>
                <SelectItem value="asset_manager">Asset Manager</SelectItem>
                <SelectItem value="pension_fund">Pension Fund</SelectItem>
                <SelectItem value="family_office">Family Office</SelectItem>
                <SelectItem value="corporate_treasury">Corporate Treasury</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="existing">Existing</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client Grid */}
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClients.map(client => (
              <ClientCard
                key={client.client_id}
                client={client}
                onView={handleViewClient}
                onQuickAction={handleQuickAction}
              />
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No clients match the current filters
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-3">
          <LiveSimulationPanel />
        </div>
      </div>

      {/* Client Drawer */}
      <ClientDrawer
        client={selectedClient}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Quick Action Dialog */}
      <QuickActionDialog
        client={selectedClient}
        open={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
