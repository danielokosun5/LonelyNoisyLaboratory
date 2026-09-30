import { Activity, ArrowDown, Globe2, Layers3, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MetricCard, PageHeading } from '@/components/dashboard-widgets';
import type { InfrastructureData } from '@/data/infrastructure';

export function LoadBalancerPage({ telemetry }: { telemetry: InfrastructureData }) {
  return (
    <>
      <PageHeading eyebrow="Traffic routing" title="Load Balancer" description="Explore the simulated entry point that distributes application traffic across active instances." />
      <section className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:gap-4">
        <MetricCard title="Incoming traffic" value={telemetry.loadBalancer.requestsPerMinute.toLocaleString()} suffix="req/min" detail="Current infrastructure request rate" icon={Activity} tone="blue" />
        <MetricCard title="Active targets" value={telemetry.loadBalancer.healthyTargetCount.toString()} suffix="instances" detail="Healthy load balancer targets" icon={Layers3} tone="primary" />
        <MetricCard title="Routing status" value={telemetry.loadBalancer.status === 'degraded' ? 'Watch' : 'Active'} detail="Load balancer status" icon={ShieldCheck} tone={telemetry.loadBalancer.status === 'degraded' ? 'warning' : 'success'} />
      </section>

      <Card>
        <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <h2 className="text-sm font-semibold">Application Load Balancer</h2>
            <p className="mt-1 text-xs text-muted-foreground">Conceptual routing layer in the current frontend simulation</p>
          </div>
        </div>
        <CardContent className="grid gap-3 border-t border-border px-5 py-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:px-6">
          <FlowNode icon={Globe2} title="Internet" detail={`${telemetry.metrics.requestsPerMinute.toLocaleString()} requests/min`} />
          <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground sm:rotate-[-90deg]" />
          <FlowNode icon={ShieldCheck} title="Load balancer" detail="Distributes incoming requests" highlighted />
          <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground sm:rotate-[-90deg]" />
          <FlowNode icon={Layers3} title="Healthy targets" detail={`${telemetry.loadBalancer.healthyTargetCount} active instances`} />
        </CardContent>
      </Card>
      <p className="mt-3 text-[11px] text-muted-foreground">Target health and request distribution are illustrative only; this page does not connect to AWS.</p>
    </>
  );
}

function FlowNode({ icon: Icon, title, detail, highlighted = false }: { icon: typeof ShieldCheck; title: string; detail: string; highlighted?: boolean }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 rounded-lg border px-3 py-3 ${highlighted ? 'border-primary/25 bg-primary/[0.04]' : 'border-border bg-background/50'}`}>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${highlighted ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}><Icon className="h-4 w-4" /></span>
      <span className="min-w-0">
        <span className="block text-xs font-medium">{title}</span>
        <span className="mt-1 block truncate text-[10px] text-muted-foreground">{detail}</span>
      </span>
    </div>
  );
}
