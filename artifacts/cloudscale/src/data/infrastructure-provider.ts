import type { InfrastructureData } from './infrastructure';

/** Source boundary for infrastructure snapshots and demo controls consumed by the UI. */
export interface InfrastructureProvider {
  useInfrastructureData(): InfrastructureData;
}
