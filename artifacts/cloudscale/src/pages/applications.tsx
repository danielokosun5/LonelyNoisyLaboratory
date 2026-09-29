import { Activity, RotateCcw, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeading, TrafficReadout } from '@/components/dashboard-widgets';
import type { DashboardTelemetry } from '@/hooks/use-dashboard-telemetry';

export function ApplicationsPage({ telemetry }: { telemetry: DashboardTelemetry }) {
  return (
    <>
      <PageHeading eyebrow="Workspace" title="Applications" description="Manage the demo application and exercise its simulated infrastructure." />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <Card>
          <div className="flex items-start gap-3 px-5 pb-1 pt-5 sm:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Activity className="h-[18px] w-[18px]" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold">CloudScale demo application</h2>
                <Badge variant="healthy" className="px-1.5 py-0.5 text-[9px] uppercase tracking-wide">Active</Badge>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">The existing browser simulation drives the application traffic and cluster metrics shown throughout this dashboard.</p>
            </div>
          </div>
          <CardContent className="px-5 pb-5 pt-4 sm:px-6">
            <div className="grid grid-cols-2 gap-2.5">
              <TrafficReadout label="Current traffic" value={telemetry.state.requestsPerMin.toLocaleString()} unit="req/min" />
              <TrafficReadout label="Target traffic" value={telemetry.targetRequestsPerMin.toLocaleString()} unit="req/min" emphasis />
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-start gap-3 px-5 pb-1 pt-5 sm:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Zap className="h-[18px] w-[18px]" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold">Traffic lab</h2>
                <Badge variant="outline" className="border-primary/20 bg-primary/[0.05] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">Demo test</Badge>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Apply a controlled load burst and observe how capacity responds.</p>
            </div>
          </div>
          <CardContent className="px-5 pb-5 pt-4 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={telemetry.simulateTraffic} className="h-10 flex-1 gap-2 text-xs font-semibold">
                <Zap className="h-4 w-4" /> Run traffic spike
              </Button>
              <Button variant="outline" onClick={telemetry.reset} className="h-10 gap-2 text-xs">
                <RotateCcw className="h-3.5 w-3.5" /> Return to baseline
              </Button>
            </div>
            <div className="mt-4 flex gap-2.5 rounded-lg border border-border bg-muted/35 p-3">
              <Activity className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-[11px] leading-[1.65] text-muted-foreground">Each run raises the traffic target by up to 1,200 requests/min. The simulator adjusts load every second, scales on CPU thresholds, then eases the target back toward baseline.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
