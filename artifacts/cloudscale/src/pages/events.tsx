import { Card, CardContent } from '@/components/ui/card';
import { PageHeading } from '@/components/dashboard-widgets';
import { LiveEvents } from '@/components/live-events';
import type { DashboardTelemetry } from '@/hooks/use-dashboard-telemetry';

export function EventsPage({ telemetry }: { telemetry: DashboardTelemetry }) {
  return (
    <>
      <PageHeading eyebrow="Activity" title="Events" description="Simulation signals, health changes, and scaling activity in time order." />
      <Card>
        <div className="flex items-start justify-between px-5 pb-2 pt-5 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold">Live events</h2>
            <p className="mt-1 text-xs text-muted-foreground">Events are generated from the shared simulation state.</p>
          </div>
          <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">{telemetry.events.length} events</span>
        </div>
        <CardContent className="px-3 pb-3 pt-1 sm:px-4"><LiveEvents events={telemetry.events} limit={20} /></CardContent>
      </Card>
    </>
  );
}
