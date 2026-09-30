import type { InfrastructureEvent, InfrastructureEventKind, TelemetryPoint } from '@/data/infrastructure';
import type { InfrastructureView } from '@/data/infrastructure-provider';
import { apiInfrastructureProvider } from '@/data/api-infrastructure-provider';

// UI entry point for the active data source. Pages only see the infrastructure contract.
export type DashboardTelemetry = InfrastructureView;
export type DashboardEvent = InfrastructureEvent;
export type DashboardEventKind = InfrastructureEventKind;
export type { TelemetryPoint };

export function useDashboardTelemetry(): DashboardTelemetry {
  return apiInfrastructureProvider.useInfrastructureData();
}
