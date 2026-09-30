import type { InfrastructureProvider } from './infrastructure-provider';
import { SimulatorInfrastructureProvider } from './simulator-infrastructure-provider';

/** Composition point: switch the provider here when a real source is added later. */
export const infrastructureProvider: InfrastructureProvider = new SimulatorInfrastructureProvider();
