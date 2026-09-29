import { Cpu, Server, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MetricCard, PageHeading } from '@/components/dashboard-widgets';
import { ScalingSteps } from '@/components/scaling-steps';
import type { DashboardTelemetry } from '@/hooks/use-dashboard-telemetry';

export function AutoScalingPage({ telemetry }: { telemetry: DashboardTelemetry }) {
  const scalingUp = telemetry.state.status === 'scaling' && telemetry.state.cpuPercent >= 25;

  return (
    <>
      <PageHeading eyebrow="Capacity management" title="Auto Scaling" description="Follow the simulated scaling thresholds and current instance capacity." />
      <section className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:gap-4">
        <MetricCard title="Active instances" value={telemetry.state.activeInstances.toString()} suffix="nodes" detail="Current group capacity" icon={Server} tone="primary" />
        <MetricCard title="Average CPU" value={`${telemetry.state.cpuPercent}%`} detail="Scale-out above 75%" icon={Cpu} tone={telemetry.state.cpuPercent >= 75 ? 'warning' : 'blue'} />
        <MetricCard title="Target traffic" value={telemetry.targetRequestsPerMin.toLocaleString()} suffix="req/min" detail="Current simulator target" icon={scalingUp ? TrendingUp : TrendingDown} tone="blue" />
      </section>

      <Card className="mb-4">
        <div className="px-5 pb-1 pt-5 sm:px-6">
          <h2 className="text-sm font-semibold">Scaling lifecycle</h2>
          <p className="mt-1 text-xs text-muted-foreground">Traffic, utilization, and group capacity update from the shared simulation state.</p>
        </div>
        <CardContent className="px-5 pb-5 pt-4 sm:px-6"><ScalingSteps /></CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <ThresholdCard title="Scale out" value="CPU above 75%" icon={TrendingUp} detail="Adds one or two instances based on the simulated load." />
        <ThresholdCard title="Scale in" value="CPU below 25%" icon={TrendingDown} detail="Removes one instance at a time after traffic returns to baseline." />
      </div>
    </>
  );
}

function ThresholdCard({ title, value, icon: Icon, detail }: { title: string; value: string; icon: typeof TrendingUp; detail: string }) {
  return (
    <Card>
      <CardContent className="flex gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Icon className="h-4 w-4" /></span>
        <span>
          <span className="block text-xs font-medium text-muted-foreground">{title}</span>
          <span className="mt-1 block text-sm font-semibold">{value}</span>
          <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{detail}</span>
        </span>
      </CardContent>
    </Card>
  );
}
