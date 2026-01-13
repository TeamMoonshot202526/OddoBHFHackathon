import { cn } from '@/lib/utils';
import { ClientMode } from '@/types';

interface ConfidenceBarProps {
  confidence: number;
  mode: ClientMode;
  showLabel?: boolean;
}

const modeColors: Record<string, string> = {
  early_alert: 'bg-early-alert',
  critical_alert: 'bg-critical-alert',
  learning: 'bg-learning',
  alpha: 'bg-alpha',
  panic: 'bg-early-alert', // Legacy fallback
};

export const ConfidenceBar = ({ confidence, mode, showLabel = true }: ConfidenceBarProps) => {
  const percentage = Math.round(confidence * 100);

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
      <div className="confidence-bar">
        <div
          className={cn('confidence-fill', modeColors[mode])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
