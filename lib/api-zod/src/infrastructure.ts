import { z } from 'zod';

export const InfrastructureStatusSchema = z.enum(['healthy', 'scaling', 'degraded']);
export const InstanceStatusSchema = z.enum(['starting', 'healthy', 'unhealthy']);

export const ComputeInstanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: InstanceStatusSchema,
  cpuPercent: z.number(),
});

export const LoadBalancerSchema = z.object({
  name: z.string(),
  status: z.enum(['active', 'degraded']),
  targetCount: z.number(),
  healthyTargetCount: z.number(),
  requestsPerMinute: z.number(),
});

export const AutoScalingGroupSchema = z.object({
  name: z.string(),
  minCapacity: z.number(),
  maxCapacity: z.number(),
  desiredCapacity: z.number(),
  currentCapacity: z.number(),
  thresholds: z.object({ scaleOutCpuPercent: z.number(), scaleInCpuPercent: z.number() }),
});

export const TrafficMetricsSchema = z.object({
  requestsPerMinute: z.number(),
  targetRequestsPerMinute: z.number(),
  cpuPercent: z.number(),
  responseTimeMs: z.number(),
  errorRatePercent: z.number(),
  availabilityPercent: z.number(),
});

export const InfrastructureEventKindSchema = z.enum(['healthy', 'traffic', 'threshold', 'scaling', 'instance', 'stabilized']);
export const InfrastructureEventSchema = z.object({
  id: z.number(),
  timestamp: z.number(),
  kind: InfrastructureEventKindSchema,
  title: z.string(),
  description: z.string(),
});

export const TelemetryPointSchema = z.object({
  timestamp: z.number(),
  requestsPerMin: z.number(),
  cpuPercent: z.number(),
});

export const ApplicationEnvironmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  environment: z.string(),
  status: InfrastructureStatusSchema,
});

/** JSON-safe infrastructure snapshot shared by the API server and frontend. */
export const InfrastructureDataSchema = z.object({
  application: ApplicationEnvironmentSchema,
  status: InfrastructureStatusSchema,
  instances: z.array(ComputeInstanceSchema),
  loadBalancer: LoadBalancerSchema,
  autoScalingGroup: AutoScalingGroupSchema,
  metrics: TrafficMetricsSchema,
  chartPoints: z.array(TelemetryPointSchema),
  events: z.array(InfrastructureEventSchema),
});

export type InfrastructureStatus = z.infer<typeof InfrastructureStatusSchema>;
export type InstanceStatus = z.infer<typeof InstanceStatusSchema>;
export type ComputeInstance = z.infer<typeof ComputeInstanceSchema>;
export type LoadBalancer = z.infer<typeof LoadBalancerSchema>;
export type AutoScalingGroup = z.infer<typeof AutoScalingGroupSchema>;
export type TrafficMetrics = z.infer<typeof TrafficMetricsSchema>;
export type InfrastructureEventKind = z.infer<typeof InfrastructureEventKindSchema>;
export type InfrastructureEvent = z.infer<typeof InfrastructureEventSchema>;
export type TelemetryPoint = z.infer<typeof TelemetryPointSchema>;
export type ApplicationEnvironment = z.infer<typeof ApplicationEnvironmentSchema>;
export type InfrastructureData = z.infer<typeof InfrastructureDataSchema>;
