import { useEffect, useRef, useState } from 'react';
import type { InfrastructureProvider } from './infrastructure-provider';
import type { InfrastructureData, InfrastructureEvent, InfrastructureStatus, TelemetryPoint } from './infrastructure';
import { useSimulation } from '@/hooks/use-simulation';

type PreviousSample = { requestsPerMin: number; cpuPercent: number; activeInstances: number; status: InfrastructureStatus; target: number };

function useSimulatorInfrastructureData(): InfrastructureData {
  const { state, targetReqs, simulateTraffic, reset } = useSimulation();
  const [chartPoints, setChartPoints] = useState<TelemetryPoint[]>([]);
  const [events, setEvents] = useState<InfrastructureEvent[]>(() => [{
    id: 0, timestamp: Date.now(), kind: 'healthy', title: 'System healthy',
    description: 'Demo cluster is serving traffic within normal limits.',
  }]);
  const previous = useRef<PreviousSample>({ ...state, target: targetReqs });
  const pendingInstances = useRef(0);
  const eventId = useRef(1);

  useEffect(() => {
    const now = Date.now();
    setChartPoints((points) => [...points, { timestamp: now, requestsPerMin: state.requestsPerMin, cpuPercent: state.cpuPercent }].slice(-45));
    const before = previous.current;
    const generated: Omit<InfrastructureEvent, 'id' | 'timestamp'>[] = [];

    if (targetReqs > before.target) generated.push({ kind: 'traffic', title: 'Traffic increase detected', description: `Target load raised to ${targetReqs.toLocaleString()} requests/min.` });
    if (before.cpuPercent < 75 && state.cpuPercent >= 75) generated.push({ kind: 'threshold', title: 'CPU threshold reached', description: `Cluster utilization reached ${state.cpuPercent}%.` });
    if (state.activeInstances > before.activeInstances) {
      const added = state.activeInstances - before.activeInstances;
      pendingInstances.current += added;
      generated.push({ kind: 'scaling', title: 'Scale-out initiated', description: `Auto Scaling added ${added} ${added === 1 ? 'instance' : 'instances'} to the cluster.` });
      generated.push({ kind: 'instance', title: added === 1 ? 'New instance starting' : 'New instances starting', description: `${state.activeInstances} active instances are now in the group.` });
    } else if (state.activeInstances < before.activeInstances) {
      const removed = before.activeInstances - state.activeInstances;
      generated.push({ kind: 'scaling', title: 'Scale-in completed', description: `Auto Scaling removed ${removed} idle ${removed === 1 ? 'instance' : 'instances'}.` });
    }
    if (pendingInstances.current > 0 && state.status === 'healthy') {
      generated.push({ kind: 'instance', title: 'Instance healthy', description: 'New capacity is healthy and accepting traffic.' });
      pendingInstances.current = 0;
    }
    if (before.status !== 'healthy' && state.status === 'healthy' && pendingInstances.current === 0) {
      generated.push({ kind: 'stabilized', title: targetReqs > 250 ? 'Capacity balanced' : 'Traffic stabilized', description: `Cluster is healthy with ${state.activeInstances} active instances.` });
    }
    if (generated.length) setEvents((current) => [...generated.map((event) => ({ ...event, id: eventId.current++, timestamp: now })), ...current].slice(0, 20));
    previous.current = { ...state, target: targetReqs };
  }, [state, targetReqs]);

  const errorRatePercent = state.status === 'degraded' ? Math.max(1.2, (state.cpuPercent - 80) * 0.16) : state.cpuPercent > 75 ? 0.24 : 0.04;
  const status: InfrastructureStatus = state.status;
  const instances = Array.from({ length: state.activeInstances }, (_, index) => ({
    id: `demo-instance-${index + 1}`,
    name: `EC2 node ${String(index + 1).padStart(2, '0')}`,
    status: 'healthy' as const,
    cpuPercent: state.cpuPercent,
  }));

  return {
    application: { id: 'cloudscale-demo', name: 'CloudScale demo application', environment: 'Demo Mode', status },
    status,
    instances,
    loadBalancer: { name: 'Application Load Balancer', status: status === 'degraded' ? 'degraded' : 'active', targetCount: instances.length, healthyTargetCount: instances.length, requestsPerMinute: state.requestsPerMin },
    autoScalingGroup: { name: 'Demo Auto Scaling Group', minCapacity: 2, maxCapacity: 12, desiredCapacity: state.activeInstances, currentCapacity: instances.length, thresholds: { scaleOutCpuPercent: 75, scaleInCpuPercent: 25 } },
    metrics: { requestsPerMinute: state.requestsPerMin, targetRequestsPerMinute: targetReqs, cpuPercent: state.cpuPercent, responseTimeMs: state.responseTimeMs, errorRatePercent, availabilityPercent: 100 - errorRatePercent },
    chartPoints,
    events,
    simulateTraffic,
    reset,
  };
}

export const simulatorInfrastructureProvider: InfrastructureProvider = {
  useInfrastructureData: useSimulatorInfrastructureData,
};

export function useProviderInfrastructureData(provider: InfrastructureProvider): InfrastructureData {
  return provider.useInfrastructureData();
}
