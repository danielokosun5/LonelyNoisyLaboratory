import { Activity, Cpu, Gauge, Server, ShieldCheck, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MetricCard, PageHeading } from '@/components/dashboard-widgets';
import { TrafficChart } from '@/components/traffic-chart';
import type { InfrastructureData } from '@/data/infrastructure';

export function MonitoringPage({ telemetry }: { telemetry: InfrastructureData }) {
  const { metrics } = telemetry;

  return (
    <>
      <PageHeading eyebrow="Observability" title="Monitoring" description="Live demo telemetry for request volume, compute utilization, and service health." />
      <section aria-label="Monitoring metrics" className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:gap-4 2xl:grid-cols-6">
        <MetricCard title="Active instances" value={telemetry.autoScalingGroup.currentCapacity.toString()} suffix="nodes" detail="Current group capacity" icon={Server} tone="primary" />
        <MetricCard title="Requests / min" value={metrics.requestsPerMinute.toLocaleString()} suffix="req/min" detail="Current application load" icon={Activity} tone="blue" />
        <MetricCard title="Average CPU" value={`${metrics.cpuPercent}%`} detail="Scale-out threshold 75%" icon={Cpu} tone={metrics.cpuPercent >= 75 ? 'warning' : 'primary'} />
        <MetricCard title="Response time" value={`${metrics.responseTimeMs}`} suffix="ms" detail="Estimated service latency" icon={Timer} tone={metrics.responseTimeMs > 200 ? 'warning' : 'blue'} />
        <MetricCard title="Error rate" value={`${metrics.errorRatePercent.toFixed(2)}%`} detail="Estimated from cluster health" icon={Gauge} tone={metrics.errorRatePercent > 1 ? 'danger' : 'success'} />
        <MetricCard title="Availability" value={`${metrics.availabilityPercent.toFixed(2)}%`} detail="Simulated service health" icon={ShieldCheck} tone={metrics.availabilityPercent < 99 ? 'warning' : 'success'} />
      </section>

      <Card className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-1 pt-5 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">Traffic &amp; utilization</h2>
              <span className="rounded-md border border-border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">Live</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Requests per minute and CPU utilization over time</p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Traffic</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-2" />CPU</span>
            <span className="hidden rounded-md bg-muted px-2 py-1 sm:inline-block">Last 45 samples</span>
          </div>
        </div>
        <CardContent className="px-3 pb-3 pt-2 sm:px-5"><TrafficChart points={telemetry.chartPoints} /></CardContent>
      </Card>
    </>
  );
}
