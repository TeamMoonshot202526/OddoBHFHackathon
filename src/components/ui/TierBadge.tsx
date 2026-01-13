import { cn } from '@/lib/utils';
import { Tier } from '@/types';

interface TierBadgeProps {
  tier: Tier;
}

export const TierBadge = ({ tier }: TierBadgeProps) => {
  return (
    <span
      className={cn(
        'text-xs px-2 py-0.5 rounded font-medium',
        tier === 'existing'
          ? 'bg-accent/20 text-accent'
          : 'bg-muted text-muted-foreground'
      )}
    >
      {tier === 'existing' ? 'Existing' : 'New'}
    </span>
  );
};
