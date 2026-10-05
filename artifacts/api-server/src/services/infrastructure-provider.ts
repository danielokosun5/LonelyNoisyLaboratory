import type { InfrastructureData } from '@workspace/api-zod';

/** Server-side source boundary. API routes depend on this contract, not a data source. */
export interface InfrastructureProvider {
  getInfrastructureData(): Promise<InfrastructureData>;
  simulateTraffic(): Promise<void>;
  returnToBaseline(): Promise<void>;
}
