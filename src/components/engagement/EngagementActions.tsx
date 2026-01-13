import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { Client } from '@/types';
import { Calendar, Clock, Mail, MessageSquare, Bell, CheckCircle, XCircle, AlertTriangle, ArrowUpCircle } from 'lucide-react';

interface EngagementActionsProps {
  client: Client;
}

export const EngagementActions = ({ client }: EngagementActionsProps) => {
  const { addEngagementLog, updateClientFunnelStage, addSignal } = useApp();
  const { toast } = useToast();
  
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [outcomeDialogOpen, setOutcomeDialogOpen] = useState(false);
  
  const [selectedSlot, setSelectedSlot] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const timeSlots = [
    'Today, 2:00 PM - 2:30 PM',
    'Tomorrow, 10:00 AM - 10:30 AM',
    'Tomorrow, 3:00 PM - 3:30 PM',
  ];

  const generateEmail = () => {
    const mode = client.current_mode || 'learning';
    let subject = '';
    let body = '';

    switch (mode) {
      case 'critical_alert':
        subject = `URGENT: Critical Market Alert - ${client.sector_interest} Sector`;
        body = `Dear ${client.client_name} Team,\n\nThis requires your immediate attention. We are seeing significant market disruption in the ${client.sector_interest} sector.\n\nCritical points:\n• Immediate risk exposure assessment required\n• Portfolio protection strategies available\n• Senior analyst standing by for direct call\n\nPlease contact me immediately. I am available for an urgent call within the hour.\n\nBest regards,\n${client.rm_name}\nODDO BHF Equity Research`;
        break;
      case 'early_alert':
        subject = `Urgent: Market Update - ${client.sector_interest} Sector Developments`;
        body = `Dear ${client.client_name} Team,\n\nGiven today's market developments in the ${client.sector_interest} sector, I wanted to reach out immediately to provide our latest perspective.\n\nKey points:\n• Recent volatility drivers and our view on duration\n• Portfolio implications and risk scenarios\n• Recommended positioning adjustments\n\nI'm available for an immediate call to discuss in detail. Please let me know your availability in the next 24 hours.\n\nBest regards,\n${client.rm_name}\nODDO BHF Equity Research`;
        break;
      case 'learning':
        subject = `${client.sector_interest} Sector Deep Dive - Exclusive Research`;
        body = `Dear ${client.client_name} Team,\n\nFollowing your recent engagement with our ${client.sector_interest} research, I wanted to share some additional insights that may be valuable for your analysis.\n\nAttached you'll find:\n• Our latest sector overview with key themes\n• Company-specific analysis on emerging opportunities\n• Upcoming webinar invitation on sector outlook\n\nWould you be interested in a focused discussion on any specific areas? I'm happy to arrange a call at your convenience.\n\nBest regards,\n${client.rm_name}\nODDO BHF Equity Research`;
        break;
      case 'alpha':
        subject = `Investment Idea: ${client.sector_interest} Opportunities - Action Required`;
        body = `Dear ${client.client_name} Team,\n\nBased on our recent analysis and your investment mandate, I've identified several compelling opportunities in the ${client.sector_interest} space that warrant immediate attention.\n\nHighlights:\n• 3 high-conviction ideas with significant upside potential\n• Sector tailwinds supporting our thesis\n• Proposed meeting to discuss implementation\n\nI'd welcome the opportunity to present these ideas in a dedicated session. Shall I send a formal meeting invitation?\n\nBest regards,\n${client.rm_name}\nODDO BHF Equity Research`;
        break;
    }

    setEmailSubject(subject);
    setEmailBody(body);
    setEmailDialogOpen(true);
  };

  const handleBookMeeting = () => {
    if (!selectedSlot) {
      toast({
        title: 'Please select a time slot',
        variant: 'destructive',
      });
      return;
    }

    addEngagementLog({
      client_id: client.client_id,
      action_type: 'meeting_booked',
      details: `Meeting scheduled: ${selectedSlot}`,
    });

    // Meeting booked moves directly to converted
    updateClientFunnelStage(client.client_id, 'converted');

    toast({
      title: 'Meeting Booked',
      description: `Meeting with ${client.client_name} scheduled for ${selectedSlot}. Client moved to Converted.`,
    });

    setMeetingDialogOpen(false);
    setSelectedSlot('');
  };

  const handleSendEmail = () => {
    addEngagementLog({
      client_id: client.client_id,
      action_type: 'email_sent',
      details: `Subject: ${emailSubject}`,
    });

    addSignal({
      client_id: client.client_id,
      signal_type: 'email_sent',
      signal_value: 1,
    });

    // Email sent moves to executed, then awaiting response
    updateClientFunnelStage(client.client_id, 'awaiting_response');

    toast({
      title: 'Email Sent',
      description: `Email sent to ${client.client_name}. Client moved to Awaiting Response.`,
    });

    setEmailDialogOpen(false);
    setEmailSubject('');
    setEmailBody('');
  };

  const handleSendChat = () => {
    if (!currentMessage.trim()) return;

    const newMessages = [...chatMessages, currentMessage];
    setChatMessages(newMessages);
    setCurrentMessage('');

    // Each chat message adds a signal
    addSignal({
      client_id: client.client_id,
      signal_type: 'chat_spike',
      signal_value: 1,
    });

    if (newMessages.length >= 2) {
      addEngagementLog({
        client_id: client.client_id,
        action_type: 'chat_message',
        details: `Bloomberg chat conversation (${newMessages.length} messages)`,
      });

      // Chat engagement moves to executed
      updateClientFunnelStage(client.client_id, 'executed');

      toast({
        title: 'Chat Logged',
        description: 'Conversation logged. Client moved to Executed.',
      });
    }
  };

  const handleNotifyAvailability = () => {
    addEngagementLog({
      client_id: client.client_id,
      action_type: 'availability_notified',
      details: 'Client wants to speak within 24h – 3 meeting slots proposed',
    });

    // Availability notification keeps client in recommended action
    updateClientFunnelStage(client.client_id, 'recommended_action');

    toast({
      title: 'Availability Notification Sent',
      description: `${client.client_name} will receive meeting slots. Task created in funnel.`,
    });
  };

  const handleOutcome = (outcome: 'meeting_booked' | 'client_responded' | 'no_response' | 'alert_resolved' | 'escalated') => {
    const outcomeLabels = {
      meeting_booked: 'Meeting Booked',
      client_responded: 'Client Responded',
      no_response: 'No Response',
      alert_resolved: 'Alert Resolved',
      escalated: 'Escalated to Senior Analyst',
    };

    addEngagementLog({
      client_id: client.client_id,
      action_type: 'email_sent',
      details: `Outcome logged: ${outcomeLabels[outcome]}`,
      outcome,
    });

    // Update funnel based on outcome
    if (outcome === 'meeting_booked' || outcome === 'client_responded') {
      updateClientFunnelStage(client.client_id, 'converted');
    } else if (outcome === 'no_response') {
      updateClientFunnelStage(client.client_id, 'awaiting_response');
    } else if (outcome === 'alert_resolved') {
      updateClientFunnelStage(client.client_id, 'executed');
    } else if (outcome === 'escalated') {
      updateClientFunnelStage(client.client_id, 'recommended_action');
    }

    const learningNotes: Record<string, string> = {
      meeting_booked: 'Client prefers direct engagement – prioritize meeting invites',
      client_responded: 'Email channel effective – continue nurturing',
      no_response: 'Consider alternative channel or timing adjustment',
      alert_resolved: 'Alert de-escalated – return to normal cadence',
      escalated: 'High-value opportunity – senior coverage required',
    };

    toast({
      title: 'Outcome Logged',
      description: `${outcomeLabels[outcome]}. Learning: ${learningNotes[outcome]}`,
    });

    setOutcomeDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground">Engagement Actions</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMeetingDialogOpen(true)}
            className="justify-start"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Meeting
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={generateEmail}
            className="justify-start"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChatDialogOpen(true)}
            className="justify-start"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Open Chat
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNotifyAvailability}
            className="justify-start"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notify Availability
          </Button>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => setOutcomeDialogOpen(true)}
        >
          Log Outcome
        </Button>
      </div>

      {/* Meeting Dialog */}
      <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Meeting with {client.client_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">Select a time slot:</p>
            {timeSlots.map((slot, idx) => (
              <Button
                key={idx}
                variant={selectedSlot === slot ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setSelectedSlot(slot)}
              >
                <Clock className="w-4 h-4 mr-2" />
                {slot}
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeetingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookMeeting}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email to {client.client_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Body</label>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={12}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloomberg Chat - {client.client_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted rounded-lg p-3 h-48 overflow-y-auto space-y-2">
              {chatMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Start a conversation...
                </p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className="bg-accent/20 text-sm p-2 rounded">
                    <span className="font-medium">You:</span> {msg}
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <Button onClick={handleSendChat}>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outcome Dialog */}
      <Dialog open={outcomeDialogOpen} onOpenChange={setOutcomeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Engagement Outcome</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 py-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleOutcome('meeting_booked')}
            >
              <CheckCircle className="w-4 h-4 mr-2 text-alpha" />
              Meeting Booked
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleOutcome('client_responded')}
            >
              <CheckCircle className="w-4 h-4 mr-2 text-accent" />
              Client Responded
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleOutcome('no_response')}
            >
              <XCircle className="w-4 h-4 mr-2 text-muted-foreground" />
              No Response
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleOutcome('alert_resolved')}
            >
              <AlertTriangle className="w-4 h-4 mr-2 text-learning" />
              Alert Resolved
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleOutcome('escalated')}
            >
              <ArrowUpCircle className="w-4 h-4 mr-2 text-early-alert" />
              Escalate to Senior Analyst
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
