import type { InfrastructureData, InfrastructureEvent, InfrastructureEventKind, TelemetryPoint } from '@/data/infrastructure';
import { simulatorInfrastructureProvider, useProviderInfrastructureData } from '@/data/simulator-infrastructure-provider';

// UI entry point for the active data source. Pages only see the infrastructure contract.
export type DashboardTelemetry = InfrastructureData;
export type DashboardEvent = InfrastructureEvent;
export type DashboardEventKind = InfrastructureEventKind;
export type { TelemetryPoint };

export function useDashboardTelemetry(): DashboardTelemetry {
  return useProviderInfrastructureData(simulatorInfrastructureProvider);
}
