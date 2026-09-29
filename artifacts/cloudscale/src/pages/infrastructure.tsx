import { ArchitectureDiagram } from '@/components/architecture-diagram';
import { PageHeading } from '@/components/dashboard-widgets';
import type { DashboardTelemetry } from '@/hooks/use-dashboard-telemetry';

export function InfrastructurePage({ telemetry }: { telemetry: DashboardTelemetry }) {
  return (
    <>
      <PageHeading eyebrow="Topology" title="Infrastructure" description="A live view of the request path and active compute capacity." />
      <ArchitectureDiagram
        activeInstances={telemetry.state.activeInstances}
        status={telemetry.state.status}
        requestsPerMin={telemetry.state.requestsPerMin}
      />
    </>
  );
}
