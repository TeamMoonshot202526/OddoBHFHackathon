import { cn } from '@/lib/utils';
import { PreferredChannel } from '@/types';
import { Mail, MessageSquare, Phone, MessagesSquare } from 'lucide-react';

interface ChannelBadgeProps {
  channel: PreferredChannel;
  size?: 'sm' | 'md';
}

const channelConfig: Record<PreferredChannel, { label: string; icon: any; className: string }> = {
  email: {
    label: 'Email',
    icon: Mail,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  bloomberg_chat: {
    label: 'Bloomberg',
    icon: MessageSquare,
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  teams_chat: {
    label: 'Teams',
    icon: MessagesSquare,
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  call: {
    label: 'Call',
    icon: Phone,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
};

export const ChannelBadge = ({ channel, size = 'md' }: ChannelBadgeProps) => {
  const config = channelConfig[channel];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-md border',
        config.className,
        sizeClasses[size]
      )}
    >
      <Icon className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      {config.label}
    </span>
  );
};
