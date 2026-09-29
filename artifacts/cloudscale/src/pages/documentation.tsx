import { Globe2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { ScalingSteps } from '@/components/scaling-steps';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeading } from '@/components/dashboard-widgets';

export function DocumentationPage() {
  return (
    <>
      <PageHeading eyebrow="Resources" title="Documentation" description="Understand the request path and the scaling behavior represented in this demo." />
      <Card className="mb-4">
        <div className="px-5 pb-1 pt-5 sm:px-6">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Scaling lifecycle</p>
          <h2 className="text-sm font-semibold">How capacity responds</h2>
          <p className="mt-1 text-xs text-muted-foreground">Traffic, CPU thresholds, and instance capacity move together in the frontend simulation.</p>
        </div>
        <CardContent className="px-5 pb-5 pt-4 sm:px-6">
          <ScalingSteps />
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <InfoCard icon={LayoutDashboard} title="Load balancing">
          The simulated Application Load Balancer is the entry point for clients. The architecture view represents traffic distribution across the active instance group.
        </InfoCard>
        <InfoCard icon={ShieldCheck} title="Auto scaling">
          CPU utilization above 75% triggers a simulated scale-out. When utilization drops below 25% and traffic is back at baseline, the group scales in gradually.
        </InfoCard>
      </section>
      <p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground"><Globe2 className="h-3.5 w-3.5" /> All values and infrastructure behavior on this page are illustrative; no AWS resources are connected.</p>
    </>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: typeof LayoutDashboard; title: string; children: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{children}</p>
      </CardContent>
    </Card>
  );
}
