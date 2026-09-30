import { ArchitectureDiagram } from '@/components/architecture-diagram';
import { PageHeading } from '@/components/dashboard-widgets';
import type { InfrastructureData } from '@/data/infrastructure';

export function InfrastructurePage({ telemetry }: { telemetry: InfrastructureData }) {
  return (
    <>
      <PageHeading eyebrow="Topology" title="Infrastructure" description="A live view of the request path and active compute capacity." />
      <ArchitectureDiagram
        instances={telemetry.instances}
        status={telemetry.status}
        requestsPerMin={telemetry.metrics.requestsPerMinute}
      />
    </>
  );
}
