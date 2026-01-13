import { cn } from '@/lib/utils';
import { ClientMode } from '@/types';
import { AlertTriangle, BookOpen, TrendingUp } from 'lucide-react';

interface ModeBadgeProps {
  mode: ClientMode;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const modeConfig = {
  early_alert: {
    label: 'Early Alert',
    icon: AlertTriangle,
    className: 'bg-early-alert text-early-alert-foreground',
  },
  critical_alert: {
    label: 'Critical Alert',
    icon: AlertTriangle,
    className: 'bg-critical-alert text-critical-alert-foreground',
  },
  learning: {
    label: 'Learning',
    icon: BookOpen,
    className: 'bg-learning text-learning-foreground',
  },
  alpha: {
    label: 'Alpha',
    icon: TrendingUp,
    className: 'bg-alpha text-alpha-foreground',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export const ModeBadge = ({ mode, size = 'md', showIcon = true }: ModeBadgeProps) => {
  // Handle legacy 'panic' mode and fallback for unknown modes
  const normalizedMode = mode === ('panic' as string) ? 'early_alert' : mode;
  const config = modeConfig[normalizedMode] || modeConfig.learning;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full',
        config.className,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={cn(size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />}
      {config.label}
    </span>
  );
};
