export type InstanceStatus = 'starting' | 'healthy' | 'unhealthy';
export type InfrastructureStatus = 'healthy' | 'scaling' | 'degraded';

export type ComputeInstance = {
  id: string;
  name: string;
  status: InstanceStatus;
  cpuPercent: number;
};

export type LoadBalancer = {
  name: string;
  status: 'active' | 'degraded';
  targetCount: number;
  healthyTargetCount: number;
  requestsPerMinute: number;
};

export type AutoScalingGroup = {
  name: string;
  minCapacity: number;
  maxCapacity: number;
  desiredCapacity: number;
  currentCapacity: number;
  thresholds: { scaleOutCpuPercent: number; scaleInCpuPercent: number };
};

export type TrafficMetrics = {
  requestsPerMinute: number;
  targetRequestsPerMinute: number;
  cpuPercent: number;
  responseTimeMs: number;
  errorRatePercent: number;
  availabilityPercent: number;
};

export type InfrastructureEventKind = 'healthy' | 'traffic' | 'threshold' | 'scaling' | 'instance' | 'stabilized';
export type InfrastructureEvent = {
  id: number;
  timestamp: number;
  kind: InfrastructureEventKind;
  title: string;
  description: string;
};

export type TelemetryPoint = {
  timestamp: number;
  requestsPerMin: number;
  cpuPercent: number;
};

export type ApplicationEnvironment = {
  id: string;
  name: string;
  environment: string;
  status: InfrastructureStatus;
};

export type InfrastructureData = {
  application: ApplicationEnvironment;
  status: InfrastructureStatus;
  instances: ComputeInstance[];
  loadBalancer: LoadBalancer;
  autoScalingGroup: AutoScalingGroup;
  metrics: TrafficMetrics;
  chartPoints: TelemetryPoint[];
  events: InfrastructureEvent[];
  simulateTraffic: () => void;
  reset: () => void;
};
