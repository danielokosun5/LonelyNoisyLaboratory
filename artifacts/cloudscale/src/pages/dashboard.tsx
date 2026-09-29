import { Activity, ArrowRight, Bell, Cpu, Network, Server } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { MetricCard, PageHeading } from '@/components/dashboard-widgets';
import type { DashboardTelemetry } from '@/hooks/use-dashboard-telemetry';

export function OverviewPage({ telemetry }: { telemetry: DashboardTelemetry }) {
  const { state } = telemetry;

  return (
    <>
      <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
        <span className="uppercase tracking-[0.12em]">Overview</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span>Live demo metrics</span>
      </div>
      <PageHeading eyebrow="CloudScale" title="Cloud infrastructure" description="A live snapshot of your application environment and scaling activity." />

      <section aria-label="Environment metrics" className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:gap-4 2xl:grid-cols-6">
        <MetricCard title="Active instances" value={state.activeInstances.toString()} suffix="nodes" detail="In auto scaling group" icon={Server} tone="primary" />
        <MetricCard title="Requests / min" value={state.requestsPerMin.toLocaleString()} suffix="req/min" detail="Current application load" icon={Activity} tone="blue" />
        <MetricCard title="Average CPU" value={`${state.cpuPercent}%`} detail="Scale-out threshold 75%" icon={Cpu} tone={state.cpuPercent >= 75 ? 'warning' : 'primary'} />
        <MetricCard title="Response time" value={`${state.responseTimeMs}`} suffix="ms" detail="Estimated service latency" icon={Activity} tone={state.responseTimeMs > 200 ? 'warning' : 'blue'} />
        <MetricCard title="Error rate" value={`${telemetry.errorRatePercent.toFixed(2)}%`} detail="Estimated from cluster health" icon={Bell} tone={telemetry.errorRatePercent > 1 ? 'danger' : 'success'} />
        <MetricCard title="Availability" value={`${telemetry.availabilityPercent.toFixed(2)}%`} detail="Simulated service health" icon={Network} tone={telemetry.availabilityPercent < 99 ? 'warning' : 'success'} />
      </section>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${state.status === 'degraded' ? 'bg-destructive/10 text-destructive' : state.status === 'scaling' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{state.status === 'healthy' ? 'System operational' : state.status === 'scaling' ? 'Capacity is scaling' : 'Performance is degraded'}</p>
              <p className="mt-1 text-xs text-muted-foreground">Demo Mode <span className="px-1 text-border">·</span> {state.activeInstances} active instances <span className="px-1 text-border">·</span> {state.cpuPercent}% average CPU</p>
            </div>
          </div>
          <span className="rounded-md border border-border bg-background/50 px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground">Simulation active</span>
        </div>
        <CardContent className="grid gap-3 border-t border-border px-5 py-4 sm:grid-cols-3 sm:px-6">
          <RouteShortcut href="/monitoring" title="Review monitoring" detail="Explore live traffic and CPU history" />
          <RouteShortcut href="/infrastructure" title="View infrastructure" detail="Inspect the request path and instances" />
          <RouteShortcut href="/events" title="Open recent events" detail="See simulation and scaling activity" />
        </CardContent>
      </Card>
    </>
  );
}

function RouteShortcut({ href, title, detail }: { href: string; title: string; detail: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 p-3 transition-colors hover:border-primary/30 hover:bg-muted/35">
      <span>
        <span className="block text-xs font-medium text-foreground">{title}</span>
        <span className="mt-1 block text-[10px] text-muted-foreground">{detail}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
