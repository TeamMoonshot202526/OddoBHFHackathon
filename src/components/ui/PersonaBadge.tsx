import { cn } from '@/lib/utils';
import { Persona } from '@/types';

interface PersonaBadgeProps {
  persona: Persona;
  size?: 'sm' | 'md';
}

const personaConfig: Record<Persona, { label: string; className: string }> = {
  hedge_fund: {
    label: 'Hedge Fund',
    className: 'bg-hedgeFund/15 text-hedgeFund border-hedgeFund/30',
  },
  asset_manager: {
    label: 'Asset Manager',
    className: 'bg-assetManager/15 text-assetManager border-assetManager/30',
  },
  pension_fund: {
    label: 'Pension Fund',
    className: 'bg-pensionFund/15 text-pensionFund border-pensionFund/30',
  },
  family_office: {
    label: 'Family Office',
    className: 'bg-familyOffice/15 text-familyOffice border-familyOffice/30',
  },
  corporate_treasury: {
    label: 'Corporate Treasury',
    className: 'bg-corporateTreasury/15 text-corporateTreasury border-corporateTreasury/30',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export const PersonaBadge = ({ persona, size = 'md' }: PersonaBadgeProps) => {
  const config = personaConfig[persona];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-md border',
        config.className,
        sizeClasses[size]
      )}
    >
      {config.label}
    </span>
  );
};
