import { Activity, ArrowDown, Globe2, Server, ShieldCheck } from 'lucide-react';
import type { ComputeInstance, InfrastructureStatus } from '@/data/infrastructure';
import { Badge } from '@/components/ui/badge';

type ArchitectureDiagramProps = {
  instances: ComputeInstance[];
  status: InfrastructureStatus;
  requestsPerMin: number;
};

const statusLabels: Record<InfrastructureStatus, string> = {
  healthy: 'Healthy',
  scaling: 'Scaling',
  degraded: 'Degraded',
};

export function ArchitectureDiagram({
  instances,
  status,
  requestsPerMin,
}: ArchitectureDiagramProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-6 lg:p-7">
      <div className="absolute right-5 top-5 flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className={`h-3.5 w-3.5 ${status === 'degraded' ? 'text-destructive' : status === 'scaling' ? 'text-warning' : 'text-success'}`} />
        <span>Demo cluster</span>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center pt-8">
        <div className="flex w-full max-w-sm items-center gap-4 rounded-xl border border-border bg-background/60 px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Globe2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Internet</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Incoming application traffic</p>
          </div>
          <span className="font-mono text-xs tabular-nums text-foreground">{requestsPerMin.toLocaleString()} <span className="text-muted-foreground">req/min</span></span>
        </div>

        <Connector />

        <div id="load-balancer" className="flex w-full max-w-sm scroll-mt-24 items-center gap-4 rounded-xl border border-primary/25 bg-primary/[0.04] px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Application Load Balancer</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Distributes requests across healthy targets</p>
          </div>
          <Badge variant="healthy" className="hidden sm:inline-flex">Active</Badge>
        </div>

        <Connector />

        <div id="autoscaling" className={`w-full scroll-mt-24 rounded-xl border p-4 transition-colors sm:p-5 ${status === 'degraded' ? 'border-destructive/30 bg-destructive/[0.035]' : status === 'scaling' ? 'border-warning/30 bg-warning/[0.035]' : 'border-border bg-background/40'}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Auto Scaling Group</p>
              <p className="mt-1 text-xs text-muted-foreground">EC2 capacity managed by simulated CPU thresholds</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={status === 'healthy' ? 'healthy' : status === 'scaling' ? 'warning' : 'destructive'}>{statusLabels[status]}</Badge>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">{instances.length} / 12</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
            {instances.map((instance, index) => {
              return (
                <div
                  key={index}
                  className="instance-node flex min-w-0 items-center gap-2.5 rounded-lg border border-border bg-card px-2.5 py-2.5 sm:gap-3 sm:px-3"
                  style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Server className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{instance.name}</p>
                    <p className="mt-0.5 text-[10px] text-success">{instance.status === 'healthy' ? 'Active' : instance.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">Instance nodes appear as capacity scales out and leave when the group scales in.</p>
        </div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex h-10 flex-col items-center justify-center text-muted-foreground" aria-hidden="true">
      <div className="h-5 w-px bg-border" />
      <ArrowDown className="-mt-1 h-4 w-4" />
    </div>
  );
}
