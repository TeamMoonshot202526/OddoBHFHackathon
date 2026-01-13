import { Client } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModeBadge } from '@/components/ui/ModeBadge';
import { PersonaBadge } from '@/components/ui/PersonaBadge';
import { EngagementActions } from '@/components/engagement/EngagementActions';

interface QuickActionDialogProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
}

export const QuickActionDialog = ({ client, open, onClose }: QuickActionDialogProps) => {
  if (!client) return null;

  const mode = client.current_mode || 'learning';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold">
                {client.client_name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <PersonaBadge persona={client.persona} size="sm" />
                <ModeBadge mode={mode} size="sm" />
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <EngagementActions client={client} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
