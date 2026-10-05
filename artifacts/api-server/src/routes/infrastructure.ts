import { Router, type IRouter } from 'express';
import {
  AutoScalingGroupSchema,
  InfrastructureEventsSchema,
  InfrastructureDataSchema,
  LoadBalancerSchema,
  TelemetryDataSchema,
  TrafficMetricsSchema,
} from '@workspace/api-zod';
import { infrastructureProvider } from '../services';

const router: IRouter = Router();

router.get('/telemetry', async (_req, res) => {
  const infrastructure = await infrastructureProvider.getInfrastructureData();
  res.json(TelemetryDataSchema.parse({
    metrics: infrastructure.metrics,
    chartPoints: infrastructure.chartPoints,
  }));
});

router.get('/events', async (_req, res) => {
  const infrastructure = await infrastructureProvider.getInfrastructureData();
  res.json(InfrastructureEventsSchema.parse(infrastructure.events));
});

router.get('/infrastructure', async (_req, res) => {
  res.json(InfrastructureDataSchema.parse(await infrastructureProvider.getInfrastructureData()));
});

router.get('/infrastructure/instances', async (_req, res) => {
  res.json((await infrastructureProvider.getInfrastructureData()).instances);
});

router.get('/infrastructure/load-balancer', async (_req, res) => {
  const infrastructure = await infrastructureProvider.getInfrastructureData();
  res.json(LoadBalancerSchema.parse(infrastructure.loadBalancer));
});

router.get('/infrastructure/auto-scaling', async (_req, res) => {
  const infrastructure = await infrastructureProvider.getInfrastructureData();
  res.json(AutoScalingGroupSchema.parse(infrastructure.autoScalingGroup));
});

router.get('/infrastructure/metrics', async (_req, res) => {
  const infrastructure = await infrastructureProvider.getInfrastructureData();
  res.json(TrafficMetricsSchema.parse(infrastructure.metrics));
});

router.get('/infrastructure/events', async (_req, res) => {
  res.json(InfrastructureEventsSchema.parse((await infrastructureProvider.getInfrastructureData()).events));
});

router.post('/infrastructure/actions/traffic-spike', async (_req, res) => {
  await infrastructureProvider.simulateTraffic();
  res.status(202).json({ accepted: true });
});

router.post('/infrastructure/actions/baseline', async (_req, res) => {
  await infrastructureProvider.returnToBaseline();
  res.status(202).json({ accepted: true });
});

export default router;
