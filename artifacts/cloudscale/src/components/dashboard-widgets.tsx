import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MetricCardProps = {
  title: string;
  value: string;
  suffix?: string;
  detail: string;
  icon: LucideIcon;
  tone: 'primary' | 'blue' | 'success' | 'warning' | 'danger';
};

const toneStyles = {
  primary: 'bg-primary/10 text-primary',
  blue: 'bg-chart-2/10 text-chart-2',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-destructive/10 text-destructive',
};

export function MetricCard({ title, value, suffix, detail, icon: Icon, tone }: MetricCardProps) {
  return (
    <Card className="metric-card min-w-0">
      <CardContent className="p-4 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] font-medium text-muted-foreground">{title}</p>
          <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', toneStyles[tone])}>
            <Icon className="h-[15px] w-[15px]" strokeWidth={1.9} />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="truncate font-mono text-[25px] font-semibold leading-none tracking-[-0.055em] tabular-nums text-foreground sm:text-[27px]">{value}</span>
          {suffix && <span className="shrink-0 text-[10px] text-muted-foreground">{suffix}</span>}
        </div>
        <p className="mt-2 truncate text-[10px] text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
        <h1 className="text-[25px] font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-[29px]">{title}</h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function TrafficReadout({ label, value, unit, emphasis = false }: { label: string; value: string; unit: string; emphasis?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 px-3 py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={cn('mt-1 font-mono text-lg font-semibold tabular-nums', emphasis ? 'text-primary' : 'text-foreground')}>
        {value}<span className="ml-1 text-[9px] font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}
