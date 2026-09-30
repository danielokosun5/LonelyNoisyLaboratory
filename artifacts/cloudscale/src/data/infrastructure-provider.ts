import type { InfrastructureData } from './infrastructure';

export type InfrastructureControls = {
  simulateTraffic: () => void;
  reset: () => void;
};

export type InfrastructureView = InfrastructureData & InfrastructureControls & {
  dataSource: 'api' | 'simulator-fallback';
  apiError: string | null;
};

/** Source boundary for infrastructure snapshots and demo controls consumed by the UI. */
export interface InfrastructureProvider {
  useInfrastructureData(): InfrastructureView;
}
