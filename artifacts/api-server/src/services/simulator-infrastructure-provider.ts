import type { InfrastructureData, InfrastructureEvent } from '@workspace/api-zod';
import type { InfrastructureProvider } from './infrastructure-provider';

type SimulatorState = {
  requestsPerMin: number;
  cpuPercent: number;
  activeInstances: number;
  responseTimeMs: number;
  status: InfrastructureData['status'];
};

const BASE_REQUESTS = 125;
const MIN_INSTANCES = 2;
const MAX_INSTANCES = 12;
const REQUEST_CAPACITY_PER_INSTANCE = 350;

/** In-memory demo data source for the API. It makes no cloud or network calls. */
export class SimulatorInfrastructureProvider implements InfrastructureProvider {
  private targetRequestsPerMin = BASE_REQUESTS;
  private state: SimulatorState = {
    requestsPerMin: BASE_REQUESTS,
    cpuPercent: 12,
    activeInstances: MIN_INSTANCES,
    responseTimeMs: 35,
    status: 'healthy',
  };
  private chartPoints: InfrastructureData['chartPoints'] = [];
  private events: InfrastructureEvent[] = [{
    id: 0,
    timestamp: Date.now(),
    kind: 'healthy',
    title: 'System healthy',
    description: 'Demo cluster is serving traffic within normal limits.',
  }];
  private previousTarget = BASE_REQUESTS;
  private pendingInstances = 0;
  private nextEventId = 1;

  constructor() {
    const timer = setInterval(() => this.tick(), 1000);
    timer.unref();
  }

  async getInfrastructureData(): Promise<InfrastructureData> {
    const errorRatePercent = this.state.status === 'degraded'
      ? Math.max(1.2, (this.state.cpuPercent - 80) * 0.16)
      : this.state.cpuPercent > 75 ? 0.24 : 0.04;
    const instances = Array.from({ length: this.state.activeInstances }, (_, index) => ({
      id: `demo-instance-${index + 1}`,
      name: `EC2 node ${String(index + 1).padStart(2, '0')}`,
      status: 'healthy' as const,
      cpuPercent: this.state.cpuPercent,
    }));

    return {
      application: { id: 'cloudscale-demo', name: 'CloudScale demo application', environment: 'Demo Mode', status: this.state.status },
      status: this.state.status,
      instances,
      loadBalancer: {
        name: 'Application Load Balancer',
        status: this.state.status === 'degraded' ? 'degraded' : 'active',
        targetCount: instances.length,
        healthyTargetCount: instances.length,
        requestsPerMinute: this.state.requestsPerMin,
      },
      autoScalingGroup: {
        name: 'Demo Auto Scaling Group',
        minCapacity: MIN_INSTANCES,
        maxCapacity: MAX_INSTANCES,
        desiredCapacity: this.state.activeInstances,
        currentCapacity: instances.length,
        thresholds: { scaleOutCpuPercent: 75, scaleInCpuPercent: 25 },
      },
      metrics: {
        requestsPerMinute: this.state.requestsPerMin,
        targetRequestsPerMinute: this.targetRequestsPerMin,
        cpuPercent: this.state.cpuPercent,
        responseTimeMs: this.state.responseTimeMs,
        errorRatePercent,
        availabilityPercent: 100 - errorRatePercent,
      },
      chartPoints: this.chartPoints,
      events: this.events,
    };
  }

  async simulateTraffic(): Promise<void> {
    this.targetRequestsPerMin = Math.min(this.targetRequestsPerMin + 1200, 8000);
  }

  async returnToBaseline(): Promise<void> {
    this.targetRequestsPerMin = BASE_REQUESTS;
  }

  private tick(): void {
    const target = this.targetRequestsPerMin;
    const before = this.state;
    const jitter = (Math.random() - 0.5) * (target * 0.15);
    let currentRequests = before.requestsPerMin + (target - before.requestsPerMin) * 0.3 + jitter;
    currentRequests = Math.max(BASE_REQUESTS * 0.8, currentRequests);

    const theoreticalCpu = (currentRequests / before.activeInstances) / REQUEST_CAPACITY_PER_INSTANCE * 100;
    let activeInstances = before.activeInstances;
    let status: SimulatorState['status'] = 'healthy';
    if (theoreticalCpu > 75 && before.activeInstances < MAX_INSTANCES) {
      activeInstances = Math.min(MAX_INSTANCES, before.activeInstances + (theoreticalCpu > 120 ? 2 : 1));
      status = 'scaling';
    } else if (theoreticalCpu < 25 && before.activeInstances > MIN_INSTANCES && target === BASE_REQUESTS) {
      activeInstances = Math.max(MIN_INSTANCES, before.activeInstances - 1);
      status = 'scaling';
    }

    let actualCpu = (currentRequests / activeInstances) / REQUEST_CAPACITY_PER_INSTANCE * 100;
    actualCpu = Math.max(2, Math.min(100, actualCpu + (Math.random() * 4 - 2)));
    if (actualCpu > 85) status = 'degraded';
    else if (status !== 'scaling') status = 'healthy';

    let responseTime = 30 + Math.random() * 10;
    if (actualCpu > 70) responseTime += Math.pow((actualCpu - 70) * 0.3, 2);
    if (actualCpu >= 98) responseTime += 500 + Math.random() * 1000;

    this.state = {
      requestsPerMin: Math.round(currentRequests),
      cpuPercent: Math.round(actualCpu),
      activeInstances,
      responseTimeMs: Math.round(responseTime),
      status,
    };

    if (target > BASE_REQUESTS) this.targetRequestsPerMin = Math.max(BASE_REQUESTS, target - target * 0.05);
    this.recordTickEvents(target, before);
    this.chartPoints = [...this.chartPoints, {
      timestamp: Date.now(),
      requestsPerMin: this.state.requestsPerMin,
      cpuPercent: this.state.cpuPercent,
    }].slice(-45);
  }

  private recordTickEvents(target: number, before: SimulatorState): void {
    const now = Date.now();
    const generated: Omit<InfrastructureEvent, 'id' | 'timestamp'>[] = [];
    if (target > this.previousTarget) {
      generated.push({ kind: 'traffic', title: 'Traffic increase detected', description: `Target load raised to ${target.toLocaleString()} requests/min.` });
    }
    if (before.cpuPercent < 75 && this.state.cpuPercent >= 75) {
      generated.push({ kind: 'threshold', title: 'CPU threshold reached', description: `Cluster utilization reached ${this.state.cpuPercent}%.` });
    }
    if (this.state.activeInstances > before.activeInstances) {
      const added = this.state.activeInstances - before.activeInstances;
      this.pendingInstances += added;
      generated.push({ kind: 'scaling', title: 'Scale-out initiated', description: `Auto Scaling added ${added} ${added === 1 ? 'instance' : 'instances'} to the cluster.` });
      generated.push({ kind: 'instance', title: added === 1 ? 'New instance starting' : 'New instances starting', description: `${this.state.activeInstances} active instances are now in the group.` });
    } else if (this.state.activeInstances < before.activeInstances) {
      const removed = before.activeInstances - this.state.activeInstances;
      generated.push({ kind: 'scaling', title: 'Scale-in completed', description: `Auto Scaling removed ${removed} idle ${removed === 1 ? 'instance' : 'instances'}.` });
    }
    if (this.pendingInstances > 0 && this.state.status === 'healthy') {
      generated.push({ kind: 'instance', title: 'Instance healthy', description: 'New capacity is healthy and accepting traffic.' });
      this.pendingInstances = 0;
    }
    if (before.status !== 'healthy' && this.state.status === 'healthy' && this.pendingInstances === 0) {
      generated.push({ kind: 'stabilized', title: target > 250 ? 'Capacity balanced' : 'Traffic stabilized', description: `Cluster is healthy with ${this.state.activeInstances} active instances.` });
    }
    if (generated.length) {
      this.events = [...generated.map((event) => ({ ...event, id: this.nextEventId++, timestamp: now })), ...this.events].slice(0, 20);
    }
    this.previousTarget = this.targetRequestsPerMin;
  }
}
