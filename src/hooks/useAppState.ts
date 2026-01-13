import { useState, useEffect, useCallback } from 'react';
import { Client, NewsEvent, Signal, EngagementLog, FunnelStage } from '@/types';
import {
  getStoredClients,
  getStoredEvents,
  getStoredSignals,
  getStoredEngagementLogs,
  saveClients,
  saveEvents,
  saveSignals,
  saveEngagementLogs,
  initialClients,
  initialEvents,
  initialSignals,
} from '@/data/mockData';
import { classifyIntent, generateEngagementPlan } from '@/lib/intentEngine';

export const useAppState = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [engagementLogs, setEngagementLogs] = useState<EngagementLog[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const storedClients = getStoredClients();
    const storedEvents = getStoredEvents();
    const storedSignals = getStoredSignals();
    const storedLogs = getStoredEngagementLogs();

    setClients(storedClients);
    setEvents(storedEvents);
    setSignals(storedSignals);
    setEngagementLogs(storedLogs);
    setIsInitialized(true);
  }, []);

  // Persist changes
  useEffect(() => {
    if (isInitialized) {
      saveClients(clients);
    }
  }, [clients, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveEvents(events);
    }
  }, [events, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveSignals(signals);
    }
  }, [signals, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveEngagementLogs(engagementLogs);
    }
  }, [engagementLogs, isInitialized]);

  // Classify all clients whenever signals change
  useEffect(() => {
    if (isInitialized && signals.length > 0) {
      const updatedClients = clients.map(client => {
        const clientSignals = signals.filter(s => s.client_id === client.client_id);
        const relatedEvents = events.filter(e => 
          clientSignals.some(s => s.related_event_id === e.event_id)
        );
        const classification = classifyIntent(client, clientSignals, relatedEvents);
        return {
          ...client,
          current_mode: classification.mode,
          confidence: classification.confidence,
        };
      });
      
      // Only update if there are actual changes
      const hasChanges = updatedClients.some((updated, idx) => 
        updated.current_mode !== clients[idx].current_mode ||
        updated.confidence !== clients[idx].confidence
      );
      
      if (hasChanges) {
        setClients(updatedClients);
      }
    }
  }, [signals, events, isInitialized]);

  const addSignal = useCallback((signal: Omit<Signal, 'signal_id' | 'timestamp'>) => {
    const newSignal: Signal = {
      ...signal,
      signal_id: `sig_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setSignals(prev => [...prev, newSignal]);
    return newSignal;
  }, []);

  const addEngagementLog = useCallback((log: Omit<EngagementLog, 'log_id' | 'timestamp'>) => {
    const newLog: EngagementLog = {
      ...log,
      log_id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setEngagementLogs(prev => [...prev, newLog]);
    return newLog;
  }, []);

  const updateClientFunnelStage = useCallback((clientId: string, stage: FunnelStage) => {
    setClients(prev => prev.map(c => 
      c.client_id === clientId ? { ...c, funnel_stage: stage } : c
    ));
  }, []);

  const updateClientPreferredChannel = useCallback((clientId: string, channel: Client['preferred_channel']) => {
    setClients(prev => prev.map(c => 
      c.client_id === clientId ? { ...c, preferred_channel: channel } : c
    ));
  }, []);

  const resetData = useCallback(() => {
    setClients(initialClients);
    setEvents(initialEvents);
    setSignals(initialSignals);
    setEngagementLogs([]);
  }, []);

  const getClientSignals = useCallback((clientId: string) => {
    return signals.filter(s => s.client_id === clientId);
  }, [signals]);

  const getClientLogs = useCallback((clientId: string) => {
    return engagementLogs.filter(l => l.client_id === clientId);
  }, [engagementLogs]);

  const getClientClassification = useCallback((client: Client) => {
    const clientSignals = signals.filter(s => s.client_id === client.client_id);
    const relatedEvents = events.filter(e => 
      clientSignals.some(s => s.related_event_id === e.event_id)
    );
    return classifyIntent(client, clientSignals, relatedEvents);
  }, [signals, events]);

  const getClientEngagementPlan = useCallback((client: Client) => {
    const classification = getClientClassification(client);
    const clientSignals = signals.filter(s => s.client_id === client.client_id);
    const relatedEvents = events.filter(e => 
      clientSignals.some(s => s.related_event_id === e.event_id)
    );
    return generateEngagementPlan(client, classification, clientSignals, relatedEvents);
  }, [getClientClassification, signals, events]);

  return {
    clients,
    events,
    signals,
    engagementLogs,
    isInitialized,
    addSignal,
    addEngagementLog,
    updateClientFunnelStage,
    updateClientPreferredChannel,
    resetData,
    getClientSignals,
    getClientLogs,
    getClientClassification,
    getClientEngagementPlan,
    setClients,
    setSignals,
  };
};
