import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { clients, engagementLogs } = useApp();

  const modeData = useMemo(() => [
    { name: 'Early Alert', value: clients.filter(c => c.current_mode === 'early_alert').length, color: 'hsl(0, 84%, 60%)' },
    { name: 'Critical Alert', value: clients.filter(c => c.current_mode === 'critical_alert').length, color: 'hsl(0, 72%, 40%)' },
    { name: 'Learning', value: clients.filter(c => c.current_mode === 'learning').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Alpha', value: clients.filter(c => c.current_mode === 'alpha').length, color: 'hsl(142, 71%, 45%)' },
  ], [clients]);

  const personaData = useMemo(() => [
    { name: 'Hedge Fund', count: clients.filter(c => c.persona === 'hedge_fund').length },
    { name: 'Asset Manager', count: clients.filter(c => c.persona === 'asset_manager').length },
    { name: 'Pension Fund', count: clients.filter(c => c.persona === 'pension_fund').length },
    { name: 'Family Office', count: clients.filter(c => c.persona === 'family_office').length },
    { name: 'Corporate', count: clients.filter(c => c.persona === 'corporate_treasury').length },
  ], [clients]);

  const funnelData = useMemo(() => [
    { stage: 'New', count: clients.filter(c => c.funnel_stage === 'new_signals').length },
    { stage: 'Recommended', count: clients.filter(c => c.funnel_stage === 'recommended_action').length },
    { stage: 'Executed', count: clients.filter(c => c.funnel_stage === 'executed').length },
    { stage: 'Awaiting', count: clients.filter(c => c.funnel_stage === 'awaiting_response').length },
    { stage: 'Converted', count: clients.filter(c => c.funnel_stage === 'converted').length },
  ], [clients]);

  const outcomes = useMemo(() => {
    const grouped = engagementLogs.reduce((acc, log) => {
      if (log.outcome) acc[log.outcome] = (acc[log.outcome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([outcome, count]) => ({ outcome: outcome.replace(/_/g, ' '), count }));
  }, [engagementLogs]);

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-accent" /> Analytics
        </h1>
        <p className="text-white/60 text-sm">Performance insights and client behavior patterns</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Mode Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={modeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {modeData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Clients by Persona</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={personaData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(180, 100%, 36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Funnel Conversion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData}>
              <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(213, 72%, 14%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Engagement Outcomes</h3>
          {outcomes.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No outcomes logged yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={outcomes} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="outcome" type="category" tick={{ fontSize: 10 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(142, 71%, 45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
