import {
  Activity,
  ArrowUpRight,
  Check,
  CircleAlert,
  CircleCheck,
  Server,
  Zap,
} from 'lucide-react';
import type { DashboardEvent, DashboardEventKind } from '@/hooks/use-dashboard-telemetry';

const eventStyles: Record<DashboardEventKind, { icon: typeof Activity; className: string }> = {
  healthy: { icon: CircleCheck, className: 'text-success bg-success/10' },
  traffic: { icon: Zap, className: 'text-primary bg-primary/10' },
  threshold: { icon: CircleAlert, className: 'text-warning bg-warning/10' },
  scaling: { icon: ArrowUpRight, className: 'text-chart-2 bg-chart-2/10' },
  instance: { icon: Server, className: 'text-primary bg-primary/10' },
  stabilized: { icon: Check, className: 'text-success bg-success/10' },
};

function relativeTime(timestamp: number, now: number) {
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export function LiveEvents({ events, limit = 6 }: { events: DashboardEvent[]; limit?: number }) {
  const now = Date.now();

  return (
    <div id="events" className="space-y-0.5">
      {events.slice(0, limit).map((event) => {
        const style = eventStyles[event.kind];
        const Icon = style.icon;

        return (
          <article key={event.id} className="flex gap-3 rounded-lg px-2.5 py-3 transition-colors hover:bg-muted/40">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.className}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-5 text-foreground">{event.title}</p>
                <time className="shrink-0 pt-0.5 text-[11px] text-muted-foreground" dateTime={new Date(event.timestamp).toISOString()}>
                  {relativeTime(event.timestamp, now)}
                </time>
              </div>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{event.description}</p>
            </div>
          </article>
        );
      })}
      {events.length === 0 && (
        <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
          No system events yet.
        </div>
      )}
    </div>
  );
}
