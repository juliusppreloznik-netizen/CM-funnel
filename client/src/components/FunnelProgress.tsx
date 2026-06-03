import { cn } from "../lib/utils";

interface FunnelProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

/**
 * Visual step indicator shown at the top of each funnel step.
 */
export function FunnelProgress({
  currentStep,
  totalSteps,
  className,
}: FunnelProgressProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{percent}% complete</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
